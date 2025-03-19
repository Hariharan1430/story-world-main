import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";

const SWPrimaryButton = ({ title, onPress, disabled, loading }) => (
  <TouchableOpacity
    style={[styles.primaryButton, { opacity: disabled ? 0.5 : 1 }]}
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? (
      <ActivityIndicator size="small" color="#1C97E4" />
    ) : (
      <Text style={styles.primaryButtonText}>{title}</Text>
    )}
  </TouchableOpacity>
);

const SWSecondaryButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
    <Text style={styles.secondaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const SWButtonGroup = ({ primaryButtonProps, secondaryButtonProps, showSecondaryButton }) => (
  <View style={showSecondaryButton ? styles.twoButtonContainer : styles.singleButtonContainer}>
    <SWPrimaryButton {...primaryButtonProps} />
    {showSecondaryButton && <SWSecondaryButton {...secondaryButtonProps} />}
  </View>
);

const styles = StyleSheet.create({
  twoButtonContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 20,
  },
  singleButtonContainer: {
    width: "100%",
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#1C97E4",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#1C97E4",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  secondaryButtonText: {
    color: "#1C97E4",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SWButtonGroup;
