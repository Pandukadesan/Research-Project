import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, Text, Easing } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

import { CarFrontView, CarSideView, CarBackView } from './CarViews';

const { width } = Dimensions.get('window');

type Position = 'inside' | 'front' | 'behind';

const POSITION_INDICATORS: Record<Position, { emoji: string; label: string }> = {
  front: { emoji: '🚗', label: 'Front View' },
  inside: { emoji: '🚪', label: 'Door Open' },
  behind: { emoji: '🔙', label: 'Rear View' },
};

interface CarVisualizerProps {
  position: Position;
}

/** Door overlay sits on SIDE view and swings open */
const DoorOverlay: React.FC<{ svgW: number; svgH: number }> = ({ svgW, svgH }) => (
  <Svg width={svgW} height={svgH} viewBox="0 0 450 280">
    <Defs>
      <LinearGradient id="doorPaint" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#3FA2F6" stopOpacity="0.95" />
        <Stop offset="100%" stopColor="#1565C0" stopOpacity="0.95" />
      </LinearGradient>
      <LinearGradient id="doorHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
      </LinearGradient>
    </Defs>

    <Path
      d="M 170 120
         Q 180 105 205 102
         L 285 102
         Q 305 105 308 120
         L 308 220
         Q 304 238 285 245
         L 205 245
         Q 180 238 170 220
         Z"
      fill="url(#doorPaint)"
      stroke="#0D47A1"
      strokeWidth="2"
      opacity={0.98}
    />

    <Path
      d="M 286 165
         Q 295 165 297 173
         Q 295 181 286 181
         L 270 181
         Q 262 181 260 173
         Q 262 165 270 165
         Z"
      fill="#111"
      opacity={0.65}
    />

    <Path
      d="M 185 120
         Q 195 112 215 112
         L 275 112
         Q 295 112 297 120
         L 297 210
         Q 294 223 275 230
         L 215 230
         Q 195 223 185 210
         Z"
      fill="url(#doorHighlight)"
      opacity={0.6}
    />
  </Svg>
);

export const CarVisualizer: React.FC<CarVisualizerProps> = ({ position }) => {
  const svgW = width - 40;
  const svgH = 280;

  // View index: 0=front, 1=side, 2=behind
  const view = useRef(new Animated.Value(1)).current;
  const door = useRef(new Animated.Value(0)).current;
  const lastPos = useRef<Position>('front');

  const ease = Easing.inOut(Easing.cubic);

  const targetIndex = useMemo(() => {
    // inside = side view + door open
    const map: Record<Position, number> = { front: 0, inside: 1, behind: 2 };
    return map[position];
  }, [position]);

  const viewTo = (toValue: number, duration = 650) =>
    Animated.timing(view, {
      toValue,
      duration,
      easing: ease,
      useNativeDriver: true,
    });

  const doorTo = (toValue: number, duration = 700) =>
    Animated.timing(door, {
      toValue,
      duration,
      easing: ease,
      useNativeDriver: true,
    });

  const layerStyle = (index: number) => {
    const opacity = view.interpolate({
      inputRange: [index - 0.75, index, index + 0.75],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    });

    const rotateY = view.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: ['-35deg', '0deg', '35deg'],
      extrapolate: 'clamp',
    });

    const translateX = view.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [28, 0, -28],
      extrapolate: 'clamp',
    });

    const scale = view.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0.96, 1, 0.96],
      extrapolate: 'clamp',
    });

    return {
      opacity,
      transform: [{ perspective: 900 }, { translateX }, { rotateY }, { scale }],
    };
  };

  const doorStyle = useMemo(() => {
    const hingeXUnits = 170;
    const hingeXPx = (hingeXUnits / 450) * svgW;

    const doorOpacity = door.interpolate({
      inputRange: [0, 0.05, 1],
      outputRange: [0, 1, 1],
      extrapolate: 'clamp',
    });

    const rotateY = door.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-78deg'],
    });

    return {
      opacity: doorOpacity,
      transform: [
        { perspective: 900 },
        { translateX: hingeXPx },
        { rotateY },
        { translateX: -hingeXPx },
      ],
    };
  }, [door, svgW]);

  useEffect(() => {
    const prev = lastPos.current;

    // If going to inside: go to SIDE then open door
    if (position === 'inside') {
      Animated.sequence([
        viewTo(1, 650),
        Animated.delay(80),
        doorTo(1, 750),
      ]).start();
      lastPos.current = position;
      return;
    }

    // If leaving inside: close door then go to target view
    if (prev === 'inside') {
      Animated.sequence([
        doorTo(0, 550),
        Animated.delay(60),
        viewTo(targetIndex, 700),
      ]).start();
      lastPos.current = position;
      return;
    }

    // Normal front/behind switching: ensure door closed + go to view
    Animated.parallel([
      doorTo(0, 450),
      viewTo(targetIndex, 700),
    ]).start();

    lastPos.current = position;
  }, [position, targetIndex]);

  return (
    <View style={styles.container}>
      <View style={styles.carContainer}>
        <Animated.View style={[styles.layer, layerStyle(0)]}>
          <CarFrontView />
        </Animated.View>

        <Animated.View style={[styles.layer, layerStyle(1)]}>
          <CarSideView />
        </Animated.View>

        {/* Door overlay only makes sense on SIDE */}
        <Animated.View pointerEvents="none" style={[styles.layer, doorStyle]}>
          <DoorOverlay svgW={svgW} svgH={svgH} />
        </Animated.View>

        <Animated.View style={[styles.layer, layerStyle(2)]}>
          <CarBackView />
        </Animated.View>
      </View>

      <View style={styles.positionIndicator}>
        <Text style={styles.positionEmoji}>{POSITION_INDICATORS[position].emoji}</Text>
        <Text style={styles.positionLabel}>{POSITION_INDICATORS[position].label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#F8FAFB',
    borderRadius: 15,
    marginVertical: 15,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  carContainer: {
    width: '100%',
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  layer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  positionIndicator: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    alignItems: 'center',
  },
  positionEmoji: { fontSize: 24, marginBottom: 4 },
  positionLabel: { fontSize: 12, fontWeight: 'bold', color: '#0D47A1' },
});