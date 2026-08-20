import React, { useEffect, useRef, useState } from 'react';
import { Image, View, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  cancelAnimation,
} from 'react-native-reanimated';
import { useStepsStore } from '@/src/stores/useStepsStore';
import {useUserStore} from "@/src/stores/useUserStore";
import { AVATAR_OPTIONS } from '@/src/constants/avatars';

const AnimatedImage = Animated.createAnimatedComponent(Image);

// Dimensions
const COMPONENT_HEIGHT = 180;
const AVATAR_FRAME_HEIGHT = 512;
const AVATAR_FRAME_WIDTH = 161;
const GROUND_HEIGHT = 100;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CHARACTER_SCALE = 0.1;

// Spritesheets
const GRASS_FRAMES = 20;
const AVATAR_FRAMES = 20;
const AEROGON_FRAME_SIZE = 512;
const GRASS_NATIVE_WIDTH = 22560;
const GRASS_NATIVE_HEIGHT = 456;
const GRASS_FRAME_WIDTH = 1128;

// Animation speeds
const CHARACTER_FRAME_INTERVAL = 90; // ms per frame
const GROUND_FRAME_INTERVAL = 50;   // ms per frame
const WALKING_TIMEOUT = 1500;       // ms to consider "still walking"
const WALKING_CHECK_INTERVAL = 300; // ms to recheck walking state

export default function WalkingAnimation() {
  const { user } = useUserStore();
  const lastStepAt = useStepsStore((s) => s.lastStepAt);
  const [isWalking, setIsWalking] = useState(false);

  const avatarConfig = AVATAR_OPTIONS.find((a) => a.id === user?.avatar) || AVATAR_OPTIONS[0];

  // Frame indices as shared values for animation
  const charFrameOffset = useSharedValue(0);
  const groundFrameOffset = useSharedValue(0);

  // Intervals refs
  const charIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const groundIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const walkingCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Walking state check
  useEffect(() => {
    const checkWalking = () => {
      const now = Date.now();
      const walking = now - lastStepAt < WALKING_TIMEOUT;
      setIsWalking(walking);
    };

    checkWalking();
    walkingCheckRef.current = setInterval(checkWalking, WALKING_CHECK_INTERVAL);

    return () => {
      if (walkingCheckRef.current) clearInterval(walkingCheckRef.current);
    };
  }, [lastStepAt]);

  // Character animation loop
  useEffect(() => {
    if (isWalking) {
      let currentFrame = 0;
      charIntervalRef.current = setInterval(() => {
        currentFrame = (currentFrame + 1) % avatarConfig.frames;
        charFrameOffset.value = currentFrame * avatarConfig.frameWidth;
      }, CHARACTER_FRAME_INTERVAL);
    } else {
      if (charIntervalRef.current) clearInterval(charIntervalRef.current);
      charFrameOffset.value = 0;
      cancelAnimation(charFrameOffset);
    }

    return () => {
      if (charIntervalRef.current) clearInterval(charIntervalRef.current);
    };
  }, [isWalking, charFrameOffset, avatarConfig]);

  // Ground animation loop
  useEffect(() => {
    if (isWalking) {
      let currentFrame = 0;
      groundIntervalRef.current = setInterval(() => {
        currentFrame = (currentFrame + 1) % GRASS_FRAMES;
        groundFrameOffset.value = currentFrame * SCREEN_WIDTH;
      }, GROUND_FRAME_INTERVAL);
    } else {
      if (groundIntervalRef.current) clearInterval(groundIntervalRef.current);
      groundFrameOffset.value = 0;
      cancelAnimation(groundFrameOffset);
    }

    return () => {
      if (groundIntervalRef.current) clearInterval(groundIntervalRef.current);
    };
  }, [isWalking, groundFrameOffset]);

  // Character animated style
  const charAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
        { translateX: -charFrameOffset.value + 2}
    ],
  }));

  // Ground animated style
  const groundAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -groundFrameOffset.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Ground Layer */}
      <View style={styles.groundContainer}>
        <AnimatedImage
          source={require('@/src/assets/images/spritesheets/background/grass-spritesheet.png')}
          style={[
            styles.groundImage,
            groundAnimatedStyle,
            {
              width: GRASS_FRAMES * SCREEN_WIDTH,
              height: GROUND_HEIGHT,
            },
          ]}
        />
      </View>

      {/* Character Layer */}
      <View style={[
        styles.characterContainer,
        {left: avatarConfig.id === "avatar_m" ? 110 : 90,},
      ]}>
        <View style={[styles.characterWindow, { width: avatarConfig.frameWidth, height: avatarConfig.frameHeight }]}>
          <AnimatedImage
            source={avatarConfig.sprite}
            style={[
              styles.characterImage,
              charAnimatedStyle,
              {
                width: avatarConfig.frames * avatarConfig.frameWidth,
                height: avatarConfig.frameHeight
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: COMPONENT_HEIGHT - 20,
    width: '100%',
    backgroundColor: 'rgba(240,240,240,0)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0
  },
  groundContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: GROUND_HEIGHT,
    overflow: 'hidden',
  },
  groundImage: {
    resizeMode: 'stretch',
  },
  characterContainer: {
    zIndex: 10,
    position: "absolute",
    bottom: -80,
    transform: [{scale: 0.5}],
    justifyContent: 'center',
    alignItems: 'center'
  },
  characterWindow: {
    width: AVATAR_FRAME_WIDTH,
    height: AVATAR_FRAME_HEIGHT,
    overflow: 'hidden'
  },
  characterImage: {
    resizeMode: 'cover'
  },
});
