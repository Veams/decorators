export default function autoUnsubscribe() {
	return function (cl) {
		const original = cl.prototype.willUnmount;

		cl.prototype.willUnmount = function () {
			for (let prop in this) {
				const property = this[prop];
				if (property && (typeof property.unsubscribe === 'function')) {
					property.unsubscribe();
				}
			}
			original && typeof original === 'function' && original.apply(this, arguments);
		};
	}
}
