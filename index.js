const setting = require('./storage.config')

if (!setting.storagePrefix) {
	throw new Error(`k-sessionstorage: please create a storage.config.js see https://github.com/BIMiracle/k-sessionstorage#usage`)
}

let _sessionStorageSave

function addPrefix (key) {
	if (key.indexOf(`${setting.storagePrefix}_`) === 0) {
		return key
	}
	return `${setting.storagePrefix}_${key}`
}

class Storage {
	constructor() {
		const arr = Object.keys(_sessionStorageSave)
		this._obj = {}
		for (let i = 0, len = arr.length; i < len; i++) {
			const key = arr[i];
			this._obj[key] = _sessionStorageSave[key]
		}
	}
	setItem (key, value) {
		if (!key) {
			throw new Error(`sessionStorage setItem: key is null`)
		}
		if (!value) {
			console.error(`sessionStorage setItem: key:${key}, value is null`)
			return
			// throw new Error(`sessionStorage setItem: key:${key}, value is null`)
		}

		const v = JSON.stringify(value)
		_sessionStorageSave.setItem(addPrefix(key), v)

		this._obj[addPrefix(key)] = v
	}
	getItem (key) {
		if (!key) {
			throw new Error(`sessionStorage getItem: key is null`)
		}
		let v = this._obj[addPrefix(key)]

		try {
			v = JSON.parse(v)
			// eslint-disable-next-line no-empty
		} catch (error) {
		}
		return v
	}
	removeItem (key) {
		if (!key) {
			throw new Error(`sessionStorage removeItem: key is null`)
		}
		delete this._obj[addPrefix(key)]
		_sessionStorageSave.removeItem(addPrefix(key))
	}
	clear () {
		const perfix = `${setting.storagePrefix}_`
		const arr = Object.keys(_sessionStorageSave)
		for (let i = 0, len = arr.length; i < len; i++) {
			const item = arr[i];
			if (item.indexOf(perfix) == 0 && !setting?.sessionStorageWhiteList?.some(c => perfix + c === item)) {
				_sessionStorageSave.removeItem(item)
				delete this._obj[item]
			}
		}
	}
	toString () {
		return this._obj
	}
	[Symbol.toPrimitive] (hint) {
		if (hint === 'number') {
			return NaN;
		}
		return '[object Storage]'
	}
}

(function changeSessionStorage () {
	_sessionStorageSave = window.sessionStorage

	const s = new Storage()

	let p = new Proxy(s, {
		get: function(target, property, receiver) {
			// console.warn(property);
			switch (property) {
				case "setItem":
					return Reflect.get(target, property, receiver);
				case "getItem":
					// return s.getItem(property)
					return Reflect.get(target, property, receiver);
				case "removeItem":
					// return target.removeItem(property)
					return Reflect.get(target, property, receiver);
				case "clear":
					return Reflect.get(target, property, receiver);
				case "toString":
					return Reflect.get(target, property, receiver);
				case "_obj":
					return Reflect.get(target, property, receiver);
				default:
					{
						if (typeof (property) == 'symbol') {
							return Reflect.get(target, property, receiver);
						}
						return target.getItem(property)
					}
			}
		},
		set: function(target, property, value, receiver) {
			target.setItem(property, value)
			return true
			// return Reflect.set(target, property, value, receiver);
		},
	});

	Object.defineProperty(window, 'sessionStorage', {
		value: p,
		// configurable: false,
		// enumerable: false,
		writable: false
	});
})()