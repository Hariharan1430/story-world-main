import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          router.push('/accountCreated');
          //router.replace('/(tabs)'); // Navigate to Home screen
        } else {
          router.replace('/login'); // Navigate to Login screen
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        router.replace('/login'); // Fallback to Login screen
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Show a loading indicator while checking the login status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null; // This component will not render anything directly
}
