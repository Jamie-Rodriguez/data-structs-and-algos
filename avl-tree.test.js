import fc from 'fast-check'
import { isBinarySearchTree } from './binary-search-tree.test.js'
import { search } from './binary-search-tree.js'
import { insert, remove } from './avl-tree.js'

const getMaxDepth = tree => {
    if (!tree)
        return 0

    const { left, right } = tree

    const leftDepth = getMaxDepth(left)
    const rightDepth = getMaxDepth(right)

    return 1 + Math.max(leftDepth, rightDepth)
}

const isBalancedBinaryTree = tree => {
    const checkBalance = node => {
        if (!node)
            return [true, 0]

        const { left, right } = node

        const [leftBalanced, leftHeight] = checkBalance(left)
        const [rightBalanced, rightHeight] = checkBalance(right)

        const balanced = leftBalanced
            && rightBalanced
            && Math.abs(leftHeight - rightHeight) <= 1
        const height = 1 + Math.max(leftHeight, rightHeight)

        return [balanced, height]
    }

    return checkBalance(tree)[0]
}

describe('AVL tree', () => {
    describe('insertion', () => {
        it('constructs valid binary search tree', () => {
            fc.assert(fc.property(fc.array(fc.integer()),
                nums => {
                    const tree = nums.reduce(insert, null)

                    return isBinarySearchTree(tree)
                }),
                { verbose: 0 }
            )
        })

        it('constructs balanced binary tree', () => {
            fc.assert(fc.property(fc.array(fc.integer()),
                nums => {
                    const tree = nums.reduce(insert, null)

                    return isBalancedBinaryTree(tree)
                }),
                { verbose: 0 }
            )
        })

        it('adds element to tree', () => {
            fc.assert(fc.property(fc.array(fc.integer()),
                nums => {
                    const tree = nums.reduce(insert, null)

                    return nums.map(n => search(tree, n))
                        .every(result => !!result || result === 0)
                }),
                { verbose: 0 }
            )
        })
    })

    // Uses the word "remove" instead of "delete" because "delete" is a reserved word
    describe('removal', () => {
        it('preserves binary search tree property', () => {
            fc.assert(fc.property(
                fc.array(fc.integer()), fc.array(fc.integer()),
                (remaining, removals) => {
                    const nums = [...remaining, ...removals]
                    const tree = nums.reduce(insert, null)

                    const treePostRemovals = removals.reduce(remove, tree)

                    return isBinarySearchTree(treePostRemovals)
                }),
                { verbose: 0 }
            )
        })

        it('preserves balanced binary tree', () => {
            fc.assert(fc.property(
                fc.array(fc.integer()), fc.array(fc.integer()),
                (remaining, removals) => {
                    const nums = [...remaining, ...removals]
                    const tree = nums.reduce(insert, null)

                    const treePostRemovals = removals.reduce(remove, tree)

                    return isBalancedBinaryTree(treePostRemovals)
                }),
                { verbose: 0 }
            )
        })

        it('removes element from tree', () => {
            fc.assert(fc.property(
                fc.array(fc.integer()), fc.array(fc.integer()),
                (remaining, removals) => {
                    const nums = [...remaining, ...removals]
                    const tree = nums.reduce(insert, null)

                    const treePostRemovals = removals.reduce(remove, tree)

                    return !removals.filter(
                        key => search(treePostRemovals, key)
                    ).length
                }),
                { verbose: 0 }
            )
        })

        it('preserves other keys', () => {
            fc.assert(fc.property(
                fc.array(fc.integer()), fc.array(fc.integer()),
                (remaining, removals) => {
                    const nums = [...remaining, ...removals]
                    const tree = nums.reduce(insert, null)

                    const treePostRemovals = removals.reduce(remove, tree)

                    // Use Sets to remove duplicates
                    const existentKeys = new Set(nums.filter(
                        key => search(treePostRemovals, key)
                    ))

                    const originalSet = new Set(nums)
                    const removedSet = new Set(removals)

                    return Array.from(existentKeys).every(
                        key => originalSet.has(key) && !removedSet.has(key)
                    )
                }),
                { verbose: 0 }
            )
        })

        const splitUniqueArrayArbitrary = fc.array(fc.integer()).chain(nums => {
            return fc.nat(nums.length).map(splitIndex => {
                const left = nums.slice(0, splitIndex)
                const right = nums.slice(splitIndex)

                return [left, right]
            })
        })

        it('preserves tree when attempting to remove non-existent key', () => {
            fc.assert(fc.property(splitUniqueArrayArbitrary,
                ([insertions, removals]) => {
                    const tree = insertions.reduce(insert, null)

                    const treePostRemovals = removals.reduce(remove, tree)

                    const existentKeys = insertions.filter(
                        key => search(treePostRemovals, key)
                    )

                    const originalSet = new Set(insertions)
                    const removedSet = new Set(removals)

                    return existentKeys.every(
                        key => originalSet.has(key) && !removedSet.has(key)
                    )
                }),
                { verbose: 0 }
            )
        })
    })
})

