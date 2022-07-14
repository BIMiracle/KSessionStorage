# KSessionStorage

enhanced sessionStorage(加强版 sessionStorage)

# INSTALL

```bash
npm install KSessionStorage
```

# USAGE

For Vue Project in main.js add

```js
import 'KSessionStorage'
```

create a `storage.config.js`

```js
module.exports = {
	storagePrefix: '',
	sessionStorageWhiteList: [],
}
```

`storagePrefix`: addPrefix (在普通 key 上添加前缀)

`sessionStorageWhiteList`: sessionStorage.clean() will skip array (使用 sessionStorage.clean()时会跳过里面的值)

then you can use it as native sessionStorage

```js
sessionStorage.a = '1'
sessionStorage.setItem('a', '2')
sessionStorage.a
sessionStorage.getItem('a')
sessionStorage.removeItem('a')
sessionStorage.clean() // only clean add storagePrefix and skip sessionStorageWhiteList (只会清除添加了storagePrefix值的前缀,会跳过sessionStorageWhiteList白名单里的值)
```
