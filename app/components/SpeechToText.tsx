// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// import * as SpeechRecognition from 'expo-speech-recognition';

// export default function SpeechToText() {
//   const [isListening, setIsListening] = useState(false);
//   const [recognizedText, setRecognizedText] = useState('');
//   const [hasPermission, setHasPermission] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const { status } = await SpeechRecognition..requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const toggleListening = async () => {
//     try {
//       if (isListening) {
//         await SpeechRecognition.stopListeningAsync();
//         setIsListening(false);
//       } else {
//         setRecognizedText('');
//         setIsListening(true);
//         await SpeechRecognition.startListeningAsync({
//           partialResults: true,
//           onResult: (result) => {
//             setRecognizedText(result.value[0]);
//           },
//         });
//       }
//     } catch (error) {
//       console.error('Error toggling speech recognition:', error);
//       setIsListening(false);
//     }
//   };

//   if (!hasPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>We need your permission to use the microphone</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[styles.button, isListening && styles.listeningButton]}
//         onPress={toggleListening}
//         accessibilityRole="button"
//         accessibilityLabel={isListening ? "Stop listening" : "Start listening"}
//         accessibilityState={{ selected: isListening }}
//       >
//         <Text style={styles.buttonText}>
//           {isListening ? 'Stop Listening' : 'Start Listening'}
//         </Text>
//       </TouchableOpacity>
//       <View style={styles.textContainer}>
//         <Text style={styles.recognizedText} accessibilityLabel={`Recognized text: ${recognizedText}`}>
//           {recognizedText || 'Tap "Start Listening" and speak'}
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   button: {
//     backgroundColor: '#4CAF50',
//     padding: 15,
//     borderRadius: 25,
//     marginBottom: 20,
//     width: 200,
//     alignItems: 'center',
//   },
//   listeningButton: {
//     backgroundColor: '#F44336',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   textContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 10,
//     padding: 15,
//     width: '100%',
//     minHeight: 100,
//     backgroundColor: 'white',
//   },
//   recognizedText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   permissionText: {
//     fontSize: 16,
//     color: '#333',
//     textAlign: 'center',
//   },
// });

