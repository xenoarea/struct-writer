/*
function unwrapNode (rawNode) {
    return Array.isArray(rawNode) ? rawNode : [rawNode, {}]
}

function splitLastItem (array) {
    const head = array.slice(0, array.length - 1)
    const tail = array.at(-1)
    return [head, tail]
}

function mergeObjectSlice (slice, key, merge) {
    return {
        ...slice,
        [key]: merge
    }
}

function mergeArraySlice (slice, key, merge, isFirst) {
    if (isFirst) {
        const newItem = mergeObjectSlice({}, key, merge)
    
        return [
            ...slice,
            newItem
        ]
    }

    const [prevState, lastItem = {}] = splitLastItem(slice)

    const updatedLastItem = mergeObjectSlice(lastItem, key, merge)

    return [
        ...prevState,
        updatedLastItem
    ]
}

function mergeState (state, keyPath, merge, isFirst) {
    const [{ key, repeated }, ...nextKeyPath] = keyPath

    if (nextKeyPath.length === 0) {
        if (Array.isArray(state)) {
            return mergeArraySlice(state, key, merge, isFirst)
        }

        return mergeObjectSlice(state, key, merge)
    }

    const defaultNextSlice = repeated ? [] : {}

    if (Array.isArray(state)) {
        const nextSlice = state.at(-1)?.[key] 
        const value = mergeState(nextSlice || defaultNextSlice, nextKeyPath, merge, isFirst)
        return mergeArraySlice(state, key, value)
    }

    const value = mergeState(state[key] || defaultNextSlice, nextKeyPath, merge, isFirst)
    return mergeObjectSlice(state, key, value)
}

function defaultAdapter (item) {
    return item
}

const defaultOptions = {
    adaptNode: defaultAdapter,
    adaptIncludeOption: defaultAdapter,
    adaptRepeatOption: defaultAdapter,
    adaptPersistOption: defaultAdapter
}

function createCrawler (options) {
    const composedOptions = {
        ...defaultOptions,
        ...options
    }

    async function pipeNode (node, state, keyPath, isFirst) {
        const adaptedNode = await composedOptions.adaptNode(node)

        if (typeof adaptedNode === 'function') {
            return mergeState(state, keyPath, await adaptedNode(state), isFirst)
        }

        if (typeof adaptedNode === 'object') {
            return await recursiveCrawl(node, state, keyPath)
        }

        return state
    }

    async function repeatNode (node, confirmRepeat, confirmPersist, state, keyPath) {
        const newState = await pipeNode(node, state, keyPath)
      
        const nextState = !confirmPersist || await confirmPersist(newState)
          ? newState
          : state
      
        if (await confirmRepeat(nextState)) {
          return await repeatNode(
            node,
            confirmRepeat,
            confirmPersist,
            nextState,
            keyPath  
          )
        }
      
        return nextState
    }

    async function pipeNodeRepeatOption (node, opts, state, keyPath, isFirst) {
        const { repeat, persist } = opts
      
        if (!!repeat) {
          const confirmRepeat = composedOptions.adaptRepeatOption(repeat)
          const confirmPersist = !!persist ? composedOptions.adaptPersistOption(persist) : null
          
          return await repeatNode(
            node,
            confirmRepeat,
            confirmPersist,
            state,
            keyPath
          )
        }

        return await pipeNode(
          node,
          state,
          keyPath,
          isFirst
        )
    }

    async function pipeNodeIncludeOption (node, opts, state, keyPath, isFirst) {
        const { include, repeat } = opts
      
        if (!!include && !await composedOptions.adaptIncludeOption(include)(state)) {
          return await mergeState(state, keyPath, !!repeat ? [] : null, isFirst)
        }
      
        return await pipeNodeRepeatOption(node, opts, state, keyPath, isFirst)
    }

    async function processNode (rawNode, state, keyPath, key, isFirst) {
        const [node, opts] = unwrapNode(rawNode)
    
        const nextKeyPath = keyPath.concat({
            key,
            repeated: !!opts.repeat
        })
    
        return await pipeNodeIncludeOption(node, opts, state, nextKeyPath, isFirst)
    }

    function createCrawlerReducer (keyPath) {
        return async (newState, [key, rawNode], index) => {
            const state = await newState
            const isFirst = index === 0
            
            return await processNode(
                rawNode,
                state,
                keyPath,
                key,
                isFirst
            )  
        }
    }

    async function recursiveCrawl (node, state = {}, keyPath = []) {
        return await Object.entries(node).reduce(createCrawlerReducer(keyPath), Promise.resolve(state))
    }

    async function resolveObject (schema) {
        return await recursiveCrawl(schema)
    }

    return resolveObject
}

export default createCrawler
*/


