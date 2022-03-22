const RFC4648 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const RFC4648_HEX = '0123456789ABCDEFGHIJKLMNOPQRSTUV';
const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

const toDataView = (data) => {
  if (typeof data === 'string') {
    data = Buffer.from(data);
  }
  if (data instanceof Int8Array || data instanceof Uint8Array || data instanceof Uint8ClampedArray) {
    return new DataView(data.buffer, data.byteOffset, data.byteLength);
  }
  if (data instanceof ArrayBuffer) {
    return new DataView(data);
  }
  throw new TypeError('Expected `data` to be a string, ArrayBuffer, Buffer, Int8Array, Uint8Array or Uint8ClampedArray');
}

const readChar = (charset, char) => {
  var idx = charset.indexOf(char)
  if (idx === -1) {
    throw new Error('Invalid character found: ' + char)
  }
  return idx
}

const Base32 = (options={}) => {
  let { type='RFC4648', charset, padding } = options;
  if (charset == null) {
    switch (type) {
    case 'RFC3548':
    case 'RFC4648':
      charset = RFC4648;
      padding = padding != null ? padding : '=';
      break;
    case 'RFC4648-HEX':
      charset = RFC4648_HEX;
      padding = padding != null ? padding : '=';
      break;
    case 'Crockford':
      charset = CROCKFORD;
      break;
    default:
      throw new Error(`Unknown base32 encoding type: ${type}`);
    }
  }
  
  const encode = (input) => {
    const view = toDataView(input);
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < view.byteLength; i++) {
      value = (value << 8) | view.getUint8(i);
      bits += 8;
      while (bits >= 5) {
        output += charset[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }
    if (bits > 0) {
      output += charset[(value << (5 - bits)) & 31];
    }

    if (padding) {
      while ((output.length % 8) !== 0) {
        output += padding;
      }
    }
    return output;
  };

  const decode = (input, encoding='utf-8') => {
    if (type === 'Crockford') {
      input = input.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1');
    } else if (padding) {
      input = input.replace(new RegExp(`${padding}+$`),'');
    }
    let length = input.length;
    let bits = 0
    let value = 0

    let index = 0
    let output = new Uint8Array((length * 5 / 8) | 0)

    for (var i = 0; i < length; i++) {
      value = (value << 5) | readChar(charset, input[i])
      bits += 5

      if (bits >= 8) {
        output[index++] = (value >>> (bits - 8)) & 255
        bits -= 8
      }
    }
    return !!encoding ? Buffer.from(output.buffer).toString(encoding) : output.buffer;
  };
  
  return { encode, decode }
};

module.exports = Base32;
