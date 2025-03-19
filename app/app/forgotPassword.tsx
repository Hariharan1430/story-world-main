import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { auth } from "./firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import SWPrimaryButton from "@/components/SWPrimaryButton";
import SWTextInput from "@/components/SWTextInput";
import StoryWorldLogo from "@/components/StoryWorldLogo";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState(""); // State to hold success/error message

  const validateEmail = (email: string) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email) ? "" : "Invalid email address";
  };

  const handlePasswordReset = async () => {
    const emailValidationError = validateEmail(email);
    setEmailError(emailValidationError);

    if (!emailValidationError) {
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage("A password reset email has been sent to your email address!");
        Alert.alert("Success", "A password reset email has been sent.");
        setEmail('');
      } catch (error: any) {
        setMessage("Failed to send password reset email. Please try again.");
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <StoryWorldLogo />
      </View>

      <Text style={styles.title}>Story World</Text>

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
        <SWPrimaryButton label="Reset Password" onPress={handlePasswordReset} />
      </View>

      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Vertically center the content
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,  // Ensure there's space between the logo and the title
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    marginTop: 40,
    textAlign: "center",
    fontFamily: "DupletRoundedSemibold",
  },
  inputContainer: {
    width: "100%",
  },
  message: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "#000",
    fontFamily: "DupletRoundedSemibold",
  },
});

export default ForgotPasswordScreen;
