import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { loadProfile, saveProfile, UserProfile } from "../utils/profileStorage";

const COLORS = {
  primary: "#7CA7D9",
  border: "#003366",
  textPrimary: "#000000",
  textSecondary: "#444444",
  background: "#FFFFFF",
};

const supportOptions = [
  "Making Friends",
  "Career Guidance",
  "Cultural Adaptation",
  "Language Learning",
  "Housing Help",
  "Academic Support",
];

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [homeCountry, setHomeCountry] = useState("");
  const [languages, setLanguages] = useState("");
  const [timeInCountry, setTimeInCountry] = useState("");
  const [reasonForComing, setReasonForComing] = useState("");
  const [supportLookingFor, setSupportLookingFor] = useState<string[]>([]);
  const [importantTraditions, setImportantTraditions] = useState("");

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await loadProfile();
      if (profile) {
        setFullName(profile.fullName || "");
        setPhoneNumber(profile.phoneNumber || "");
        setLocation(profile.location || "");
        setProfileImage(profile.profileImage || null);
        setHomeCountry(profile.homeCountry || "");
        setLanguages(profile.languages || "");
        setTimeInCountry(profile.timeInCountry || "");
        setReasonForComing(profile.reasonForComing || "");
        setSupportLookingFor(profile.supportLookingFor || []);
        setImportantTraditions(profile.importantTraditions || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to upload images!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const toggleSupportOption = (option: string) => {
    setSupportLookingFor((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleSave = async () => {
    if (!fullName.trim() || !phoneNumber.trim() || !location.trim()) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    try {
      const profile: UserProfile = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        location: location.trim(),
        profileImage,
        homeCountry,
        languages,
        timeInCountry,
        reasonForComing,
        supportLookingFor,
        importantTraditions,
      };

      await saveProfile(profile);
      Alert.alert("Success", "Profile updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        {/* Profile Image */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Profile Photo</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={48} color={COLORS.textSecondary} />
                <Text style={styles.imagePlaceholderText}>Tap to upload photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name <Text style={styles.requiredAsterisk}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Phone Number <Text style={styles.requiredAsterisk}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Location <Text style={styles.requiredAsterisk}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your location"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Cultural Information */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Home Country</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your home country"
            placeholderTextColor="#999"
            value={homeCountry}
            onChangeText={setHomeCountry}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Languages</Text>
          <TextInput
            style={styles.input}
            placeholder="Languages you speak"
            placeholderTextColor="#999"
            value={languages}
            onChangeText={setLanguages}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Time in Country</Text>
          <TextInput
            style={styles.input}
            placeholder="How long have you been here?"
            placeholderTextColor="#999"
            value={timeInCountry}
            onChangeText={setTimeInCountry}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Reason for Coming</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Why did you come to this country?"
            placeholderTextColor="#999"
            value={reasonForComing}
            onChangeText={setReasonForComing}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Support Looking For</Text>
          <View style={styles.supportOptionsContainer}>
            {supportOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.supportOption,
                  supportLookingFor.includes(option) && styles.supportOptionSelected,
                ]}
                onPress={() => toggleSupportOption(option)}
              >
                <Text
                  style={[
                    styles.supportOptionText,
                    supportLookingFor.includes(option) && styles.supportOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {supportLookingFor.includes(option) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Important Traditions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Share important traditions from your culture"
            placeholderTextColor="#999"
            value={importantTraditions}
            onChangeText={setImportantTraditions}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 24,
    textAlign: "center",
  },
  fieldGroup: {
    width: "100%",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  requiredAsterisk: {
    color: "#FF0000",
  },
  imagePicker: {
    width: "100%",
    minHeight: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  supportOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  supportOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  supportOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  supportOptionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  supportOptionTextSelected: {
    color: "#FFFFFF",
  },
  saveButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
  },
  saveButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});

