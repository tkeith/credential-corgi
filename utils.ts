import * as crypto from "crypto";

export function myStringify(obj: any) {
  return JSON.stringify(obj, null, 2);
}

export function hashString(input: string): Buffer {
  const hash = crypto.createHash("sha256");
  hash.update(input);
  return hash.digest();
}

export function hashStringToHexString(input: string): string {
  const hash = crypto.createHash("sha256");
  hash.update(input);
  // return hex string of digest
  return hash.digest("hex");
}

export function hashStringToHexStringWithPrefix(input: string): string {
  return "0x" + hashStringToHexString(input);
}

export function largeNumberStringToHexString(
  largeNumberString: string
): string {
  const bigInt = BigInt(largeNumberString);
  let hexString = bigInt.toString(16);

  // Ensure the hexadecimal string is 64 characters long
  while (hexString.length < 64) {
    hexString = "0" + hexString;
  }

  return "0x" + hexString;
}

export function hashStringToBigInt(input: string): bigint {
  const hash = crypto.createHash("sha256");
  hash.update(input);
  const hashedString = hash.digest("hex");
  let hex = "0x" + hashedString;
  return BigInt(hex) / BigInt(10);
}

// export async function snarkyPoker(
//   g: () => Promise<any>,
//   h: () => void
// ): Promise<any> {
//   let intervalId: number | null = null;
//   try {
//     intervalId = window.setInterval(h, 250);
//     const result = await g();
//     return result;
//   } finally {
//     intervalId !== null && window.clearInterval(intervalId);
//   }
// }

export async function snarkyPoker(g: () => Promise<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    const innerFn = async () => {
      try {
        const result = await g();
        window.clearInterval(intervalId);
        resolve(result);
      } catch (error) {
        // Ignore errors, or you could handle them in some way if needed
      }
    };
    innerFn();
    const intervalId = window.setInterval(innerFn, 500);
  });
}

export function stringToHex(input: string) {
  let result = "";
  for (let i = 0; i < input.length; i++) {
    // Convert each character to hexadecimal and pad with a leading zero if necessary
    result += input.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return result;
}

export function hexToString(hex: string) {
  let result = "";
  for (let i = 0; i < hex.length; i += 2) {
    result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return result;
}

export function insertNewlineEveryNChars(str: string, n = 90) {
  return str.match(new RegExp(".{1," + n + "}", "g"))!.join("\n");
}
