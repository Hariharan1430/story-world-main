import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
  ActivityIndicator,
  Animated,
} from "react-native";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, firestore } from "../firebaseConfig";
import { User } from "../common/types";
import { getAvatarPathById } from "../services/avatarService";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import AvatarSelector from "@/components/AvatarSelector"; // Assuming this component exists
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { saveUserData } from "../services/firestoreService";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [screenTitle, setScreenTitle] = useState("Profile");
  const [showMenuItems, setShowMenuItems] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string | null>(null); // Track which view to show
  const [pushNotificationsEnabled, setPushNotificationsEnabled] =
    useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false); // Track save button state
  const [displayName, setDisplayName] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const shakeAnimation = new Animated.Value(0); // Declare shakeAnimation properly
  const [selectedAvatarId, setSelectedAvatarId] = useState("1");
  // const [displayName, setDisplayName] = useState("");

  const handleEditProfile = () => {
    setCurrentView("editProfile");
    setScreenTitle("Edit Profile");
    toggleMenuItems(false);
  };

  const handleSettings = () => {
    setCurrentView("settings");
    setScreenTitle("Settings");
    toggleMenuItems(false);
  };

  const handleChangePassword = () => {
    setCurrentView("changePassword");
    setScreenTitle("Change Password");
    toggleMenuItems(false);
  };

  const toggleMenuItems = (show: boolean) => {
    setShowMenuItems(show);
  };

  const handleLogout = async () => {
    await auth.signOut();
    await AsyncStorage.removeItem("user");
    router.push("/login");
  };

  const menuItems = [
    {
      label: "Edit Profile",
      icon: <MaterialIcons name="edit" size={20} color="#00AAFF" />,
      handler: handleEditProfile,
    },
    {
      label: "Settings",
      icon: <Ionicons name="settings-outline" size={20} color="#00AAFF" />,
      handler: handleSettings,
    },
    {
      label: "Change Password",
      icon: <FontAwesome5 name="lock" size={20} color="#00AAFF" />,
      handler: handleChangePassword,
    },
    {
      label: "Logout",
      icon: <Ionicons name="log-out-outline" size={20} color="red" />,
      handler: handleLogout,
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const userDataString = await AsyncStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString) as User;
        setUser(userData);
        setDisplayName(userData.displayName || "");
      }
    };
    fetchUser();
  }, []);

  const validateDisplayName = () => {
    if (!displayName.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        displayName: "Display Name is required",
      }));
      return false;
    }
    setErrors((prevErrors) => {
      const { displayName, ...rest } = prevErrors;
      return rest;
    });
    return true;
  };

  const validatePasswordFields = () => {
    const errors: any = {};
    if (!newPassword.trim()) {
      errors.newPassword = "New Password is required";
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (currentView === "editProfile") {
      if (validateDisplayName()) {
        setIsSaving(true);

        await updateProfileInfo(user?.id, displayName, selectedAvatarId);

        // setTimeout(() => {
        //   setIsSaving(false);
        //   setCurrentView(null); // Hide the current view and go back to links
        // }, 2000);

        setIsSaving(false);
        setCurrentView(null);

        toggleMenuItems(true);
      } else {
        shake();
      }
    } else if (currentView === "changePassword") {
      if (validatePasswordFields()) {
        setIsSaving(true);
        setTimeout(() => {
          setIsSaving(false);
          setCurrentView(null); // Hide the current view and go back to links
        }, 2000);

        toggleMenuItems(true);
      } else {
        shake();
      }
    }
  };

  //   import AsyncStorage from '@react-native-async-storage/async-storage';
  // import firestore from '@react-native/firestore'; // Assuming you are using Firestore

  const updateProfileInfo = async (userId, displayName, avatar) => {
    try {
      // Prepare the updated user data
      const updatedData = {
        displayName: displayName,
        avatar: avatar,
      };      

      // Update user data in Firestore using the helper method
      await saveUserData(userId, updatedData);

      // Update AsyncStorage with the new display name and avatar URL
      const updatedUserData = {
        id: userId,
        displayName: displayName,
        email: user?.email,
        avatar: avatar,
      };

      if (user) {
        user.avatar = selectedAvatarId;
        user.displayName = displayName;
      }

      await AsyncStorage.setItem("user", JSON.stringify(updatedUserData));
      console.log("User profile updated in AsyncStorage!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 15,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -15,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderEditProfile = () => (
    <View style={styles.editProfileContainer}>
      <Text style={styles.inputLabel}>
        Choose an avatar <Text style={styles.asterisk}>*</Text>
      </Text>
      <AvatarSelector
        onSelectAvatar={(id) => setSelectedAvatarId(id)}
        selectedAvatarId={user?.avatar}
      />
      <Text style={styles.inputLabel}>
        Display Name <Text style={styles.asterisk}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.displayName && styles.inputError]}
        placeholder="Display name"
        placeholderTextColor="#A9A9A9"
        value={displayName}
        onChangeText={setDisplayName}
        onBlur={validateDisplayName}
      />
      {errors.displayName && (
        <Text style={styles.errorText}>{errors.displayName}</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={isSaving}
        >
          <View style={styles.buttonContent}>
            {isSaving && <ActivityIndicator size="small" color="#fff" />}
            <Text style={styles.buttonText}>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.settingsOption}>
        <Text style={styles.optionText}>Enable Push Notifications</Text>
        <Switch
          value={pushNotificationsEnabled}
          onValueChange={(value) => setPushNotificationsEnabled(value)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={isSaving}
        >
          <View style={styles.buttonContent}>
            {isSaving && <ActivityIndicator size="small" color="#fff" />}
            <Text style={styles.buttonText}>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChangePassword = () => (
    <View style={styles.changePasswordContainer}>
      <Text style={styles.inputLabel}>
        New Password <Text style={styles.asterisk}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.newPassword && styles.inputError]}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        onBlur={validatePasswordFields}
      />
      {errors.newPassword && (
        <Text style={styles.errorText}>{errors.newPassword}</Text>
      )}
      <Text style={styles.inputLabel}>
        Confirm Password <Text style={styles.asterisk}>*</Text>
      </Text>
      <TextInput
        style={[styles.input, errors.confirmPassword && styles.inputError]}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onBlur={validatePasswordFields}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={isSaving}
        >
          <View style={styles.buttonContent}>
            {isSaving && <ActivityIndicator size="small" color="#fff" />}
            <Text style={styles.buttonText}>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleCancel = () => {
    setCurrentView(null); // Hide the current view and go back to links
    setErrors({});
    toggleMenuItems(true);
  };

  const renderContent = () => {
    if (currentView === "editProfile") {
      return renderEditProfile();
    } else if (currentView === "settings") {
      return renderSettings();
    } else if (currentView === "changePassword") {
      return renderChangePassword();
    }
    return null;
  };

  return (
    <ParallaxScrollView>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{screenTitle}</Text>
        </View>

        {/* Profile Section */}
        {/* <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={getAvatarPathById(user?.avatar || "1")}
              style={styles.avatar}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View> */}
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={getAvatarPathById(user?.avatar || "1")}
              style={styles.avatar}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Links */}
        {showMenuItems && (
          <View style={styles.linksContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.handler}
              >
                <View style={styles.menuItemContent}>
                  {item.icon}
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Render content based on current view */}
        {renderContent()}
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: "DupletRoundedSemibold",
  },
  profileSection: {
    flexDirection: "column", // Changed from row to column
    alignItems: "center", // Center items horizontally
    justifyContent: "center", // Center items vertically
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  avatarContainer: {
    marginBottom: 15, // Add some space between avatar and text
  },
  avatar: {
    width: 150, // Slightly larger avatar
    height: 150,
    borderRadius: 75, // Make it perfectly round
  },
  profileInfo: {
    alignItems: "center", // Center text horizontally
  },
  profileName: {
    fontSize: 22,
    fontFamily: "DupletRoundedSemibold",
    marginBottom: 5, // Add some space between name and email
  },
  profileEmail: {
    fontSize: 15,
    fontFamily: "DupletRoundedSemibold",
    color: "#666", // Optional: make email slightly less prominent
  },
  linksContainer: {
    marginTop: 0,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 17,
    fontFamily: "DupletRoundedSemibold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#00AAFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
    marginBottom: 10,
    height: 40,
  },
  inputError: {
    borderColor: "red",
    marginBottom: 5,
  },
  asterisk: {
    color: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    fontFamily: "DupletRoundedSemibold",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },
  button: {
    backgroundColor: "#00AAFF",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 25,
    borderColor: "#00AAFF",
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  editProfileContainer: {
    padding: 0,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "DupletRoundedSemibold",
    marginBottom: 5,
    color: "#333",
  },
  changePasswordContainer: {
    padding: 0,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 15,
  },
  settingsContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  settingsOption: {
    flexDirection: "row",
    justifyContent: "space-between", // Ensures text and toggle are spaced out
    width: "100%", // Ensures they take up the full width
    paddingVertical: 5,
    alignItems: "center", // Aligns the text and toggle in the center vertically
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "DupletRoundedSemibold",
  },
});

export default ProfileScreen;
