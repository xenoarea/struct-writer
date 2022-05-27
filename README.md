# object-promiser
Little helper to generate complex object from a schema filling values in from promises resolution

## Installation

npm install --save @xenoarea/object-promiser

## Philosophy

Originally I was writing a generator for Yeoman that was prompting user inputs in loop, with prompting containing
nested prompting loop. I finally ended up writing this little helper to make it easy.

## Usage

```
import createObjectPromiser from '@xenoarea/object-promiser'

const crawl = createObjectPromiser()

const schema = {}

const answers = await crawl(schema)
```

## Schema node options

When you define a node of your schema, you can attach it some options to make it optional, repeatable of discardable like following

```
const itemsOptions = {
    include: async () => true|false,
    repeat: async () => true|false,
    persist: async () => true|false
}

const itemsPromise = async () => (...)

const schema {
  items: [itemsPromise, itemsOptions]
}
```

### Include

Defining the `include` option make the node optional. If the given promise for the `include` option returns false, the node promise will be skipped. If it returns true
it will be resolved.

### Repeat

Defining the `repeat` option makes the node repeated (it then becomes an array in your resulting object structure). The given promise for the `repeat` option is called after each node resolution. If it returns false it stops repeating. If it returns true it will repeat it one more time and reresolve just after.

### Persist node

Defining the `persist` option makes the node discardable. The given promise for the `persist` option is called after each node resolution (before repeat). If it returns false the node resolved value is discarded. If it returns the node resolved value is kept into the resulting object.


## Crawl options
```
{
    adaptNode: (item) => item,                  // If you provide something else than a promise/function as node of
                                                // the schema, provide an adaptNode function to transform into in one.
                                                
    adaptIncludeOption: (item) => item,         // If you provide something else than a promise/function as include
                                                // option of the schema, provide an adaptIncludeOption function to
                                                // transform it into one.
                                                
    adaptRepeatOption: (item) => item,          // If you provide something else than a promise/function as repeat
                                                // option of the schema, provide an adaptRepeatOption function to
                                                // tranform it into one.

    adaptPersistOption: (item) => item          // If you provide something else than a promise/function as persist
                                                // option of the schema, provide an adaptPersistOption function to
                                                // transform it into one.
}
```

## Find me on

- [Twitch](https://www.twitch.tv/xenoarea)
- [Twitter](https://twitter.com/xenoarea)
- [Instagram](https://www.instagram.com/xenoarea)
