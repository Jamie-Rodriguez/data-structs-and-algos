//      8
//    /    \
//   3      10
//  / \       \
// 1   6      14
//    / \    /
//   4   7  13
// Indexing is in Breadth-First Search order:
const tree = [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, null, null, 13, null]


const leftChildIndex = currIndex => 2 * currIndex + 1
const rightChildIndex = currIndex => 2 * currIndex + 2
const parentIndex = currIndex => Math.floor((currIndex - 1) / 2)


// Container functionfor comparison of generic objects
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
		? leftChildIndex(currentIndex)
		: rightChildIndex(currentIndex)

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
	// We've exceeded the space of the old array, time to make a new one
	// (We could just resize but I want to do this in a functional way,
	// so make a new one)
	if (currentIndex >= tree.length) {
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
		return [
			...tree.slice(0, currentIndex),
			value,
			...tree.slice(currentIndex+1, tree.length)
		]
	}

	const nextSubTreeIndex = lessThan(value, tree[currentIndex])
		? leftChildIndex(currentIndex)
		: rightChildIndex(currentIndex)

	return insert(tree, value, nextSubTreeIndex)
}

// Searches for the node == value and then marks it as null
// Returns:
// 	new array with the node == value -> null
const remove = (tree, value) => {
	const searchResultIndex = search(tree, value)

	if (searchResultIndex !== null) {
		return [
			...tree.slice(0, searchResultIndex),
			null,
			...tree.slice(searchResultIndex+1, tree.length)
		]
	}
}


// Tests
tree.map((node, index) => {
	// Don't test nodes with value == null
	if (node !== null) {
		console.assert(search(tree, node) === index)
	}
})

tree.map((node, index) => {
	// Don't test nodes with value == null
	if (node !== null) {
		let result = JSON.parse(JSON.stringify(tree))
		console.assert(result[index] !== null)
		result = remove(result, node)
		console.assert(result[index] === null)
	}
})

const arraysEqual = (a, b) => {
	if (a === b) return true
	if (a == null || b == null) return false
	if (a.length !== b.length) return false

	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false
	}
	return true
  }

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
