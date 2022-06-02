import createObjectResolver from "./createObjectResolver.js"

function createValueResolver (func) {
    return async (state) => {
        return await new Promise(resolve => {
            setTimeout(() => resolve(func(state)), 5)
        })
    }
}

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

const nodeFunction = createValueResolver(() => Math.random())

let count1 = 0

const nodeRepeatOption1 = createValueResolver(() => {
    return ++count1 < 4
})

const nodeOptions1 = {
    repeat: nodeRepeatOption1
}

let count2 = 0

const nodeRepeatOption2 = createValueResolver(() => {
    count1 = 0
    return ++count2 < 2
})

const nodeOptions2 = {
    repeat: nodeRepeatOption2
}

let count3 = 0

const nodeRepeatOption3 = createValueResolver(() => {
    count2 = 0
    return ++count3 < 2
})

const nodeOptions3 = {
    repeat: nodeRepeatOption3
}


//[[[x,x,x,x], [x,x,x,x], [x,x,x,x]], [[x,x,x,x], [x,x,x,x], [x,x,x,x]]]

const schema = [[[nodeFunction, nodeOptions1], nodeOptions2], nodeOptions3]
//const schema = [nodeFunction, nodeOptions1]

const result = await resolveObject(schema)

console.log('result', result)