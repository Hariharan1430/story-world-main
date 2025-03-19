import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

const GetStartedButton = () => {
  return (
    <Link href="/login" asChild>
      <TouchableOpacity activeOpacity={0.8} style={styles.buttonContainer}>
        <LinearGradient
          colors={['#00D9F5', '#6C00FF', '#A42BFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.innerButton}>
            <Text style={styles.buttonText}>Get Started</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBorder: {
    padding: 4, // border width
    borderRadius: 50, // Fully rounded corners
  },
  innerButton: {
    backgroundColor: '#F4F5F8', // Inner button background color
    borderRadius: 50, // Match the border radius of the outer layer
    paddingVertical: 12, // Adjusted vertical padding for better sizing
    paddingHorizontal: 35, // Adjusted horizontal padding for proportion
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 22, // Larger font size
    color: '#000', // Text color
    fontFamily: 'DupletRoundedSemibold', // Ensure font consistency
  },
});

export default GetStartedButton;
