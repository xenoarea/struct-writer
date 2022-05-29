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

let count0 = 0
let count1 = 0
let count2 = 0

const nodeRepeatOption0 = createValueResolver(() => {
    count1 = 0
    return ++count0 < 2
})

const nodeOptions0 = {
    repeat: nodeRepeatOption0
}

const nodeRepeatOption1 = createValueResolver(() => {
    count2 = 0
    return ++count1 < 3
})

const nodeOptions1 = {
    repeat: nodeRepeatOption1
}

const nodeRepeatOption2 = createValueResolver(() => {
    return ++count2 < 4
})

const nodeOptions2 = {
    repeat: nodeRepeatOption2
}

//[[[x,x,x,x], [x,x,x,x], [x,x,x,x]], [[x,x,x,x], [x,x,x,x], [x,x,x,x]]]

const schema = [[[nodeFunction, nodeOptions2], nodeOptions1], nodeOptions0]

const result = await resolveObject(schema)

console.log('result', result)


node [{"key":null,"isRepeated":true, isNew: true}]
node [{"key":null,"isRepeated":true, isNew: true },{"key":null,"isRepeated":true, isNew: true}]
function [{"key":null,"isRepeated":true, isNew: true },{"key":null,"isRepeated":true, isNew: true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true, isNew: false },{"key":null,"isRepeated":true, isNew: false},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true, isNew: false },{"key":null,"isRepeated":true, isNew: false},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true, isNew: false },{"key":null,"isRepeated":true, isNew: false},{"key":null,"isRepeated":true}]
node [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
node [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
node [{"key":null,"isRepeated":true}]
node [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
node [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
node [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]
function [{"key":null,"isRepeated":true},{"key":null,"isRepeated":true},{"key":null,"isRepeated":true}]