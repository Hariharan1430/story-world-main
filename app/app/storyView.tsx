import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import StoryReader from "../components/StoryReader";
import ShareComponent from "../components/ShareComponent";
import Likes from "../components/Likes";
import { useLocalSearchParams } from "expo-router";
import { getStoryById } from "@/app/services/storiesService";

interface Story {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_HEADER_HEIGHT = SCREEN_HEIGHT * 0.4;
const MIN_HEADER_HEIGHT = SCREEN_HEIGHT * 0.2;

const StoryViewScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { id } = useLocalSearchParams();

  const headerHeight = useMemo(() => new Animated.Value(MAX_HEADER_HEIGHT), []);
  const contentPosition = useMemo(
    () => new Animated.Value(MAX_HEADER_HEIGHT + 20),
    []
  );

  const fetchStory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getStoryById(id as string);

      setStory(response.data);
    } catch (err) {
      setError("Failed to load the story. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStory();
  }, [fetchStory]);

  const toggleContentVisibility = () => {
    setIsContentVisible(true);

    // Animate header and content positioning
    Animated.parallel([
      Animated.timing(headerHeight, {
        toValue: MIN_HEADER_HEIGHT,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(contentPosition, {
        toValue: MIN_HEADER_HEIGHT + 10,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchStory}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!story) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Story not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated Header Section */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Image
          source={{ uri: story.imageUrl }}
          style={styles.backgroundImage}
          accessibilityLabel={`Cover image for ${story.title}`}
        />
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.6)", "rgba(0, 0, 0, 0)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientOverlay}
        />
      </Animated.View>

      {/* Animated Static Content */}
      <Animated.View
        style={[styles.staticContent, { marginTop: contentPosition }]}
      >
        <Text style={styles.title}>{story.title}</Text>
        {!isContentVisible && (
          <Text style={styles.subTitle}>{story.summary}</Text>
        )}

        <View style={styles.actionIcons}>
          <StoryReader content={story.content} />
          <ShareComponent />
          <Likes />
        </View>
      </Animated.View>

      {/* "Read Story" Button */}
      {!isContentVisible && (
        <TouchableOpacity
          style={styles.readButton}
          onPress={toggleContentVisibility}
        >
          <Text style={styles.readButtonText}>Read Story</Text>
        </TouchableOpacity>
      )}

      {/* Scrollable Story Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isContentVisible && (
          <View style={styles.contentContainer}>
            <Text style={styles.contentText}>{story.content}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 1,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  staticContent: {
    position: "absolute",
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    zIndex: 2,
  },
  title: {
    fontSize: 26,
    fontFamily: "DupletRoundedSemibold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
    color: "#686e6d",
    textAlign: "center",
    marginBottom: 10,
  },
  actionIcons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 10,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 15,
  },
  contentContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  contentText: {
    fontSize: 18,
    lineHeight: 25,
    color: "#000",
    fontFamily: "DupletRoundedRegular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#ff0000",
  },
  retryButton: {
    backgroundColor: "#00BFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  readButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    height: 50,
    width: "90%",
    backgroundColor: "#00BFFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  readButtonText: {
    fontSize: 18,
    fontFamily: "DupletRoundedSemibold",
    color: "#fff",
  },
});

export default StoryViewScreen;
