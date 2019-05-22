export default function renderOnChange(fnName) {
	return (target, name, descriptor) => {
		if (typeof target !== 'object') {
			console.warn('@veams/decorators - renderOnChange :: Property is not an object.');
			return;
		}
		let incr = 0;

		if (descriptor && descriptor.initializer) {
			target['_' + name] = descriptor.initializer();

			delete descriptor.writable;
			delete descriptor.initializer;
		}

		Object.defineProperty(target, name, {
			configurable: true,
			enumerable: true,
			get() {
				return this[`_${name}`];
			},
			set(newVal) {
				if (JSON.stringify(this[`_${name}`]) === JSON.stringify(newVal)) {
					return;
				}

				this[`_${name}`] = newVal;

				if (incr < 1) {
					if (fnName && this[fnName]) {
						this[fnName]();
					} else {
						this.render(newVal);
					}
				} else {
					incr++;
				}
			}
		});

		return descriptor;
	};
}
