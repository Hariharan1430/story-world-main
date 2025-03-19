import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const SWSecondaryButton = ({ label, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1, // Makes the button take full width of the container
    backgroundColor: "#FFF", // Secondary button color
    paddingVertical: 15,
    borderRadius: 25, // Matching the border radius with TextInput
    borderWidth: 1,
    borderColor: "#007BFF", // Border color
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#007BFF", // Text color
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold", // Assuming the font is available
  },
});

export default SWSecondaryButton;
