export const insert = (tree, key) => {
    if (!tree)
        return { key, left: null, right: null }
    if (key === tree.key)
        return tree

    // Since we already return if key === tree.key, the `else` branch is
    // for key > tree.key
    return key < tree.key
        ? { ...tree, left: insert(tree.left, key) }
        : { ...tree, right: insert(tree.right, key) }
}

export const getMin = tree => tree?.left ? getMin(tree.left) : tree

export const remove = (tree, key) => {
    if (!tree)
        return null

    const { left, right } = tree

    if (key < tree.key) {
        return { ...tree, left: remove(left, key) }
    } else if (key > tree.key) {
        return { ...tree, right: remove(right, key) }
    } else {
        // Leaf node (node with no children)
        if (!left && !right)
            return null

        // Node with only one child
        if (!left)
            return right
        if (!right)
            return left

        // Node with two children
        const min = getMin(right)

        return { ...tree, key: min.key, right: remove(right, min.key) }
    }
}

export const search = (tree, key) => {
    if (!tree)
        return tree
    if (key === tree.key)
        return tree

    const { left, right } = tree

    if (key < tree.key)
        return search(left, key)
    if (key > tree.key)
        return search(right, key)
}
