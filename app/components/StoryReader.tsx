import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, AppState } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Speech from "expo-speech";

interface StoryReaderProps {
  content: string;
}

const StoryReader: React.FC<StoryReaderProps> = ({ content }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pausedPosition, setPausedPosition] = useState(0); // Track where the audio stopped
  const [dotAnimation, setDotAnimation] = useState(""); // For the dot animation
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState !== "active" && isPlaying) {
        pauseStory(); // Pause story when the app goes to the background
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [isPlaying]);

  const playStory = () => {
    const options = {
      rate: 0.4,
      pitch: 1,
      language: "en",
      onDone: () => {
        setIsPlaying(false);
        setPausedPosition(0); // Reset position when story ends
        setDotAnimation(""); // Reset animation
      },
    };

    const textToSpeak = content.substring(pausedPosition);
    Speech.speak(textToSpeak, options);
    setIsPlaying(true);
    startDotAnimation();
  };

  const pauseStory = () => {
    Speech.stop(); // Stop the speech
    const currentPosition = pausedPosition + content.substring(pausedPosition).length; // Approximation
    setPausedPosition(currentPosition); // Save the paused position
    setIsPlaying(false);
    setDotAnimation(""); // Stop dot animation
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pauseStory();
    } else {
      playStory();
    }
  };

  const startDotAnimation = () => {
    const dotInterval = setInterval(() => {
      setDotAnimation((prev) => (prev === "..." ? "" : prev + "."));
    }, 500);

    return () => clearInterval(dotInterval);
  };

  return (
    <View style={styles.rowContainer}>
      <TouchableOpacity style={styles.container} onPress={togglePlayback}>
        <FontAwesome
          name={isPlaying ? "pause-circle" : "play-circle"}
          color="#555"
          style={styles.icon}
        />
        <Text style={styles.text}>
          {isPlaying ? `Playing${dotAnimation}` : "Listen"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
    color: "#00AAFF",
    fontSize: 25,
  },
  text: {
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
    color: "#333",
    width: 65, // Fixed width to prevent shifting
    textAlign: "left",
  },
});

export default StoryReader;
