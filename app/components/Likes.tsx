import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LikesProps {
  initialCount?: number;
}

const Likes: React.FC<LikesProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);
  const [scaleAnim] = useState(new Animated.Value(1)); // Animation for like icon

  const handleLike = () => {
    setCount(count + 1);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleLike}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons name="thumbs-up" size={20} color="#00AAFF" />
      </Animated.View>
      <Text style={styles.label}>{count}</Text>
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

export default Likes;
