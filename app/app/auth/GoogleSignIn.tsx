import React, { useEffect, useState } from "react";
import { StyleSheet, Alert, TouchableOpacity, Image, View, Text } from "react-native";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "../firebaseConfig";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const GoogleSignIn = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "148884931412-ovtuirnnom0bnhr6661kqkkcs1tvqr22.apps.googleusercontent.com", // Replace with Web client ID
    iosClientId: '17539190816-983vcgcd7b8uu2mhbbonrnfs7lo1co9d.apps.googleusercontent.com', // Replace with iOS client ID
    androidClientId: '117539190816-9srn26tv6h5m6id1rqcoga5m6bh3r4tg.apps.googleusercontent.com', // Replace with Android client ID
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');

      const result = await promptAsync();
      if (result?.type === "success") {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        router.replace("/(tabs)");
      } else {
        setError('Google Sign In was cancelled or failed');
      }
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }

    useEffect(() => {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
          .then(() => Alert.alert("Logged in with Google!"))
          .catch((error) => Alert.alert("Login failed", error.message));
      }
    }, [response]);
  };

  return (
    <TouchableOpacity
      style={styles.socialButton}
      onPress={handleGoogleSignIn}
      disabled={!request}
    >
      <Image
        style={styles.icon}
        source={require("../../assets/images/google.png")}
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

export default GoogleSignIn;