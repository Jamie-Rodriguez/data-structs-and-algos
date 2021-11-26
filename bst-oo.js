class BinarySearchTreeNode {
	constructor(data) {
		this.data = data
		this.left = null
		this.right = null
	}

	static lessThan(value, node) {
		return value === node.data  ? null : value < node.data
	}
}


class BinarySearchTree {
	root;

	constructor(rootData) {
		this.root = new BinarySearchTreeNode(rootData)
	}

	search(value, tree=this.root) {
		if (tree.data === value) {
			return tree
		}

		const nextSubTree = BinarySearchTreeNode.lessThan(value, tree) ? tree.left : tree.right
		// if nextSubTree == null,
		// then we've searched to the bottom of the tree and no node exists
		// with that value, return null
		return nextSubTree === null ? null : this.search(value, nextSubTree)
	}

	insert(data, subTree=this.root) {
		if (subTree.data === data) {
			return this.root
		}

		const nextSubTree = BinarySearchTreeNode.lessThan(data, subTree) ? subTree.left : subTree.right

		if (nextSubTree === null) {
			const newNode = new BinarySearchTreeNode(data)

			if (BinarySearchTreeNode.lessThan(data, subTree)) {
				subTree.left = newNode
			} else {
				subTree.right = newNode
			}

			return this.root
		}

		return this.insert(data, nextSubTree)
	}

	remove(value, tree=this.root) {
		if (tree === null) {
			return null
		}

		if (tree.data === value) {
			// Single child (left)
			if (tree.left === null) {
				return tree.right
			}
			// Single child (right)
			if (tree.right === null) {
				return tree.left
			}
			// Two children
			if (tree.left !== null && tree.right !== null) {
				let temp = tree.right
				// Find minimum node in right subtree of deleted node AKA the successor node
				while (temp.left !== null) {
					temp = temp.left
				}

				// Replace value with minimum value in right subtree (successor node)
				tree.data = temp.data
				// We replaced the original node with it's successor value.
				// Now to delete the original successor node from the tree
				// ** key step ** recurse on tree.right but search for
				// value = tree.data (successor node)
				// Will recurse to find the corresponding leaf node with only one child
				// and remove it (see the above conditional statements)
				tree.right = this.remove(tree.data, tree.right)
			}
		// Continue recursively searching...
		} else if (BinarySearchTreeNode.lessThan(value, tree)) {
			tree.left = this.remove(value, tree.left)
		} else {
			tree.right = this.remove(value, tree.right)
		}

		return tree
	}
}

const tree = new BinarySearchTree(8)
tree.insert(3)
tree.insert(1)
tree.insert(6)
tree.insert(4)
tree.insert(7)
tree.insert(10)
tree.insert(14)
tree.insert(13)

tree.search(13)
tree.search(7)

tree.remove(123)
tree.remove(3)
tree.remove(13)
