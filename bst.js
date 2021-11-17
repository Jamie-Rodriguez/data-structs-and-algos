//      8
//    /    \
//   3      10
//  / \       \
// 1   6      14
//    / \    /
//   4   7  13
const tree = {
	data: 8,
	left: {
		data: 3,
		left: {
			data: 1,
			left: null,
			right: null
		},
		right: {
			data: 6,
			left: {
				data: 4,
				left: null,
				right: null
			},
			right: {
				data: 7,
				left: null,
				right: null
			}
		}
	},
	right: {
		data: 10,
		left: null,
		right: {
			data: 14,
			left: {
				data: 13,
				left: null,
				right: null
			},
			right: null
		}
	}
}


const minimum = (root, subTree=root) => {
	if (subTree.left === null) {
		return subTree
	}

	return minimum(root, subTree.left)
}

const maximum = (root, subTree=root) => {
	if (subTree.right === null) {
		return subTree
	}

	return maximum(root, subTree.right)
}

// Container for comparison of generic objects
// Returns:
// 	null if value "equal to" treeNode.data, though this is not actually compared against
// 		in this codebase
// 	true if value "less than" treeNode.data
// 	false if value "greater than" treeNode.data
const lessThan = (value, treeNode) => value === treeNode.data  ? null : value < treeNode.data


// Find and return the node where node.data == value
// Returns:
// 	node if node.data == value
// 	null if not found
const search = (tree, value) => {
	if (tree.data === value) {
		return tree
	}

	const nextSubTree = lessThan(value, tree) ? tree.left : tree.right
	// if nextSubTree == null,
	// then we've searched to the bottom of the tree and no node exists
	// with that value, return null
	return nextSubTree === null ? null : search(nextSubTree, value)
}

// Inserts a node with node.data == value into the tree.
// Warning: Modifies original tree.
// Returns:
// 	root tree passed in
const insert = (root, value, subTree=root) => {
	// A node with the value already exists in the tree
	if (subTree.data === value) {
		return root
	}

	const nextSubTree = lessThan(value, subTree) ? subTree.left : subTree.right

	if (nextSubTree === null) {
		const newNode = { data: value, left: null, right: null }
		lessThan(value, subTree)
			? subTree.left = newNode
			: subTree.right = newNode

		return root
	}

	return insert(root, value, nextSubTree)
}
