export function displayUsername(username: string): string {
  return username.length > 10 ? `${username.slice(0, 10)}...` : username;
}
