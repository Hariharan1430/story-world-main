import React from "react";
import { TouchableOpacity, StyleSheet, Image, View, Dimensions } from "react-native";

const SocialButton = ({ onPress, type, style }) => {
  // Resolve icon paths dynamically
  const icon = type === "facebook"
    ? require("@/assets/images/facebook.png")
    : require("@/assets/images/google.png");

  const borderColor = type === "facebook" ? "#4267B2" : "#DB4437";

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { borderColor }, style]}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  button: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: "60%", // Icon size relative to button
    height: "60%",
  },
});

export default SocialButton;