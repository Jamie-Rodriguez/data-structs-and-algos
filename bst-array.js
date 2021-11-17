//      8
//    /    \
//   3      10
//  / \       \
// 1   6      14
//    / \    /
//   4   7  13
// Indexing is in Breadth-First Search order:
const tree = [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13, null]


const getLeftChildIndex = currIndex => 2 * currIndex + 1
const getRightChildIndex = currIndex => 2 * currIndex + 2
const getParentIndex = currIndex => Math.floor((currIndex - 1) / 2)

const minimum = (tree, index) => {
	const leftChildIndex = getLeftChildIndex(index)
	if (leftChildIndex >= tree.length || tree[leftChildIndex] === null) {
		return index
	}

	return minimum(tree, leftChildIndex)
}

const maximum = (tree, index) => {
	const rightChildIndex = getRightChildIndex(index)
	if (rightChildIndex >= tree.length || tree[rightChildIndex] === null) {
		return index
	}

	return maximum(tree, rightChildIndex)
}

// Helper function to return a new array,
// replacing the element at "index" with "value"
// This is O(n), so not great performance but I don't know
// of a faster way to do this functionally currently...
const update = (array, index, value) => array.map((x, i) => i === index ? value : x)

// Container function for comparison of generic objects
// Returns:
// 	null if value "equal to" node, this is not actually compared against
// 		in this codebase
// 	true if value "less than" node
// 	false if value "greater than" node
const lessThan = (value, node) => value === node ? null : value < node

// Find and return the index where node == value
// Returns:
// 	index if node == value
// 	null if not found
const search = (tree, value, currentIndex=0) => {
	// Need to change this equality if using complex objects
	if (value === tree[currentIndex]) {
		return currentIndex
	}

	const nextSubTreeIndex = lessThan(value, tree[currentIndex])
		? getLeftChildIndex(currentIndex)
		: getRightChildIndex(currentIndex)

	// If tree[currentIndex] === null or nextSubTreeIndex > tree.length,
	// then we've searched to the bottom of the tree and no node exists with
	// that value, return null
	return nextSubTreeIndex > tree.length || tree[currentIndex] === null
		? null
		: search(tree, value, nextSubTreeIndex)
}

// Inserts a node into the tree, returns a new array with the changes applied
// If the new node needs to be placed at a new depth, the array is resized larger
const insert = (tree, value, currentIndex=0) => {
	if (currentIndex >= tree.length) {
		// We've exceeded the space of the old array, time to make a new one
		// (We could just resize but I want to do this in a functional way,
		// so make a new one)
		const newLen = 2 * tree.length + 1

		return [
			...tree,
			...new Array(currentIndex - tree.length).fill(null),
			value,
			...new Array(newLen - currentIndex - 1).fill(null)
		]
	} else if (value === tree[currentIndex]) {
		// The value already exists in the tree
		return tree
	} else if (tree[currentIndex] === null) {
		return update(tree, currentIndex, value)
	}

	const nextSubTreeIndex = lessThan(value, tree[currentIndex])
		? getLeftChildIndex(currentIndex)
		: getRightChildIndex(currentIndex)

	return insert(tree, value, nextSubTreeIndex)
}

// Searches for the node == value and then marks it as null
// Returns:
// 	new array with the node == value -> null
const remove = (tree, value) => {
	const nodeIndex = search(tree, value)
	// Node with value doesn't exist, return the original tree
	if (nodeIndex === null) {
		return tree
	}

	const leftChildIndex = getLeftChildIndex(nodeIndex)
	const leftChild = leftChildIndex < tree.length ?
		tree[leftChildIndex]
		: null
	const rightChildIndex = getRightChildIndex(nodeIndex)
	const rightChild = rightChildIndex < tree.length ?
		tree[rightChildIndex]
		: null

	if (leftChild === null && rightChild === null) {
		// Node has no children - mark the node as null
		return update(tree, nodeIndex, null)
	} else if ((leftChild !== null && rightChild === null)
		|| (leftChild === null && rightChild !== null)) {
		// Node has only one child - move the child node to the position of the parent node
		const childIndex = leftChild !== null ? leftChildIndex : rightChildIndex
		const childValue = leftChild !== null ? leftChild : rightChild
		// Replace parent value with child value, then replace child with null
		return update(update(tree, nodeIndex, childValue), childIndex, null)
	} else {
		// Node has two children
		// Replace the node with either it's in-order predecessor or in-order successor
		// predecessor = the maximum value of the left sub-tree
		// successor = the minimum value of the right sub-tree

		// e.g. deleting node 20 from this tree:
		//       15
		//     /     \
		//    /       \
		//   10       20
		//  /  \     /   \
		// 8   12   18   30
		//         / \   / \
		//        16 19 25 36
		// Gives (replacing with the predecessor):
		//       15
		//     /     \
		//    /       \
		//   10       19
		//  /  \     /   \
		// 8   12   18   30
		//         /     / \
		//        16    25 36
		// or (replacing with the successor):
		//       15
		//     /     \
		//    /       \
		//   10       25
		//  /  \     /   \
		// 8   12   18   30
		//         / \     \
		//        16 19    36

		// Choosing to replace with it's predecessor
		const predecessorIndex = maximum(tree, leftChildIndex)
		// Replace parent value with predecessor value, then replace predecessor with null
		return update(
			update(tree, nodeIndex, tree[predecessorIndex]),
			predecessorIndex,
			null)
	}
}


// Tests
// Helper to validate arrays:
const arraysEqual = (a, b) => {
	if (a === b) return true
	if (a == null || b == null) return false
	if (a.length !== b.length) return false

	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false
	}
	return true
}

tree.map((node, index) => {
	// Don't test nodes with value == null
	if (node !== null) {
		console.assert(search(tree, node) === index)
	}
})

console.assert(
	arraysEqual(
		insert(tree, 9),
		[
			8, 3,    10,   1,    6,
			9, 14,   null, null, 4,
			7, null, null, 13,   null
		]
	)
)

console.assert(
	arraysEqual(
		insert(tree, 11),
		[
			8,    3,    10,   1,    6,    null,
			14,   null, null, 4,    7,    null,
			null, 13,   null, null, null, null,
			null, null, null, null, null, null,
			null, null, null, 11,   null, null,
			null
		]
	)
)

console.assert(
	arraysEqual(
		insert(tree, 15),
		[
			8,    3,    10,   1,    6,
			null, 14,   null, null, 4,
			7,    null, null, 13,   15
		]
	)
)

console.assert(minimum(tree, 0) === 3)
console.assert(minimum(tree, 4) === 9)
console.assert(maximum(tree, 0) === 6)
console.assert(maximum(tree, 1) === 10)

// Remove node with no children
console.assert(arraysEqual(
	remove(tree, 7),
	[
		8,    3,    10,   1,    6,
		null, 14,   null, null, 4,
		null, null, null, 13,   null
	])
)
// Remove node with one child
console.assert(arraysEqual
	(remove(tree, 14),
	[
		8,    3,    10,   1,    6,
		null, 13,   null, null, 4,
		7,    null, null, null, null
	])
)
// Remove node with two children
console.assert(arraysEqual
	(remove(tree, 6),
	[
		8,    3,    10,   1,    4,
		null, 14,   null, null, null,
		7,    null, null, 13,   null
	])
)
// Remove the root
console.assert(arraysEqual
	(remove(tree, 8),
	[
		7,    3,    10,   1,    6,
		null, 14,   null, null, 4,
		null, null, null, 13,   null
	])
)
