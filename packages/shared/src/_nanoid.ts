// Tiny inline nanoid replacement (avoids extra dep). Cryptographically random.
import { randomBytes } from "crypto";

export function customAlphabet(alphabet: string, size: number): () => string {
  const len = alphabet.length;
  return () => {
    const bytes = randomBytes(size);
    let out = "";
    for (let i = 0; i < size; i++) {
      out += alphabet[bytes[i]! % len];
    }
    return out;
  };
}
