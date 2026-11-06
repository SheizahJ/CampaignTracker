/*
  Login Page
  Note: to view this page, do url/login (ex. localhost:3000/login)
*/

import { createUser, getUsernames, getUserByUsername, verifyPassword } from '@/db/fetch_data/users';

const users = await getUsernames();

export default async function Login() {
  return (
    <main>
      {/* Add Stuff Here */}
      <h1>Login Page</h1>

      {users.map((username) => (
        <p key={username}>User: {username}</p>
      ))}
    </main>
  );
}
