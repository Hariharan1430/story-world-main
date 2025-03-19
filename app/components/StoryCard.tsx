import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

type StoryCardProps = {
  id: string;
  title: string;
  genre: string;
  duration?: string;
  summary?: string;
  content?: string;
  thumbnailUrl: string;
  imageUrl: string;
  mode: "mini" | "large";
  likes?: string;
};

const onPressStory = (id: string) => {
  router.navigate(`/storyView?id=${id}`);
};

const StoryCard: React.FC<StoryCardProps> = ({
  id,
  title,
  genre,
  duration,
  summary,
  content,
  thumbnailUrl,
  imageUrl,
  mode,
  likes,
}) => {
  const imageSource = mode === "large" ? imageUrl : thumbnailUrl;

  if (mode === "large") {
    return (
      <TouchableOpacity
        style={styles.storyCardLarge}
        onPress={() => onPressStory(id)}
        activeOpacity={0.9}
      >
        <ImageBackground
          source={{ uri: imageSource }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <View style={styles.genreBadge}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.storyTitleLarge}>{title}</Text>
              {summary && (
                <Text style={styles.summaryLarge} numberOfLines={4} ellipsizeMode="tail">
                  {summary}
                </Text>
              )}
            </View>
          </LinearGradient>
        </ImageBackground>
        <View style={styles.swipeIndicator}>
          <Text style={styles.swipeText}>Swipe for more stories</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.storyCardMini}
      onPress={() => onPressStory(id)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageSource }} 
          style={styles.storyImageMini} 
          resizeMode="cover"
        />
        <View style={styles.genreBadge}>
          <Text style={styles.genreText}>{genre}</Text>
        </View>
      </View>
      
      <View style={styles.storyTextContainer}>
        <Text 
          style={styles.storyTitle} 
          numberOfLines={2} 
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  storyCardMini: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderColor: "#00AAFF",
    borderWidth: 1,
    marginRight: 16,
    overflow: "hidden",
    elevation: 4,
    width: width * 0.42,
    height: 250,
  },
  storyCardLarge: {
    width: width,
    height: '100%',
    borderRadius: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  contentContainer: {
    marginBottom: 60,
  },
  imageContainer: {
    width: "100%",
    position: "relative",
  },
  storyImageMini: {
    width: "100%",
    height: 180,
  },
  genreBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    alignSelf: 'flex-end',
    backgroundColor: "rgba(176, 218, 238, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 10,
  },
  genreText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "DupletRoundedSemibold",
  },
  storyTextContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  storyTitle: {
    fontSize: 18,
    fontFamily: "DupletRoundedSemibold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  storyTitleLarge: {
    fontSize: 32,
    fontFamily: "DupletRoundedSemibold",
    color: "#FFFFFF",
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  summaryLarge: {
    fontSize: 18,
    fontFamily: "DupletRoundedRegular",
    color: "#FFFFFF",
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  swipeIndicator: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -75 }],
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    width: 150,
    alignItems: 'center',
  },
  swipeText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "DupletRoundedSemibold",
  },
});

export default StoryCard;

