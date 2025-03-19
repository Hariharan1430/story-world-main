import React from "react";
import { Dimensions, FlatList, StyleSheet, View, Text } from "react-native";
import StoryCard from "./StoryCard";
import { ActivityIndicator } from "react-native";

// Define StoryCard props type
type StoryCardProps = {
  id: string;
  title: string;
  genre: string;
  duration: string;
  description: string;
  content: string;
  thumbnailUrl: string;
  imageUrl: string;
  likes: string;
  mode: 'mini' | 'full'; // Add mode type
};

type Story = {
  id: string;
  title: string;
  genre: string;
  duration: string;
  description: string;
  content?: string;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  likes?: string;
};

type StoriesListProps = {
  stories: Story[];
  fetchMoreStories: () => void;
  isLoading: boolean;
  error?: string;
};

const { width } = Dimensions.get("window");
const MIN_CARD_WIDTH = 160;
const numColumns = Math.max(1, Math.floor(width / MIN_CARD_WIDTH));

const VerticalStoriesList: React.FC<StoriesListProps> = ({
  stories,
  fetchMoreStories,
  isLoading,
  error,
}) => {
  const EmptyListMessage = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {error || "No stories found. Check back later!"}
      </Text>
    </View>
  );

  const LoadingFooter = () => (
    isLoading ? (
      <View style={styles.loading}>
        <ActivityIndicator color="#00AAFF" size="large" />
        <Text style={styles.loadingText}>Loading stories...</Text>
      </View>
    ) : null
  );

  const renderStoryCard = ({ item }: { item: Story }) => (
    <View style={styles.cardContainer}>
      <StoryCard 
        {...item} 
        thumbnailUrl={item.thumbnailUrl || ''} 
        imageUrl={item.imageUrl || ''}
        likes={item.likes || '0'}
        content={item.content || ''}
        mode="mini"
      />
    </View>
  );

  return (
    <FlatList
      data={stories}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={renderStoryCard}
      numColumns={numColumns}
      contentContainerStyle={[
        styles.list,
        stories.length === 0 && styles.emptyList
      ]}
      onEndReached={fetchMoreStories}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={EmptyListMessage}
      ListFooterComponent={LoadingFooter}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 8,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  cardContainer: {
    flex: 1,
    minWidth: MIN_CARD_WIDTH,
    maxWidth: width / numColumns,
    marginBottom: 16,
  },
  loading: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
    fontFamily: "DupletRoundedSemibold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: "DupletRoundedSemibold",
    color: '#666',
  },
});

export default VerticalStoriesList;