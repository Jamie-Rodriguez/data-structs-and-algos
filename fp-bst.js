const insert = (node, newValue) =>
    node?.value === undefined
        ? { value: newValue, left: null, right: null }
    : newValue < node.value
        ? { value: node.value, left: insert(node.left, newValue), right: node.right }
    : node.value < newValue
        ? { value: node.value, left: node.left, right: insert(node.right, newValue) }
    : node


let tree = {}

for (const letter of 'Jamie') {
    tree = insert(tree, letter)
}
