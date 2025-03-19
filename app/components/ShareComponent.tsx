import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icons
import { Share } from "react-native";

interface ShareProps {
  mode?: "default" | "mini";
}

const ShareComponent: React.FC<ShareProps> = ({ mode = "default" }) => {
  const shareContent = async () => {
    try {
      await Share.share({
        message: "Check out this amazing content! https://example.com",
      });
    } catch (error: any) {
      console.error("Error sharing content:", error.message);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={shareContent}>
      <Ionicons name="share-social" size={20} color="#00AAFF" />
      {mode === "default" && <Text style={styles.label}>Share</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: 5,
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
    color: "#333",
  },
});

export default ShareComponent;
