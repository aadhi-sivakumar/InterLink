import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "userProfile";

export interface UserProfile {
  fullName: string;
  phoneNumber: string;
  location: string;
  profileImage: string | null;
  homeCountry: string;
  languages: string;
  timeInCountry: string;
  reasonForComing: string;
  supportLookingFor: string[];
  importantTraditions: string;
}

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
};

export const loadProfile = async (): Promise<UserProfile | null> => {
  try {
    const profileData = await AsyncStorage.getItem(PROFILE_KEY);
    if (profileData) {
      return JSON.parse(profileData);
    }
    return null;
  } catch (error) {
    console.error("Error loading profile:", error);
    return null;
  }
};

export const clearProfile = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(PROFILE_KEY);
  } catch (error) {
    console.error("Error clearing profile:", error);
  }
};

