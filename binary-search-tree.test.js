import fc from 'fast-check'
import { insert, remove, search } from './binary-search-tree.js'

// We have to pass min & max to ensure that the entire subtrees conform to the
// binary search tree property.
// If we didn't check for min & max i.e. only the immediate child nodes, then
// this tree would pass:
//       5
//      / \
//     3   7
//        / \
//       4   8
export const isBinarySearchTree = (tree, min = -Infinity, max = Infinity) => {
    if (!tree)
        return true

    const { key, left, right } = tree

    if (key <= min || max <= key)
        return false

    return isBinarySearchTree(left, min, key) && isBinarySearchTree(right, key, max)
}

describe('binary search tree', () => {
    describe('insertion', () => {
        it('preserves property: left subtree < node < right subtree for all nodes in tree', () => {
            fc.assert(fc.property(fc.array(fc.integer()),
                nums => {
                    const tree = nums.reduce(insert, null)

                    return isBinarySearchTree(tree)
                })
            )
        })

        it('adds element to tree', () => {
            fc.assert(fc.property(fc.array(fc.integer()),
                nums => {
                    const tree = nums.reduce(insert, null)

                    return nums.map(n => search(tree, n))
                        .every(result => !!result || result === 0)
                })
            )
        })
    })

    describe('removal', () => {
        it('preserves property: left subtree < node < right subtree for all nodes in tree', () => {
            fc.assert(fc.property(fc.array(fc.integer()),
                nums => {
                    const tree = nums.reduce(insert, null)

                    return isBinarySearchTree(tree)
                })
            )
        })

        it('removes element from tree', () => {
            fc.assert(fc.property(fc.array(fc.integer()), fc.array(fc.integer()),
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
            fc.assert(fc.property(fc.array(fc.integer()), fc.array(fc.integer()),
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

