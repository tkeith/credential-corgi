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
  return BigInt(hex);
}
