import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";

const { width, height } = Dimensions.get("window");

const SWTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  required = false,
}) => {
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (error && !hasError) {
      setHasError(true);
      triggerShake();
    }
  }, [error]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTextChange = (text) => {
    if (hasError) setHasError(false); // Reset error animation state when user starts typing
    onChangeText(text); // Pass the new value to the parent
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          { transform: [{ translateX: shakeAnimation }] },
          error ? styles.errorInputContainer : null, // Apply red border if error exists
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={value}
          onChangeText={handleTextChange}
          secureTextEntry={secureTextEntry}
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: height * 0.02,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontFamily: "DupletRoundedSemibold",
    marginBottom: height * 0.01,
    fontSize: width * 0.045,
  },
  required: {
    color: "red",
    fontSize: width * 0.04,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#00AAFF",
    borderRadius: 50,
  },
  errorInputContainer: {
    borderColor: "red",
  },
  input: {
    padding: height * 0.015,
    fontSize: width * 0.04,
    fontFamily: "DupletRoundedSemibold",
    height: 45,
  },
  errorText: {
    marginTop: height * 0.005,
    color: "red",
    fontFamily: "DupletRoundedSemibold",
    fontSize: width * 0.04,
  },
});

export default SWTextInput;
