import React, { useEffect, useRef } from 'react';
import { Image, View, StyleSheet, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export type AnimationProps = {
  source: ImageSourcePropType;
  frameCount: number;
  frameSize: number;
  displaySize?: number;
  frameInterval?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Animation({
  source,
  frameCount,
  frameSize,
  displaySize = 140,
  frameInterval = 90,
  style,
}: AnimationProps) {
  const frameOffset = useSharedValue(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let currentFrame = 0;
    intervalRef.current = setInterval(() => {
      currentFrame = (currentFrame + 1) % frameCount;
      frameOffset.value = currentFrame * displaySize;
    }, frameInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [frameCount, displaySize, frameInterval, frameOffset]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -frameOffset.value }],
  }));

  return (
    <View style={[styles.container, { width: displaySize, height: displaySize }, style]}>
      <AnimatedImage
        source={source}
        style={[
          styles.image,
          animatedStyle,
          {
            width: frameCount * displaySize,
            height: displaySize,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 8,
  },
  image: {
    resizeMode: 'stretch',
  },
});
