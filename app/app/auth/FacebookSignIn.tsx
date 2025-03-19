import React from 'react';
import { TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
// import * as Facebook from 'expo-facebook';
import { FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function FacebookSignIn() {
  const handleFacebookLogin = async () => {
    try {
    //   await Facebook.initializeAsync({
    //     appId: 'YOUR_FACEBOOK_APP_ID',
    //   });
    //   const result = await Facebook.logInWithReadPermissionsAsync({
    //     permissions: ['public_profile', 'email'],
    //   });

    //   if (result.type === 'success') {
    //     const credential = FacebookAuthProvider.credential(result.token);
    //     signInWithCredential(auth, credential)
    //       .then(() => Alert.alert('Logged in with Facebook!'))
    //       .catch((error) => Alert.alert('Login failed', error.message));
    //   } else {
    //     Alert.alert('Login canceled');
    //   }
    } catch (error: any) {
      Alert.alert('Login error', error.message);
    }
  };

  return (
      <TouchableOpacity
        style={styles.socialButton}
        onPress={() => handleFacebookLogin()}
      >
        <Image
          style={styles.icon}
          source={require("../../assets/images/facebook.png")}
        />
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    socialButton: {
      marginHorizontal: 10,
    },
    icon: {
      width: 50,
      height: 50,
      borderRadius: 20,
    },
  });