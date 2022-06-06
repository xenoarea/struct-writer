import write from '../src/write.js'
import test from 'ava'

test ('Should write simple value if no keypath is provided', async (t) => {
    const expected = Math.random()
    const output = write(expected)

    t.is(output, expected)
})

test ('Should replace base by simple value if no keypath is provided', async (t) => {
    const base = 'Some value'
    const expected = Math.random()
    const output = write(expected, [], base)

    t.is(output, expected)
})

test ('Should write value inside of an array when only key segment option array is true', async (t) => {
    const value = Math.random()
    const expected = [value]
    const output = write(value, [{ array: true }])

    t.deepEqual(output, expected)
})

test ('Should replace last item inside of an array when update is true and index is not defined', async (t) => {
    const base = ['item1', 'item2', 'item3']
    const value = Math.random()
    const expected = base.slice(0, base.length - 1).concat(value)
    const output = write(value, [{ array: true, update: true }], base)

    t.deepEqual(output, expected)
})

test ('Should replace item at the given index inside of an array when update is true and index is defined', async (t) => {
    const base = ['item1', 'item2', 'item3']
    const index = 1
    const value = Math.random()
    const expected = base.slice(0, index).concat(value).concat(base.slice(index + 1))
    const output = write(value, [{ array: true, update: true, index }], base)

    t.deepEqual(output, expected)
})

test ('Should insert item at the given index inside of an array when update is not defined and index is defined', async (t) => {
    const base = ['item1', 'item2', 'item3']
    const index = 1
    const value = Math.random()
    const expected = base.slice(0, index).concat(value).concat(base.slice(index))
    const output = write(value, [{ array: true, index }], base)

    t.deepEqual(output, expected)
})

test ('Should set field when defined in keypath', async (t) => {
    const value = Math.random()
    const expected = { field1: { field2: { field3: value } } }
    const output = write(value, ['field1', 'field2', 'field3'])

    t.deepEqual(output, expected)
})

test ('Should set field when defined in keypath and base is given', async (t) => {
    const base = { field1: { field2: { field3: 'Hello' } } }
    const value = Math.random()
    const expected = { field1: { field2: { field3: 'Hello', field4: value } } }
    const output = write(value, ['field1', 'field2', 'field4'], base)

    t.deepEqual(output, expected)
})

test ('Should create array with simple value in nested keys', async (t) => {
    const value = Math.random()
    const expected = { field1: { field2: { field3: [value] } } }
    const output = write(value, ['field1', 'field2', { key: 'field3', array: true }])

    t.deepEqual(output, expected)
})

test ('Should insert item at the end of an array in nested keys', async (t) => {
    const base = { field1: { field2: { field3: ['Hi'] } } }
    const value = Math.random()
    const expected = { field1: { field2: { field3: ['Hi', value] } } }
    const output = write(value, ['field1', 'field2', { key: 'field3', array: true }], base)

    t.deepEqual(output, expected)
})

test ('Should insert item at the given index of an array in nested keys', async (t) => {
    const base = { field1: { field2: { field3: ['Hi'] } } }
    const value = Math.random()
    const expected = { field1: { field2: { field3: [value, 'Hi'] } } }
    const output = write(value, ['field1', 'field2', { key: 'field3', array: true, index: 0 }], base)

    t.deepEqual(output, expected)
})

test ('Should replace last item of an array in nested keys', async (t) => {
    const base = { field1: { field2: { field3: ['Hi', 'Hello'] } } }
    const value = Math.random()
    const expected = { field1: { field2: { field3: ['Hi', value] } } }
    const output = write(value, ['field1', 'field2', { key: 'field3', array: true, update: true }], base)

    t.deepEqual(output, expected)
})

test ('Should replace item at a given index of an array in nested keys', async (t) => {
    const base = { field1: { field2: { field3: ['Hi', 'Hello'] } } }
    const value = Math.random()
    const expected = { field1: { field2: { field3: [value, 'Hello'] } } }
    const output = write(value, ['field1', 'field2', { key: 'field3', array: true, update: true, index: 0 }], base)

    t.deepEqual(output, expected)
})

test ('Should insert object as an array item in nested keys', async (t) => {
    const value = Math.random()
    const expected = { field1: { field2: { field3: [{ field4: { field5: value } }] } } }
    const output = write(value, ['field1', 'field2', { key: 'field3', array: true }, 'field4', 'field5'])

    t.deepEqual(output, expected)
})


test ('Should add key to last object as an array item in nested keys', async (t) => {
    const base = { field1: { field2: { field3: ['Hello', { field4: { field5: 'Hi' } }] } } }
    const value = Math.random()
    const expected = { field1: { field2: { field3: ['Hello', { field4: { field5: 'Hi', field6: value } }] } } }
    const output = write(value, ['field1', 'field2', { key: 'field3', array: true, update: true }, 'field4', 'field6'], base)

    t.deepEqual(output, expected)
})

test ('Should replace object with key to the given index of an array item in nested keys', async (t) => {
    const base = { field1: { field2: { field3: ['Hello', { field4: { field5: 'Hi' } }] } } }
    const value = Math.random()
    const expected = { field1: { field2: { field3: [{ field4: { field5: value } }, { field4: { field5: 'Hi' } }] } } }
    const output = write(value, ['field1', 'field2', { key: 'field3', array: true, update: true, index: 0 }, 'field4', 'field5'], base)

    console.log('output', JSON.stringify(output))

    t.deepEqual(output, expected)
})

test ('Should insert object with key to the given index of an array item in nested keys', async (t) => {
    const base = { field1: { field2: { field3: ['Hello', { field4: { field5: 'Hi' } }] } } }
    const value = Math.random()
    const expected = { field1: { field2: { field3: ['Hello', { field4: { field5: value } }, { field4: { field5: 'Hi' } }] } } }
    const output = write(value, ['field1', 'field2', { key: 'field3', array: true, index: 1 }, 'field4', 'field5'], base)

    t.deepEqual(output, expected)
})
