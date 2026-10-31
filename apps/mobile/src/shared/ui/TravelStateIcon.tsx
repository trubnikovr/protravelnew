import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PlaneTakeoff } from 'lucide-react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { theme } from '../theme/theme';

export function TravelStateIcon() {
  return (
    <View accessibilityElementsHidden style={styles.container}>
      <Svg
        height={theme.sizes.homeStateIcon}
        viewBox="0 0 64 64"
        width={theme.sizes.homeStateIcon}
      >
        <Defs>
          <LinearGradient
            id="travelStateGradient"
            x1="8"
            x2="56"
            y1="8"
            y2="56"
          >
            <Stop offset="0" stopColor={theme.colors.primaryMuted} />
            <Stop offset="1" stopColor={theme.colors.primaryDark} />
          </LinearGradient>
        </Defs>
        <Circle cx="32" cy="32" fill="url(#travelStateGradient)" r="30" />
        <Path
          d="M13 43 C22 51 42 50 52 37"
          fill="none"
          opacity={0.48}
          stroke={theme.colors.white}
          strokeDasharray="3 4"
          strokeLinecap="round"
          strokeWidth={1.5}
        />
      </Svg>
      <PlaneTakeoff
        color={theme.colors.white}
        size={28}
        strokeWidth={2}
        style={styles.plane}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: theme.sizes.homeStateIcon,
    width: theme.sizes.homeStateIcon,
    ...theme.shadows.floating,
  },
  plane: {
    left: 18,
    position: 'absolute',
    top: 17,
  },
});
