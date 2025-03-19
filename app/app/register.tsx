import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AvatarSelector from "../components/AvatarSelector";
import Toast from "react-native-toast-message";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "./firebaseConfig";
import { saveUserData } from "../app/services/firestoreService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "./services/apiService";

export default function RegisterScreen() {
  const router = useRouter();

  // State variables for form inputs, validation errors, and spinner state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // State variables for validation errors
  const [errors, setErrors] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Animation values for shaking
  const shakeAnim = useState(new Animated.Value(0))[0];

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Shake animation function
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRegister = async () => {
    setLoading(true); // Show loading spinner

    let formIsValid = true;
    let validationErrors = {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Validate Display Name (mandatory)
    if (!displayName) {
      formIsValid = false;
      validationErrors.displayName = "Display name is required";
    }

    // Validate Email (mandatory and regex)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
      formIsValid = false;
      validationErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      formIsValid = false;
      validationErrors.email = "Invalid email format";
    }

    // Validate Password (minimum length)
    if (!password) {
      formIsValid = false;
      validationErrors.password = "Password is required";
    } else if (password.length < 6) {
      formIsValid = false;
      validationErrors.password = "Password must be at least 6 characters long";
    }

    // Validate Confirm Password (mandatory and matching)
    if (!confirmPassword) {
      formIsValid = false;
      validationErrors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      formIsValid = false;
      validationErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(validationErrors);

    if (formIsValid) {
      try {
        const newUser = await apiService.createUser({
          email,
          password,
          displayName,
          avatarId: selectedAvatarId,
        });

        await AsyncStorage.setItem("user", JSON.stringify(newUser));

        console.log("JSON.stringify(userData) = ", JSON.stringify(newUser));

        // Reset form after successful registration
        setDisplayName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({
          displayName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to account created screen
        router.push("/accountCreated");
      } catch (error: any) {
        setLoading(false); // Hide loading spinner
        let errorMessage = "An error occurred. Please try again.";

        // Handle Firebase-specific errors
        if (error.code === "auth/email-already-in-use") {
          errorMessage =
            "This email is already in use. Please use a different email.";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password should be at least 6 characters.";
        }

        // Display error message
        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Error",
          text2: errorMessage,
        });
      }
    } else {
      // Show error toast message
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Validation Failed",
        text2: "Please check your details and try again.",
      });

      setLoading(false); // Hide loading spinner

      // Trigger shake animation for error fields
      shake();
    }
  };

  const [selectedAvatarId, setSelectedAvatarId] = useState("1");

  const handleCancel = () => {
    router.push("/login"); // Or whatever your cancel action is
  };

  return (
    <ParallaxScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Create Profile</Text>

        <Text style={styles.label}>
          Choose an avatar <Text style={styles.asterisk}>*</Text>
        </Text>
        <AvatarSelector onSelectAvatar={(id) => setSelectedAvatarId(id)} />

        {/* Display Name */}
        <Text style={styles.label}>
          Display name <Text style={styles.asterisk}>*</Text>
        </Text>
        <Animated.View
          style={[
            styles.inputContainer,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          <TextInput
            style={[styles.input, errors.displayName && styles.inputError]}
            placeholder="Display name"
            placeholderTextColor="#A9A9A9"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </Animated.View>
        {errors.displayName && (
          <Text style={styles.error}>{errors.displayName}</Text>
        )}

        {/* Email */}
        <Text style={styles.label}>
          Email address <Text style={styles.asterisk}>*</Text>
        </Text>
        <Animated.View
          style={[
            styles.inputContainer,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email address"
            placeholderTextColor="#A9A9A9"
            value={email}
            onChangeText={setEmail}
          />
        </Animated.View>
        {errors.email && <Text style={styles.error}>{errors.email}</Text>}

        {/* Password */}
        <Text style={styles.label}>
          Password <Text style={styles.asterisk}>*</Text>
        </Text>
        <Animated.View
          style={[
            styles.passwordContainer,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          <TextInput
            style={[styles.passwordInput, errors.password && styles.inputError]}
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#A9A9A9"
            />
          </TouchableOpacity>
        </Animated.View>
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        {/* Confirm Password */}
        <Text style={styles.label}>
          Confirm Password <Text style={styles.asterisk}>*</Text>
        </Text>
        <Animated.View
          style={[
            styles.passwordContainer,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          <TextInput
            style={[
              styles.passwordInput,
              errors.confirmPassword && styles.inputError,
            ]}
            placeholder="Confirm Password"
            placeholderTextColor="#A9A9A9"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={toggleConfirmPasswordVisibility}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? "eye" : "eye-off"}
              size={20}
              color="#A9A9A9"
            />
          </TouchableOpacity>
        </Animated.View>
        {errors.confirmPassword && (
          <Text style={styles.error}>{errors.confirmPassword}</Text>
        )}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonText}>Register</Text>
              </>
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontFamily: "DupletRoundedSemibold",
    marginBottom: 10,
    marginTop: 15,
    textAlign: "left",
  },
  label: {
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
  },
  asterisk: {
    color: "red",
  },
  inputContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#00AAFF",
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
  },
  inputError: {
    borderColor: "red",
    fontFamily: "DupletRoundedSemibold",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "#00AAFF",
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginTop: -5,
    fontFamily: "DupletRoundedSemibold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#00AAFF", // Corrected background color
    paddingVertical: 10,
    borderRadius: 25, // matching your border radius
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 25,
    borderColor: "#00AAFF",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
  },
  buttonDisabled: {
    backgroundColor: "#888", // Grey color for disabled state
  },
});
