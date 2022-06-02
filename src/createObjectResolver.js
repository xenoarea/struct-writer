function returnTrue () {
    return true
}

function defaultAdapter (fn) {
    return fn
}

function createKeyPathSegment (key, node) {
    return {
        key,
        isRepeated: node.isRepeated,
        shouldMerge: false
    }
}

function updateShouldMergeProp (keySegment, shouldMerge) {
    return {
        ...keySegment,
        shouldMerge
    }
}

function tail (array) {
    const root = array.slice(0, array.length - 1)
    const last = array.at(-1)
    return [root, last]
}

function updateLastShouldMergeProp (keyPath, shouldMerge) {
    const [root, last] = tail(keyPath)
    return root.concat(updateShouldMergeProp(last, shouldMerge))
}

function updateRootShouldMergeProp (keyPath, shouldMerge) {
    return keyPath.map((keySegment, index) => {
        return index < keyPath.length - 1
            ? updateShouldMergeProp(keySegment, shouldMerge)
            : keySegment
    })
}

function mergeState (value, prevState, keyPath) {
    const [{ key, isRepeated, shouldMerge }, ...nextKeyPath] = keyPath

    if (key === null && nextKeyPath.length === 0 && isRepeated === true) {
        const baseState = prevState || []
        return [...baseState, value]
    }

    if (key === null && nextKeyPath.length === 0 && isRepeated !== true) {
        return value
    }

    if (key === null && nextKeyPath.length > 0 && isRepeated === true && shouldMerge === true) {
        const baseState = prevState || []
        const [root, last] = tail(baseState)
        const nextValue = mergeState(value, last, nextKeyPath)
        return [...root, nextValue]
    }

    if (key === null && nextKeyPath.length > 0 && isRepeated === true && shouldMerge !== true) {
        const baseState = prevState || []
        const nextValue = mergeState(value, null, nextKeyPath)
        return [...baseState, nextValue]
    }

    return prevState
}

const defaultOptions = {
    adaptNodePayload: defaultAdapter,
    adaptIncludeOption: defaultAdapter,
    adaptPersistOption: defaultAdapter,
    adaptRepeatOption: defaultAdapter,
}

function createObjectResolver (options) {
    const opts = {
        ...defaultOptions,
        ...options
    }

    function createNodeObjectProcessor (keyPath) {
        return async (state, [key, nodeSchema]) => {
            return processNode(nodeSchema, await state, keyPath, key)
        }
    }

    async function resolveNodeObject (node, prevState, keyPath) {
        return await Object.entries(node).reduce(createNodeObjectProcessor(keyPath), Promise.resolve(prevState))
    }

    async function resolveNodeFunction (resolveValue, prevState, keyPath) {
        const value = await resolveValue(prevState)
        return mergeState(value, prevState, keyPath)
    }

    async function resolveNode (node, prevState, keyPath) {
        if (Array.isArray(node.payload)) {
            return await processNode(node.payload, prevState, keyPath)
        }

        if (typeof node.payload === 'object') {
            return await resolveNodeObject(node.payload, prevState, keyPath)
        }

        if (typeof node.payload === 'function') {
            return await resolveNodeFunction(node.payload, prevState, keyPath)
        }

        return prevState
    }

    function breakDownNode (nodeSchema) {
        return Array.isArray(nodeSchema)
            ? [nodeSchema[0], nodeSchema[1] || {}]
            : [nodeSchema, {}]
    }

    function createNode (nodePayload, nodeOptions) {

        const { include, repeat, persist } = nodeOptions

        const payload = opts.adaptNodePayload(nodePayload)

        const isRepeated = !!repeat

        const resolveShouldRepeat = isRepeated
            ? opts.adaptRepeatOption(repeat)
            : null

        const resolveShouldInclude = include
            ? opts.adaptIncludeOption(include)
            : returnTrue

        const resolveShouldPersist = persist
            ? opts.adaptPersistOption(persist)
            : returnTrue

        return {
            payload,
            isRepeated,
            resolveShouldRepeat,
            resolveShouldInclude,
            resolveShouldPersist
        }
    }

    function instanciateNode (nodeSchema) {
        const [nodePayload, nodeOptions] = breakDownNode(nodeSchema)
        return createNode(nodePayload, nodeOptions)
    }

    async function pipePersistResolving (node, prevState, keyPath) {
        const nextState = await resolveNode(node, prevState, keyPath)

        const i = await node.resolveShouldPersist(nextState)

        return await node.resolveShouldPersist(nextState)
            ? nextState
            : prevState
    }

    async function pipeRepeatResolving (node, prevState, keyPath, isFirstIteration) {
        const updatedKeyPath = isFirstIteration
            ? updateLastShouldMergeProp(keyPath, false)
            : updateRootShouldMergeProp(keyPath, true)

        const nextState = await pipePersistResolving(node, prevState, updatedKeyPath)

        return node.isRepeated && await node.resolveShouldRepeat(nextState)
            ? await pipeRepeatResolving(node, nextState, updatedKeyPath, false)
            : nextState
    }

    async function pipeIncludeResolving (node, prevState, keyPath) {
        return await node.resolveShouldInclude(prevState)
            ? pipeRepeatResolving(node, prevState, keyPath, true)
            : prevState
    }

    function processNode (nodeSchema, prevState = null, keyPath = [], key = null) {
        const node = instanciateNode(nodeSchema)
        const nextKeyPath = keyPath.concat(createKeyPathSegment(key, node))
        return pipeIncludeResolving(node, prevState, nextKeyPath)
    }

    async function resolveObject (schema) {
        return await processNode(schema)
    }

    return resolveObject
}

export default createObjectResolver



/*


1. put yourself at false
2. pur your previous at true

p1
    p2
        p3  false.false.false
        p3  true.true.false
        p3  true.true.false
    p2      
        p3  true.false.false
        p3  true.true.false
        p3  true.true.false
    p2
        p3  true.false.false
        p3  true.true.false
        p3  true.true.false
p1      
    p2
        p3  false.false.false
        p3  true.true.false
        p3  true.true.false
    p2
        p3  true.false.false
        p3  true.true.false
        p3  true.true.false
    p2
        p3  true.false.false
        p3  true.true.false
        p3  true.true.false
*/