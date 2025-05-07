export const stubMethod = () => {
  throw new Error('Method is not implemented');
};

// String encode/decode

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const encode = (str: string) => encoder.encode(str);
export const decode = (arr: Uint8Array) => decoder.decode(arr);
