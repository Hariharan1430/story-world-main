import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../services/auth';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn({ email, password });
      navigate('/'); // Redirect to dashboard on success
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn, isLoading, error };
};