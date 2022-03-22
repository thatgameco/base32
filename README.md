# base32

Simple base32 encode/decode for custom charset and padding.

```js
const base32 = require('@thatgameco/base32')(); // default RFC4648

base32.encode('hello world'); // 'NBSWY3DPEB3W64TMMQ======'
base32.decode('NBSWY3DPEB3W64TMMQ======'); // 'hello world' (default utf-8 encoding)
```

## Using alternative built-in encodings

Available types: `RFC4648`, `RFC4648-HEX`, `Crockford`. Defaults to `RFC4648`

```js
const base32 = require('@thatgameco/base32')({ type: 'Crockford' });
base32.encode('hello world'); // 'D1JPRV3F41VPYWKCCG'
```

## Using custom charset and padding

```js
const base32 = require('@thatgameco/base32')({ charset: 'abcdefghijklmnopqrstuvwxyz234567', padding: '-' });
base32.encode('hello world'); // 'nbswy3dpeb3w64tmmq------'
```

Disabling padding:
```js
const base32 = require('@thatgameco/base32')({ padding: false });
base32.encode('hello world'); // 'NBSWY3DPEB3W64TMMQ'
```

## Decoding with custom encoding

Decode base32 with defined encoding. Available encoding: `utf8`, `binary`, `base64`, `hex`, `ascii`, `latin1`, `ucs2`, `utf16` and [many others](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder/encoding).

```js
base32.decode('NBSWY3DPEB3W64TMMQ======', null); // ArrayBuffer <68 65 6c 6c 6f 20 77 6f 72 6c 64>
base32.decode('NBSWY3DPEB3W64TMMQ======', 'hex'); // '68656c6c6f20776f726c64'
base32.decode('NBSWY3DPEB3W64TMMQ======', 'base64'); // 'aGVsbG8gd29ybGQ='
```

