function harmonizeKeySegment (keySegment) {
    if (typeof keySegment === 'string') {
        return { key: keySegment }
    }

    return keySegment
}

function setSliceValue (key, value, parent) {
    if (key === null || key === undefined ) {
        return value
    }

    const safeParent = typeof parent === 'object'
        ? parent
        : {}

    return {
        ...safeParent,
        [key]: value
    }
}

function insertItemInArray (value, baseArray, index) {
    const startArray = baseArray.slice(0, index)
    const endArray = baseArray.slice(index)

    return [...startArray, value, ...endArray]
}

function replaceItemInArray (value, baseArray, index) {
    const startArray = baseArray.slice(0, index)
    const endArray = baseArray.slice(index + 1)

    return [...startArray, value, ...endArray]
}

function getSlice (parent, key) {
    return key === null || key === undefined ? parent : parent?.[key]
}

function write (value, keyPath = [], base) {
    if (keyPath.length === 0) {
        return value
    }

    const [keySegment, ...nextKeyPath] = keyPath

    const { key, array, update, index } = harmonizeKeySegment(keySegment)

    if (!array) {
        const nextValue = write(
            value,
            nextKeyPath,
            getSlice(base, key)
        )

        return setSliceValue(
            key,
            nextValue,
            base
        )
    }

    const baseArray = getSlice(base, key) || []

    if (update) {
        const safeIndex = index >= 0 && index < baseArray.length
            ? index
            : baseArray.length - 1

        const nextValue = write(
            value,
            nextKeyPath,
            baseArray.at(safeIndex)
        )

        const nextArray = replaceItemInArray(
            nextValue,
            baseArray,
            safeIndex
        )

        return setSliceValue(
            key,
            nextArray,
            base
        )
    }

    const safeIndex = index >= 0 && index < baseArray.length
        ? index
        : baseArray.length

    const nextValue = write(
        value,
        nextKeyPath
    )

    const nextArray = insertItemInArray(
        nextValue,
        baseArray,
        safeIndex
    )

    return setSliceValue(
        key,
        nextArray,
        base
    )
}

export default write