import { getMin } from './binary-search-tree.js'

// Because the tree is balanced: O(log(N))
const getMaxDepth = tree => {
    if (!tree)
        return 0

    const { left, right } = tree

    const leftDepth = getMaxDepth(left)
    const rightDepth = getMaxDepth(right)

    return 1 + Math.max(leftDepth, rightDepth)
}

const rotateRight = tree => {
    if (!tree?.left)
        return tree

    const newRoot = tree.left

    return { ...newRoot, right: { ...tree, left: newRoot.right } }
}

const rotateLeft = tree => {
    if (!tree?.right)
        return tree

    const newRoot = tree.right

    return { ...newRoot, left: { ...tree, right: newRoot.left } }
}


export const insert = (tree, key) => {
    if (!tree)
        return { key, left: null, right: null }
    if (key === tree.key)
        return tree

    // Since we already return if key === tree.key, the `else` branch is
    // for key > tree.key
    const newTree = key < tree.key
        ? { ...tree, left: insert(tree.left, key) }
        : { ...tree, right: insert(tree.right, key) }

    const { left, right } = newTree

    // O(log(N))
    const balanceFactor = getMaxDepth(left) - getMaxDepth(right)

    if (balanceFactor > 1)
        if (key < left.key) {
            // Left-Left = Right
            return rotateRight(newTree)
        } else {
            // Left-Right
            return rotateRight({ ...newTree, left: rotateLeft(left) })
        }

    if (balanceFactor < -1)
        if (key > right.key) {
            // Right-Right = Left
            return rotateLeft(newTree)
        } else {
            // Right-Left
            return rotateLeft({ ...newTree, right: rotateRight(right) })
        }

    // If no rotations are required
    return newTree
}

const balance = tree => {
    if (!tree)
        return null

    const { left, right } = tree

    const balanceFactor = getMaxDepth(left) - getMaxDepth(right)

    if (balanceFactor > 1)
        if (getMaxDepth(left?.left) >= getMaxDepth(left?.right)) {
            // Left-Left = Right
            return rotateRight(tree)
        } else {
            // Left-Right
            return rotateRight({ ...tree, left: rotateLeft(left) })
        }

    if (balanceFactor < -1)
        if (getMaxDepth(right?.right) >= getMaxDepth(right?.left)) {
            // Right-Right = Left
            return rotateLeft(tree)
        } else {
            // Right-Left
            return rotateLeft({ ...tree, right: rotateRight(right) })
        }

    return tree
}

// Uses the word "remove" instead of "delete" because "delete" is a reserved word
export const remove = (tree, key) => {
    if (!tree)
        return null

    if (key < tree.key) {
        return balance({ ...tree, left: remove(tree.left, key) })
    } else if (key > tree.key) {
        return balance({ ...tree, right: remove(tree.right, key) })
    } else {
        // Leaf node (node with no children)
        if (!tree.left && !tree.right)
            return null

        // Node with one child
        if (!tree.left)
            return tree.right
        if (!tree.right)
            return tree.left

        // Node with two children
        const min = getMin(tree.right)

        return balance({
            ...tree,
            key: min.key,
            right: remove(tree.right, min.key)
        })
    }
}
