import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import StoryWorldLogo from "@/components/StoryWorldLogo";
import SWTextInput from "@/components/SWTextInput";
import SWPrimaryButton from "@/components/SWPrimaryButton";
import { Link, router } from "expo-router";
import FacebookSignIn from './auth/FacebookSignIn';
import GoogleSignIn from './auth/GoogleSignIn';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserDataByUID } from '../app/services/firestoreService';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email) ? "" : "Invalid email address";
  };

  const validatePassword = (password: string) => {
    return password.length >= 8
      ? ""
      : "Password must be at least 8 characters long";
  };

  const handleLogin = async () => {
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (!emailValidationError && !passwordValidationError) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userData = await fetchUserDataByUID(userCredential.user.uid);

        if (userData && userData.success && userData.data) {
          userData.data.id = userCredential.user.uid;
          await AsyncStorage.setItem('user', JSON.stringify(userData.data));
        }

        router.push("/(tabs)");
      } catch (error) {
        // Show the Toast message on error
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Login failed',
          text2: 'Invalid email or password.',
          visibilityTime: 30000,
        });
      }
    }
  };

  const handleForgotPassword = () => {
    router.navigate('/forgotPassword');
  };

  const handleSocialLogin = (platform: string) => {
    console.log(`Logging in with ${platform}`);
    Alert.alert("Social Login", `Logging in with ${platform}`);
  };

  return (
    <ParallaxScrollView>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StoryWorldLogo />
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.title}>story world!</Text>

        <View style={styles.inputContainer}>
          <SWTextInput
            label="Email"
            value={email}
            required={true}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError("");
            }}
            placeholder="Email"
            error={emailError}
          />
          <SWTextInput
            label="Password"
            value={password}
            required={true}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError("");
            }}
            placeholder="Password"
            secureTextEntry
            error={passwordError}
          />
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <SWPrimaryButton
            label="Login"
            onPress={handleLogin}
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or continue with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <FacebookSignIn />
            <GoogleSignIn />
          </View>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don’t have an Account? </Text>
          <TouchableOpacity>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text
                  style={{
                    alignItems: "flex-end",
                    color: "#00AAFF",
                    fontSize: 18,
                    marginTop: -2,
                    fontFamily: "DupletRoundedSemibold",
                  }}
                >
                  Sign up
                </Text>
              </TouchableOpacity>
            </Link>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {/* Toast message container */}
      <Toast />
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  welcomeText: {
    fontSize: 20,
    color: "#000",
    fontFamily: "DupletRoundedSemibold",
  },
  title: {
    fontSize: 28,
    color: "#000",
    marginBottom: 20,
    fontFamily: "DupletRoundedSemibold",
  },
  inputContainer: {
    width: "100%",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: "#FF0000",
    fontWeight: "500",
    fontFamily: "DupletRoundedSemibold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#000",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 15,
    color: "#808080",
    fontFamily: "DupletRoundedSemibold",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
    marginTop: 0,
    width: "100%",
  },  
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "DupletRoundedSemibold",
  },
  signUpLink: {
    fontSize: 17,
    color: "#007BFF",
    fontFamily: "DupletRoundedSemibold",
  },
});

export default LoginScreen;
