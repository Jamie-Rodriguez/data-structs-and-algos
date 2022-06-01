const binarySearch = (arr, target) => {
    let left = 0
    let right = arr.length - 1

    while (left <= right) {
        const middle = left + Math.floor((right - left) / 2)

        if (arr[middle] === target) {
            return arr[middle]
        }

        if (arr[middle] < target) {
            left = middle + 1
        } else {
            right = middle - 1
        }
    }

    return undefined
}

const binarySearchRecursive = (arr, target, left=0, right=arr.length-1) => {
    if (left <= right) {
        const middle = left + Math.floor((right - left) / 2)

        if (arr[middle] === target) {
            return arr[middle]
        }

        if (arr[middle] < target) {
            return binarySearchRecursive(arr, target, middle + 1, right)
        } else {
            return binarySearchRecursive(arr, target, left, middle - 1)
        }
    }

    return undefined
}


// even-sized array
const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
// odd-sized array
const nonPrimes = [1, 4, 6, 8, 9, 10, 12, 14, 15]

console.assert(binarySearch(primes, 2) === 2)
console.assert(binarySearch(primes, 23) === 23)
console.assert(binarySearch(primes, 31) === undefined)
console.assert(binarySearch(primes, 15) === undefined)
console.assert(binarySearch(nonPrimes, 4) === 4)
console.assert(binarySearch(nonPrimes, 15) === 15)
console.assert(binarySearch(nonPrimes, 16) === undefined)
console.assert(binarySearch(nonPrimes, 3) === undefined)

console.assert(binarySearchRecursive(primes, 2) === 2)
console.assert(binarySearchRecursive(primes, 23) === 23)
console.assert(binarySearchRecursive(primes, 31) === undefined)
console.assert(binarySearchRecursive(primes, 15) === undefined)
console.assert(binarySearchRecursive(nonPrimes, 4) === 4)
console.assert(binarySearchRecursive(nonPrimes, 15) === 15)
console.assert(binarySearchRecursive(nonPrimes, 16) === undefined)
console.assert(binarySearchRecursive(nonPrimes, 3) === undefined)
