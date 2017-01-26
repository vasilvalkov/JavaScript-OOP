/* Task description */
/*
	Write a function that finds all the prime numbers in a range
		1) it should return the prime numbers in an array
		2) it must throw an Error if any on the range params is not convertible to `Number`
		3) it must throw an Error if any of the range params is missing
*/
function solve() {
	return function findPrimes() {
		if (arguments.length < 2) {
			throw 'No range present';
		}

		if (Number.isNaN(Number(arguments[0])) || Number.isNaN(Number(arguments[1]))) {
			throw 'Not all values are numbers!';
		}

		let from = +arguments[0],
			to = +arguments[1],
			boolArr = [],
			primes = [],
			x = 1,
			sqrt = ~~Math.sqrt(to);

		boolArr.length = to + 1;

		for (let i = 2; i <= to; i += 1) {
			boolArr[i] = true;
		}
		// find all prime indices using sieve of Eratosthenes algo
		for (let i = 2; i <= sqrt; i += 1) {
			if (boolArr[i]) {
				let iSquare = i * i;

				for (let j = iSquare; j <= to; j = iSquare + x * i) {
					boolArr[j] = false;
					x += 1;
				}

				x = 1;
			}
		}
		// find lasgert prime which is smaller than num
		for (let i = from; i <= to; i += 1) {
			if (boolArr[i]) {
				primes.push(i);
			}
		}
		return primes;
	};
}

module.exports = solve;