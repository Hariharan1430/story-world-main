import React, { useEffect, useRef } from "react";
import {
  Image,
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "./common/types";
import StoryWorldLogo from "@/components/StoryWorldLogo";

export default function AccountCreatedScreen() {
  const [displayName, setDisplayName] = React.useState<string>("");
  const cloudAnimation1 = useRef(new Animated.Value(0)).current;
  const cloudAnimation2 = useRef(new Animated.Value(0)).current;
  const cloudAnimation3 = useRef(new Animated.Value(0)).current;

  // Cloud animations
  useEffect(() => {
    // Start cloud animations
    Animated.loop(
      Animated.timing(cloudAnimation1, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(cloudAnimation2, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(cloudAnimation3, {
        toValue: 1,
        duration: 35000,
        useNativeDriver: true,
      })
    ).start();

    // Auto-navigate after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/(tabs)");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Cloud animation translations
  const cloudTranslate1 = cloudAnimation1.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 400],
  });

  const cloudTranslate2 = cloudAnimation2.interpolate({
    inputRange: [0, 1],
    outputRange: [400, -400],
  });

  const cloudTranslate3 = cloudAnimation3.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userDataString = await AsyncStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString) as User;
        setDisplayName(userData.displayName || "");
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Logo Container */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoContainer}>
            <StoryWorldLogo />
          </View>
        </View>

        {/* Text Container */}
        <View style={styles.textContainer}>
          <Animatable.Text 
            animation="bounceIn" 
            delay={300} 
            style={styles.title}
          >
            Hey {displayName}!
          </Animatable.Text>

          <Animatable.Text
            animation="fadeIn"
            delay={600}
            style={styles.subtitle}
          >
            Your journey begins now!
          </Animatable.Text>

          <Animatable.Text
            animation="slideInUp"
            delay={900}
            style={styles.message}
          >
            Get ready to unleash your creativity
          </Animatable.Text>
        </View>
      </View>

      {/* Animated Clouds in Foreground */}
      <View style={styles.cloudsContainer}>
        <Animated.View
          style={[
            styles.cloud,
            { top: '10%', transform: [{ translateX: cloudTranslate1 }] },
          ]}
        >
          <Image
            source={require("../assets/images/clouds.png")}
            style={styles.cloudImage}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            { top: '25%', transform: [{ translateX: cloudTranslate2 }] },
          ]}
        >
          <Image
            source={require("../assets/images/clouds.png")}
            style={styles.cloudImage}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            { top: '40%', transform: [{ translateX: cloudTranslate3 }] },
          ]}
        >
          <Image
            source={require("../assets/images/clouds.png")}
            style={styles.cloudImage}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cloudsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3, // Increased z-index to show above logo
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: '100%',
    height: 120, // Fixed height for logo container
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 20, // Added padding to prevent clipping
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    zIndex: 2,
  },
  cloud: {
    position: 'absolute',
    width: 250,
    height: 120,
    opacity: 0.8,
  },
  cloudImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 32,
    color: '#333',
    fontFamily: 'DupletRoundedSemibold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#555',
    fontFamily: 'DupletRoundedSemibold',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'DupletRoundedSemibold',
    textAlign: 'center',
  },
});