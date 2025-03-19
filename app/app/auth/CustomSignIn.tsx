import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import SWTextInput from "../../components/SWTextInput";
import SWButtonGroup from "@/components/SWButtonGroup";
import { ValidationRule, validateField } from "../common/validator";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig"; // Import the Firebase app configuration

export default function CustomSignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register mode

  const emailRules: ValidationRule = {
    required: true,
    regex: {
      pattern: /^\S+@\S+\.\S+$/,
      message: "Invalid email address",
    },
  };

  const passwordRules: ValidationRule = {
    required: true,
    regex: {
      pattern: /^.{8,}$/,
      message: "Password must be at least 8 characters",
    },
  };

  const handleBlur = (field: string, value: string, rules: ValidationRule) => {
    const error = validateField(field, value, rules);
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleAuthAction = async () => {
    const emailError = validateField("email", formData.email, emailRules);
    const passwordError = validateField("password", formData.password, passwordRules);

    setFormErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      console.log("Fix the errors");
      return;
    }

    const auth = getAuth(app);

    try {
      if (isRegistering) {
        // Register a new user
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        Alert.alert("Success", "User registered successfully!");
      } else {
        // Login existing user
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        Alert.alert("Success", "User logged in successfully!");
      }
    } catch (error: any) {
      console.error("Authentication Error: ", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <SWTextInput
        label="Email"
        placeholder="Enter your email"
        value={formData.email}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
        // onBlur={() => handleBlur("email", formData.email, emailRules)}
        error={formErrors.email}
      />
      <SWTextInput
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChangeText={(text) => setFormData((prev) => ({ ...prev, password: text }))}
        // onBlur={() => handleBlur("password", formData.password, passwordRules)}
        secureTextEntry={true}
        error={formErrors.password}
      />
      <SWButtonGroup
        primaryButtonProps={{
          title: isRegistering ? "Register" : "Login",
          onPress: handleAuthAction,
        }}
        secondaryButtonProps={{
          title: isRegistering ? "Switch to Login" : "Switch to Register",
          onPress: () => setIsRegistering((prev) => !prev),
        }} showSecondaryButton={undefined}      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});
