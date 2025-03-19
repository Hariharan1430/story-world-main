import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UserHeader from '@/components/UserHeader';

const RecentStories: React.FC = () => {
  return (
    <View style={styles.container}>
      <UserHeader />
      <Text style={styles.header}>My recent stories</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    marginTop: -10,
    fontFamily: 'DupletRoundedSemibold',
  }
});

export default RecentStories;
