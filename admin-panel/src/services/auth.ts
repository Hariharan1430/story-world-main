// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export const signIn = async ({ email, password }: LoginCredentials) => {
//   try {
//     // TODO: Replace with actual authentication API call
//     const response = await fetch('/api/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!response.ok) {
//       throw new Error('Login failed');
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };