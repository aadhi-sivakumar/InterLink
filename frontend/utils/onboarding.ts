import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "onboarding_completed";

export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
    return completed === "true";
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
};

export const completeOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch (error) {
    console.error("Error completing onboarding:", error);
  }
};

export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error("Error resetting onboarding:", error);
  }
};

