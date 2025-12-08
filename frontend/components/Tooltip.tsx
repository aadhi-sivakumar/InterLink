import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  primary: "#7CA7D9",
  border: "#003366",
  textPrimary: "#000000",
  textSecondary: "#444444",
  background: "#FFFFFF",
};

interface TooltipProps {
  visible: boolean;
  title: string;
  description: string;
  position: { x: number; y: number; width: number; height: number };
  onClose: () => void;
  onNext?: () => void;
  showNext?: boolean;
  showSkip?: boolean;
  onSkip?: () => void;
  step?: number;
  totalSteps?: number;
  showHighlight?: boolean;
  highlightPosition?: { x: number; y: number; width: number; height: number } | null;
  highlightAnimValue?: Animated.Value;
}

export default function Tooltip({
  visible,
  title,
  description,
  position,
  onClose,
  onNext,
  showNext = false,
  showSkip = false,
  onSkip,
  step,
  totalSteps,
  showHighlight = true,
  highlightPosition,
  highlightAnimValue,
}: TooltipProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
    }
  }, [visible]);

  if (!visible) return null;

  let adjustedX: number;
  let adjustedY: number;

  if (showHighlight && position.width > 0 && position.height > 0) {
    const tooltipX = position.x + position.width / 2;
    const tooltipY = position.y + position.height + 20;
    const isBottom = tooltipY > SCREEN_HEIGHT / 2;
    // Check if this is a bottom tab bar button (very close to bottom of screen)
    const isTabBarButton = position.y > SCREEN_HEIGHT - 100;

    adjustedX = Math.max(20, Math.min(tooltipX - 140, SCREEN_WIDTH - 300));
    adjustedY = isBottom 
      ? (isTabBarButton ? position.y - 280 : position.y - 200) // Higher for tab bar buttons
      : tooltipY;
  } else {
    adjustedX = SCREEN_WIDTH / 2 - 140;
    adjustedY = SCREEN_HEIGHT / 2 - 150;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Highlight box for tab bar buttons */}
          {highlightPosition && highlightAnimValue && (
            <Animated.View
              style={{
                position: 'absolute',
                left: highlightPosition.x,
                top: highlightPosition.y,
                width: highlightPosition.width,
                height: highlightPosition.height,
                borderWidth: 3,
                borderColor: COLORS.primary,
                borderRadius: 12,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: highlightAnimValue.interpolate({
                  inputRange: [1, 1.3],
                  outputRange: [0.8, 1],
                }),
                shadowRadius: highlightAnimValue.interpolate({
                  inputRange: [1, 1.3],
                  outputRange: [15, 25],
                }),
                elevation: 15,
                pointerEvents: 'none',
              }}
            />
          )}
          <Animated.View
            style={[
              styles.tooltip,
              {
                left: adjustedX,
                top: adjustedY,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {step && totalSteps && (
              <View style={styles.stepIndicator}>
                <Text style={styles.stepText}>
                  Step {step} of {totalSteps}
                </Text>
              </View>
            )}
            <Text style={styles.tooltipTitle}>{title}</Text>
            <Text style={styles.tooltipDescription}>{description}</Text>
            <View style={styles.tooltipActions}>
              {showSkip && onSkip && (
                <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
              )}
              <View style={styles.actionButtons}>
                {showNext && onNext ? (
                  <TouchableOpacity onPress={onNext} style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Next</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={onClose} style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Got it!</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  tooltip: {
    position: 'absolute',
    width: 280,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stepIndicator: {
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tooltipTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  tooltipDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  tooltipActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  actionButtons: {
    flex: 1,
    alignItems: 'flex-end',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

