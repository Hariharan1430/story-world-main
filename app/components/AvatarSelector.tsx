import React, { useRef, useState, useEffect } from 'react'; 
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from 'react-native';
import type { AvatarCarouselProps } from '../app/common/types';
import { AvatarsList } from '../app/services/avatarService';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.22; // Adjust size of items
const SPACING = 15;
const ITEM_FULL_WIDTH = ITEM_WIDTH + SPACING * 2;

const AvatarSelector: React.FC<AvatarCarouselProps> = ({
  onSelectAvatar,
  selectedAvatarId, // New prop for pre-selected avatar
}) => {
  const [activeIndex, setActiveIndex] = useState(
    selectedAvatarId
      ? AvatarsList.findIndex((avatar) => avatar.id === selectedAvatarId)
      : 0
  );
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const selectedAvatar = AvatarsList[activeIndex];
    if (selectedAvatar) {
      onSelectAvatar?.(selectedAvatar.id); // Pass selected avatar ID
    }
  }, [activeIndex, onSelectAvatar]);

  // Scroll to the pre-selected avatar on mount
  useEffect(() => {
    if (selectedAvatarId) {
      const index = AvatarsList.findIndex((avatar) => avatar.id === selectedAvatarId);
      if (index !== -1) {
        setActiveIndex(index);
        flatListRef.current?.scrollToOffset({
          offset: index * ITEM_FULL_WIDTH,
          animated: false, // Avoid animation on initial load
        });
      }
    }
  }, [selectedAvatarId]);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * ITEM_FULL_WIDTH,
      animated: true,
    });
    setActiveIndex(index);
  };

  const renderItem = ({ item, index }: ListRenderItemInfo<any>) => {
    const inputRange = [
      (index - 1) * ITEM_FULL_WIDTH,
      index * ITEM_FULL_WIDTH,
      (index + 1) * ITEM_FULL_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1.3, 0.9], // Reduce max scale
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });

    const isSelected = index === activeIndex;

    return (
      <TouchableOpacity
        onPress={() => scrollToIndex(index)}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.itemWrapper,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <View
            style={[
              styles.imageContainer,
              isSelected && styles.selectedImageContainer,
            ]}
          >
            <Image
              source={item.path}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / ITEM_FULL_WIDTH);

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < AvatarsList.length) {
      setActiveIndex(newIndex);
    }
  };

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_FULL_WIDTH,
    offset: ITEM_FULL_WIDTH * index,
    index,
  });

  return (
    <View style={styles.mainContainer}>
      <View style={styles.carouselContainer}>
        <Animated.FlatList
          ref={flatListRef}
          data={AvatarsList}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_FULL_WIDTH}
          decelerationRate={0.2}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: true,
              listener: handleScroll,
            }
          )}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingHorizontal: (width - ITEM_WIDTH) / 2 - SPACING },
          ]}
          keyExtractor={(item) => item.id}
          bounces={false}
          initialScrollIndex={activeIndex}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles remain unchanged
  mainContainer: {
    width: '100%',
    marginBottom: 10,
    marginTop: 20,
  },
  carouselContainer: {
    height: ITEM_WIDTH * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemWrapper: {
    width: ITEM_WIDTH + SPACING * 1.1,
    height: ITEM_WIDTH + SPACING * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: ITEM_WIDTH / 2,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  selectedImageContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
});

export default AvatarSelector;
