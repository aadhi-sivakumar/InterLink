import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const COLORS = {
  primary: "#7CA7D9",
};

interface GlowWrapperProps {
  children: React.ReactNode;
  showGlow: boolean;
  animatedValue?: Animated.Value;
}

export default function GlowWrapper({ children, showGlow, animatedValue }: GlowWrapperProps) {
  if (!showGlow) {
    return <View>{children}</View>;
  }

  const shadowOpacity = animatedValue
    ? animatedValue.interpolate({
        inputRange: [1, 1.3],
        outputRange: [0.8, 1],
      })
    : 1;

  const shadowRadius = animatedValue
    ? animatedValue.interpolate({
        inputRange: [1, 1.3],
        outputRange: [15, 25],
      })
    : 15;

  return (
    <Animated.View
      style={[
        styles.glowContainer,
        {
          shadowOpacity,
          shadowRadius,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glowContainer: {
    borderRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    elevation: 15,
  },
});

