import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const SWPrimaryButton = ({ label, onPress }) => {
  const [loading, setLoading] = useState(false);

  const onPressHandler = async () => {
    setLoading(true); // Show loading spinner
    try {
      await onPress(); // Wait for the provided onPress function to complete
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={onPressHandler}
      disabled={loading}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={[styles.buttonText, styles.loadingText]}>{label}</Text>
        </View>
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: "#00AAFF",
    paddingVertical: height * 0.015,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  buttonText: {
    color: "#FFF",
    fontSize: width * 0.05,
    fontFamily: "DupletRoundedSemibold",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 8,
  },
});

export default SWPrimaryButton;
