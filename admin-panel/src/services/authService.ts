import axios from 'axios';
import { API_URL } from '../config';

export const signIn = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/users/signin`, { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to sign in');
  }
};

export const signOut = async (token: string) => {
  try {
    await axios.post(`${API_URL}/users/signout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to sign out');
  }
};