function getPayloadAndOptionsFromNode (node) {
    return Array.isArray(node)
        ? [node[0], node[1] || {}]
        : [node, {}]
}

function incrementKeyPath (prevKeyPath, key, isRepeated) {
    return prevKeyPath.concat({ key, isRepeated })
}

function mergeState (value, lowerState, keyPath) {
    return null

    /*
    const [{ key, isRepeated, isNewNode }, ...nextKeyPath] = keyPath

    if (key === null && isRepeated === false && nextKeyPath.length === 0) {
        return value
    }

    if (key === null && isRepeated === true && nextKeyPath.length === 0) {
        const baseState = lowerState || []
        return [...baseState, value]
    }

    if (key === null && isRepeated == true && nextKeyPath.length === 1 && isNewNode !== true) {
        const baseState = lowerState || []
        const nextValue = mergeState(value, null, nextKeyPath)

        return [...baseState, nextValue]
    }

    if (key === null && isRepeated == true && nextKeyPath.length === 1 && isNewNode === true) {
        const [baseState, lastEntity] = tail(lowerState || [])
        const nextValue = mergeState(value, lastEntity, nextKeyPath)

        return [...baseState, nextValue]
    }

    return mergeState(value, null, nextKeyPath)
    */
}

function createObjectResolver () {
    async function resolveFunctionNode (nodeFunction, prevState, keyPath) {
        const value = await nodeFunction(prevState)

        return mergeState(
            value,
            prevState,
            keyPath
        )
    }

    function createObjectNodeReducer (keyPath) {
        return async (state, [key, node]) => {
            const prevState = await state

            return await processNode(
                node,
                prevState,
                keyPath,
                key
            )
        }
    }

    async function resolveObjectNode (nodeObject, prevState, keyPath) {
        return await Object.entries(nodeObject).reduce(createObjectNodeReducer(keyPath), Promise.resolve(prevState))
    }

    async function resolveNode (nodeSchema, prevState, keyPath) {
        if (typeof nodeSchema === 'function') {
            console.log('function', JSON.stringify(keyPath))
            return await resolveFunctionNode(
                nodeSchema,
                prevState,
                keyPath
            )
        }

        if (Array.isArray(nodeSchema)) {
            console.log('node', JSON.stringify(keyPath))
            return await processNode(
                nodeSchema,
                prevState,
                keyPath,
                null
            )
        }

        if (typeof nodeSchema === 'object') {
            return await resolveObjectNode(
                nodeSchema,
                prevState,
                keyPath
            )
        }

        return prevState
    }

    async function resolveNodeRepeatedly (nodeSchema, nodeOptions, prevState, keyPath) {
        console.log('repeat')
        const updatedState = await resolveNode(
            nodeSchema,
            prevState,
            keyPath
        )

        const { repeat, persist } = nodeOptions

        const nextState = !persist || await persist(updatedState)
            ? updatedState
            : prevState

        if (await repeat(nextState)) {
            return await resolveNodeRepeatedly(
                nodeSchema,
                nodeOptions,
                nextState,
                keyPath
            )
        }

        return nextState
    }

    async function resolveNodeOnce (nodeSchema, prevState, keyPath) {
        const nextState = await resolveNode(
            nodeSchema,
            prevState,
            keyPath
        )

        return nextState
    }

    async function processRepeatOption (nodeSchema, nodeOptions, prevState, prevKeyPath, key) {
        if (nodeOptions.repeat) {
            const keyPath = incrementKeyPath(prevKeyPath, key, true)

            return resolveNodeRepeatedly(
                nodeSchema,
                nodeOptions,
                prevState,
                keyPath
            )
        }

        const keyPath = incrementKeyPath(prevKeyPath, key, false)

        return resolveNodeOnce(
            nodeSchema,
            prevState,
            keyPath
        )
    }

    async function processIncludeOption (nodeSchema, nodeOptions, prevState, prevKeyPath, key) {
        const { include, ...nextNodeOptions } = nodeOptions

        if (!include || await include(prevState)) {
            return processRepeatOption(
                nodeSchema,
                nextNodeOptions,
                prevState,
                prevKeyPath,
                key
            )
        }

        return prevState
    }

    async function processNode (node, prevState = null, prevKeyPath = [], key = null) {
        const [nodePayload, nodeOptions] = getPayloadAndOptionsFromNode(node)

        const nodeSchema = nodePayload

        return await processIncludeOption(
            nodeSchema,
            nodeOptions,
            prevState,
            prevKeyPath,
            key
        )
    }

    async function resolveObject (schema) {
        return await processNode(schema)
    }

    return resolveObject
}

export default createObjectResolver