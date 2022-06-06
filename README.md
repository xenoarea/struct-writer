# struct-writer
Function to write complex structures (obj, array) from keypath

## Installation

npm install --save @xenoarea/struct-writer

## Philosophy

I was originally developing another package in which I needed to sequentially rewrite a state object, with nested keys and arrays.
In order to do this I created that function that I then decided to isolate in its own package.

## Usage

```
import write from '@xenoarea/struct-writer'

const struct0 = write('Hello world !')
console.log(struct0)
// output: Hello world !

const struct1 = write('Hello there !', ['field1', 'field2', 'field3'])
console.log(struct1)
// output: { field1: { field2: { field3: 'Hello there !' } } }

const struct2 = write('Hi', ['field1', 'field2', 'field4'], struct1)
console.log(struct2)
// output: { field1: { field2: { field3: 'Hello there !', field4: 'Hi' } } }

const struct3 = write('Cheers', ['field1', { key: 'field6', isArray: true }], struct2)
console.log(struct3)
// output: { field1: { field2: { field3: 'Hello there !', field4: 'Hi' }, field6: ['Cheers'] } }

const struct4 = write('Hoy', ['field1', { key: 'field6', isArray: true, index: 0 }], struct3)
console.log(struct4)
// output: { field1: { field2: { field3: 'Hello there !', field4: 'Hi' }, field6: ['Hoy', 'Cheers'] } }

const struct5 = write('Allo', ['field1', { key: 'field6', isArray: true, update: true, index: 0 }], struct4)
console.log(struct5)
// output: { field1: { field2: { field3: 'Hello there !', field4: 'Hi' }, field6: ['Allo', 'Cheers'] } }

const struct6 = write('Salut', ['field1', { key: 'field6', isArray: true }, 'field7'], struct5)
console.log(struct6)
// output: { field1: { field2: { field3: 'Hello there !', field4: 'Hi' }, field6: ['Allo', 'Cheers', { field7: 'Salut' }] } }

const struct7 = write('Good morning', ['field1', { key: 'field6', isArray: true, update: true }, 'field8'], struct6)
console.log(struct7)
// output: { field1: { field2: { field3: 'Hello there !', field4: 'Hi' }, field6: ['Allo', 'Cheers', { field7: 'Salut', fiels8: 'Good morning' }] } }
```

## Keypath

The keypath provided as second parameter to the `write` function is an array of key segments. A key segment can be a string, in that case it will be used as a key for the structure being created or an object defining some options to create and manipulate array in the structure being created.

## Key segment

{
  key: string           // key of the entry in the structure being created.

  isArray: boolean      // set to true to make the entry an array in the structure being created.

  update: boolean       // set to true to update an item of the array entry in the structure being created.
                        // If no index given, the last item will be updated.
                        // set to false (or do not define) to perform an insertion in the array entry.
                        // If no index given, the new item will be added at the end of the array.

  index: integer        // if update is set to true, the index will determine which item will be updated.
                        // if update is set to false (or not defined), the index will determine at which position
                        // the item will be inserted in the array entry.
}

## Find me on

- [Twitch](https://www.twitch.tv/xenoarea)
- [Twitter](https://twitter.com/xenoarea)
- [Instagram](https://www.instagram.com/xenoarea)
