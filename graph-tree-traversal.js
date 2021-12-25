const adjacentVertexIndexes = (adjMatrix, vertex) => adjMatrix[vertex].reduce((list, v, i) => v > 0 ? [...list, i] : list, [])

const dfsRecursive = (graph, vertex, visited=[]) => {
	if (!visited.includes(vertex)) {
		// Visited a new vertex, do work:
		console.log('Vertex: ', graph.vertices[vertex])

		visited.push(vertex)

		for (const i of adjacentVertexIndexes(graph.adjMatrix, vertex)) {
			dfsRecursive(graph, i, visited)
		}
	}
}

const dfsIterative = (graph, start) => {
	const stack = []
	const visited = []

	stack.push(start)

	while (stack.length > 0) {
		const currentVertex = stack.pop()

		// If current vertex hasn't been visited before,
		// push unvisited adjacent vertices push onto stack
		// to process next
		if (!visited.includes(currentVertex)) {
			// Visited a new vertex, do work:
			console.log('Vertex: ', graph.vertices[currentVertex])

			visited.push(currentVertex)

			for (const i of adjacentVertexIndexes(graph.adjMatrix, currentVertex).reverse()) {
				if (!visited.includes(i)) {
					stack.push(i)
				}
			}
		}
	}
}

const bfsIterative = (graph, start) => {
	console.log('Start node: ', graph.vertices[start])
	const queue = []
	const visited = []

	queue.unshift(start)
	visited.push(start)

	while (queue.length > 0) {
		const currentVertex = queue.pop()

		for (const i of adjacentVertexIndexes(graph.adjMatrix, currentVertex)) {
			if (!visited.includes(i)) {
				queue.unshift(i)
				visited.push(i)

				// Visited a new vertex, do work:
				console.log(graph.vertices[i])
			}
		}
	}
}

const findPathDfs = (graph, goal, currentVertex, visited=[], path=[]) => {
	if (!visited.includes(currentVertex)) {
		if (graph.vertices[currentVertex] === goal) {
			return path.concat(graph.vertices[currentVertex])
		}

		visited.push(currentVertex)

		for (const i of adjacentVertexIndexes(graph.adjMatrix, currentVertex)) {
			const p = findPathDfs(graph, goal, i, visited, path.concat(graph.vertices[currentVertex]))

			if (p) {
				return p
			}
		}
	}

	// Hit a dead end - a vertex with no new adjacent vertices
	return undefined
}


// Although these algorithms work for any graph,
// I’m using a tree as an example easily demonstrates the difference between
// traversal for DFS vs BFS

//     A
//    / \
//   B  C
//  /  / \
// D  E   F
const tree = {
	vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
	adjMatrix: [
		[0, 1, 1, 0, 0, 0],
		[0, 0, 0, 1, 0, 0],
		[0, 0, 0, 0, 1, 1],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0]
	]
}

//     7      10
// E ---> A <---- B
//        | \     ^
//     60 |  \ 12 | 20
//        |   \-> C
//        V       |
//        D <-----/
//            32
const directedGraph = {
	vertices: ['A', 'B', 'C', 'D', 'E'],
	adjMatrix: [
		[  0,  0, 12, 60,  0],
		[ 10,  0,  0,  0,  0],
		[  0, 20, 32,  0,  0],
		[  0,  0,  0,  0,  0],
		[  7,  0,  0,  0,  0]
	]
}
// The same graph, but with bidirectional edges
const undirectedGraph = {
	vertices: ['A', 'B', 'C', 'D', 'E'],
	adjMatrix: [
		[  0, 10, 12, 60,  7],
		[ 10,  0, 20,  0,  0],
		[ 12, 20,  0, 32,  0],
		[ 60,  0, 32,  0,  0],
		[  7,  0,  0,  0,  0]
	]
}


// Demos
console.log('dfsRecursive(tree, 0):')
dfsRecursive(tree, 0)
console.log('dfsIterative(tree, 0):')
dfsIterative(tree, 0)

console.log('dfsRecursive(directedGraph, 0):')
dfsRecursive(directedGraph, 0)
console.log('dfsIterative(directedGraph, 0):')
dfsIterative(directedGraph, 0)

console.log('dfsRecursive(undirectedGraph, 0):')
dfsRecursive(undirectedGraph, 0)
console.log('dfsIterative(undirectedGraph, 0):')
dfsIterative(undirectedGraph, 0)

console.log('bfsIterative(tree, 0):')
bfsIterative(tree, 0)

console.log('findPathDfs(tree, \'E\', 0):')
console.log(findPathDfs(tree, 'E', 0))
console.log('findPathDfs(tree, \'Z\', 0):')
console.log(findPathDfs(tree, 'Z', 0))
console.log('findPathDfs(directedGraph, \'B\', 0):')
console.log(findPathDfs(directedGraph, 'B', 0))