/* eslint-disable block-scoped-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-template */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable no-bitwise */
/* eslint-disable no-else-return */
/* eslint-disable eqeqeq */

const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
const M = '0x2BC830A3';

function polymod(values) {
  let chk = 1;
  for (let p = 0; p < values.length; ++p) {
    let top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ values[p];
    for (let i = 0; i < 5; ++i) {
      if ((top >> i) & 1) {
        chk ^= GENERATOR[i];
      }
    }
  }
  return chk;
}

function hrpExpand(hrp) {
  let ret = [];
  let p;
  for (p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) >> 5);
  }
  ret.push(0);
  for (p = 0; p < hrp.length; ++p) {
    ret.push(hrp.charCodeAt(p) & 31);
  }
  return ret;
}

function createChecksum(hrp, data) {
  let values = hrpExpand(hrp).concat(data).concat([0, 0, 0, 0, 0, 0]);
  let mod = polymod(values) ^ M;
  let ret = [];
  for (let p = 0; p < 6; ++p) {
    ret.push((mod >> (5 * (5 - p))) & 31);
  }
  return ret;
}

function bech32_encode(hrp, data) {
  let combined = data.concat(createChecksum(hrp, data));
  let ret = hrp + '1';
  for (let p = 0; p < combined.length; ++p) {
    ret += CHARSET.charAt(combined[p]);
  }
  return ret;
}

function convertbits(data, frombits, tobits, pad = true) {
  let acc = 0;
  let bits = 0;
  let ret = [];
  let maxv = (1 << tobits) - 1;
  for (let p = 0; p < data.length; ++p) {
    let value = data[p];
    if (value < 0 || value >> frombits !== 0) {
      return null;
    }
    acc = (acc << frombits) | value;
    bits += frombits;
    while (bits >= tobits) {
      bits -= tobits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) {
      ret.push((acc << (tobits - bits)) & maxv);
    }
  } else if (bits >= frombits || (acc << (tobits - bits)) & maxv) {
    return null;
  }
  return ret;
}

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

export function encodePuzzleHash(puzzle_hash, prefix) {
  return bech32_encode(prefix, convertbits(hexToBytes(puzzle_hash), 8, 5));
}
