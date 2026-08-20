import * as SecureStore from 'expo-secure-store';

export async function saveToken(jwt: string): Promise<void> {
  await SecureStore.setItemAsync("jwt", jwt);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync("jwt");
}

export async function deleteToken(): Promise<void> {
  await SecureStore.deleteItemAsync("jwt");
}

export function isTokenExpired(jwt: string): boolean {
  try {
    // A JWT is three base64url segments joined by dots: header.payload.signature
    // We only need the middle segment (payload) which contains the exp claim
    const payloadBase64 = jwt.split('.')[1];

    // base64url uses - and _ instead of + and /  — replace them back before decoding
    const normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized));

    // exp is a Unix timestamp in seconds, Date.now() is milliseconds
    return decoded.exp * 1000 < Date.now();
  } catch {
    // If anything goes wrong parsing the token, treat it as expired
    return true;
  }
}
