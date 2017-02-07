function solve() {
	function getProduct(productType, name, price) {

		return {
			productType: productType,
			name: name,
			price: price
		};
	}

	function getShoppingCart() {
		let products = [];

		function add(product) {
			products.push(product);
			return this;
		}

		function remove(product) {
			let index = products.findIndex(p =>
				p.name === product.name &&
				p.productType === product.productType &&
				p.price === product.price);

			if (products.length === 0 || index < 0) {
				throw 'Product is not in the cart!';
			}

			products.splice(index, 1);

			return this;
		}

		function showCost() {
			if (products.length === 0) {
				return 0;
			}

			let sum = 0;

			for (let product of products) {
				sum += product.price;
			}

			return sum;
		}

		function showProductTypes() {
			let types = [];

			for (let product of products) {
				let productType = product.productType;
				if (types.indexOf(productType) < 0) {
					types.push(productType);
				}
			}
			types.sort();

			return types;
		}

		function getInfo() {
			function compare(a, b) {
				return a.name - b.name;
			}

			function group(arr) {
				let grouped = {};

				for (let prod of arr) {
					let prodName = prod.name;

					if (grouped.hasOwnProperty(prodName)) {
						grouped[prodName].push(prod);
					} else {
						grouped[prodName] = [];
						grouped[prodName].push(prod);
					}
				}
				return grouped;
			}

			const totalPrice = showCost(),
				grouped = group(products),
				productsGrouped = [];

			for (let x in grouped) {
				productsGrouped.push({
					name: x,
					quantity: grouped[x].length,
					totalPrice: function () {
						let sum = 0;

						for (let product of grouped[x]) {
							sum += product.price;
						}

						return sum;
					}()
					//grouped[x].reduce((a, b) => a.price + b.price, 0)
				});
			}

			productsGrouped.sort(compare);

			return {
				totalPrice: totalPrice,
				products: productsGrouped
			}
		}

		return {
			products: products,
			add: add,
			remove: remove,
			showCost: showCost,
			showProductTypes: showProductTypes,
			getInfo: getInfo
		}
	}

	return {
		getProduct: getProduct,
		getShoppingCart: getShoppingCart
	};
}

module.exports = solve();