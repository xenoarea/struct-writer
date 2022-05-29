import createObjectResolver from '../src/createObjectResolver.js'
import test from 'ava'

function createValueResolver (func) {
    return async (state) => {
        return await new Promise(resolve => {
            setTimeout(() => resolve(func(state)), 5)
        })
    }
}

test ('should resolve simple function node', async (t) => {
    const resolveObject = createObjectResolver()

    const expected = 'Xeno'

    const schema = createValueResolver(() => expected)

    const output = await resolveObject(schema)

    t.is(output, expected)
})

test ('should include function node if include option resolution is truthy', async (t) => {
    const resolveObject = createObjectResolver()

    const expected = 'Xeno'

    const nodeSchema = createValueResolver(() => expected)
    const nodeInclude = createValueResolver(() => true)

    const nodeOptions = {
        include: nodeInclude
    }

    const schema = [nodeSchema, nodeOptions]

    const output = await resolveObject(schema)

    t.is(output, expected)
})

test ('should not include function node if include option resolution is falsy', async (t) => {
    const resolveObject = createObjectResolver()

    const unexpected = 'Xeno'
    const expected = undefined

    const nodeSchema = createValueResolver(() => unexpected)
    const nodeInclude = createValueResolver(() => false)

    const nodeOptions = {
        include: nodeInclude
    }

    const schema = [nodeSchema, nodeOptions]

    const output = await resolveObject(schema)

    t.is(output, expected)
})

test ('should repeat function node until repeat option resolution is falsy', async (t) => {
    const resolveObject = createObjectResolver()

    const expected = [
        'Earth',
        'Jupiter',
        'Saturn',
        'Mars',
        'Venus',
        'Mercury',
        'Neptune',
        'Uranus'
    ]

    const nodeSchema = createValueResolver((state) => expected[state?.length || 0])
    const nodeRepeat = createValueResolver((state) => state.length < expected.length)

    const nodeOptions = {
        repeat: nodeRepeat
    }

    const schema = [nodeSchema, nodeOptions]

    const output = await resolveObject(schema)

    t.deepEqual(output, expected)
})

test ('should keep function node until persist option resolution is falsy', async (t) => {
    const resolveObject = createObjectResolver()

    const list = [
        'Earth',
        'Jupiter',
        'Saturn',
        'Mars',
        'Venus',
        'Mercury',
        'Neptune',
        'Uranus'
    ]

    const expectedIndex = 3
    const expected = list[expectedIndex]

    let i = 0

    const nodeSchema = createValueResolver(() => list[i])
    
    const nodePersist = createValueResolver(() => {
        const shouldPersist = i === expectedIndex
        i++
        return shouldPersist
    })

    const nodeOptions = {
        persist: nodePersist
    }

    const schema = [nodeSchema, nodeOptions]

    const output = await resolveObject(schema)

    t.deepEqual(output, expected)
})

test ('should keep repeated function node until persist option resolution is falsy', async (t) => {
    const resolveObject = createObjectResolver()

    const list = [
        'Earth',
        'Jupiter',
        'Saturn',
        'Mars',
        'Venus',
        'Mercury',
        'Neptune',
        'Uranus'
    ]

    const expected = list.slice(0, 4)

    let i = 0

    const nodeSchema = createValueResolver(() => list[i++])
    const nodeRepeat = createValueResolver(() => i < list.length)
    const nodePersist = createValueResolver((state) => state.length < 5)

    const nodeOptions = {
        repeat: nodeRepeat,
        persist: nodePersist
    }

    const schema = [nodeSchema, nodeOptions]

    const output = await resolveObject(schema)

    t.deepEqual(output, expected)
})



/*
test('should resolve simple nodes', async (t) => {
    const resolveObject = createObjectResolver()

    const expected = {
        name: 'Xeno',
        email: 'xenoarea@protonmail.com'
    }

    const getName = createValueResolver(() => expected.name)
    const getEmail = createValueResolver(() => expected.email)

    const schema = {
        name: getName,
        email: getEmail
    }

    const output = await resolveObject(schema)

    t.deepEqual(output, expected)
})

test('should resolve nested nodes', async (t) => {
    const resolveObject = createObjectResolver()

    const expected = {
        author: {
            name: 'Xeno',
            email: 'xenoarea@protonmail.com'
        }
    }

    const getName = createValueResolver(() => expected.author.name)
    const getEmail = createValueResolver(() => expected.author.email)

    const schema = {
        author: {
            name: getName,
            email: getEmail
        }
    }

    const output = await resolveObject(schema)

    t.deepEqual(output, expected)
})

test('should not include value if include option is falsy', async (t) => {
    const resolveObject = createObjectResolver()

    const expected = {
        name: null
    }

    const getName = createValueResolver(() => 'Xeno')
    const getIncludeOption = createValueResolver(() => false)

    const nodeOptions = {
        include: getIncludeOption
    }

    const schema = {
        name: [getName, nodeOptions]
    }

    const output = await resolveObject(schema)

    t.deepEqual(output, expected)
})

test('should include value if include option is truthy', async (t) => {
    const resolveObject = createObjectResolver()

    const expected = {
        name: 'Xeno'
    }

    const getName = createValueResolver(() => expected.name)
    const getIncludeOption = createValueResolver(() => true)

    const nodeOptions = {
        include: getIncludeOption
    }

    const schema = {
        name: [getName, nodeOptions]
    }

    const output = await resolveObject(schema)

    t.deepEqual(output, expected)
})

test('should repeat node if repeat option is defined', async (t) => {
    const resolveObject = createObjectResolver()

    const expected = {
        meals: [
            'pizza',
            'burger',
            'hotdog'
        ]
    }

    let i = 0

    const getName = createValueResolver(() => {
        return expected.meals[i++].name
    })

    const getRepeatOption = createValueResolver((state) => {
        return (state?.meals?.length || 0) < 3
    })

    const nodeOptions = {
        repeat: getRepeatOption
    }

    const schema = {
        meals: [{ name: getName }, nodeOptions]
    }

    const output = await resolveObject(schema)

    t.deepEqual(output, expected)
})
*/