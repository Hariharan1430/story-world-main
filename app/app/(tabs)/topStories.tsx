import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  UIManager,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import StoryCardLarge from "@/components/StoryCardLarge";
import { IconSymbol } from "@/components/ui/IconSymbol";
import UserHeader from "@/components/UserHeader";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionSection = ({ title, isExpanded, onPress, children }) => {
  const [rotateAnimation] = useState(new Animated.Value(isExpanded ? 1 : 0));
  const [heightAnimation] = useState(new Animated.Value(isExpanded ? 1 : 0));

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnimation, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(heightAnimation, {
        toValue: isExpanded ? 1 : 0,
        duration: 300,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpanded]);

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const height = heightAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 510], // Adjust this value based on your content height
  });

  return (
    <View style={styles.section}>
      <TouchableOpacity onPress={onPress} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <FontAwesome name="chevron-down" size={18} color="#00AAFF" />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.sectionContent, { height }]}>
        {children}
      </Animated.View>
    </View>
  );
};

const App = () => {
  const [expandedSection, setExpandedSection] = useState("day");

  const handleSectionPress = (section) => {
    setExpandedSection(section === expandedSection ? null : section);
  };

  const storyOfTheDay = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "The Brave Little Squirrel",
    genre: "Adventure",
    likes: 203,
    description:
      "A daring squirrel sets out to rescue her friend trapped across the river. A daring squirrel sets out to rescue her friend trapped across the river.",
    thumbnailUrl: "https://via.placeholder.com/150"
  };

  return (
    <View style={styles.container}>
      <UserHeader />
      <Text style={styles.topStoriesTitle}>Top stories</Text>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#F8F8F8', dark: '#F8F8F8' }}
        headerImage={
          <IconSymbol
            size={1}
            color="#808080"
            name="chevron.left.forwardslash.chevron.right"
            style={styles.headerImage}
          />
        }
      >
        <AccordionSection
          title="Story of the Day"
          isExpanded={expandedSection === "day"}
          onPress={() => handleSectionPress("day")}
        >
          <StoryCardLarge {...storyOfTheDay} />
        </AccordionSection>

        <AccordionSection
          title="Story of the Week"
          isExpanded={expandedSection === "week"}
          onPress={() => handleSectionPress("week")}
        >
          <StoryCardLarge {...storyOfTheDay} />
        </AccordionSection>

        <AccordionSection
          title="Story of the Month"
          isExpanded={expandedSection === "month"}
          onPress={() => handleSectionPress("month")}
        >
          <StoryCardLarge {...storyOfTheDay} />
        </AccordionSection>
      </ParallaxScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  topStoriesTitle: {
    fontSize: 24,
    marginBottom: 16,
    marginTop: -10,
    fontFamily: 'DupletRoundedSemibold',
    color: "#333",
  },
  section: {
    marginBottom: 16,
    // borderRadius: 12,
    overflow: "hidden",
    // backgroundColor: "#ffffff",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    // backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "DupletRoundedSemibold",
    color: "#00AAFF",
  },
  sectionContent: {
    overflow: "hidden",
  },
  headerImage: {},
});

export default App;
