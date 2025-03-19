import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="image" size={24} color={color} />
          ),
          tabBarLabelStyle: {
            fontFamily: 'DupletRoundedSemibold',
          },
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <FontAwesome name="search" size={24} color={color} />,
          tabBarLabelStyle: {
            fontFamily: 'DupletRoundedSemibold',
          },
        }}
      />
      <Tabs.Screen
        name="topStories"
        options={{
          title: 'Top stories',
          tabBarIcon: ({ color }) => <FontAwesome name="trophy" size={24} color={color} />,
          tabBarLabelStyle: {
            fontFamily: 'DupletRoundedSemibold',
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
          tabBarLabelStyle: {
            fontFamily: 'DupletRoundedSemibold',
          },
        }}
      />
      {/* Nested stack for "refer" and other hidden screens */}
      <Tabs.Screen
        name="stack"
        options={{
          href: null, // Hide this stack from the tab bar entirely
        }}
      />
    </Tabs>
  );
}
