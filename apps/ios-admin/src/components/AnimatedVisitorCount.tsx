import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Text,
  type StyleProp,
  type TextStyle,
} from "react-native";

type AnimatedVisitorCountProps = {
  value: number | null;
  durationMs?: number;
  accessibilityLabel: string;
  style?: StyleProp<TextStyle>;
};

function formatCount(value: number): string {
  return Math.max(0, Math.round(value)).toLocaleString("en-GB");
}

export function AnimatedVisitorCount({
  value,
  durationMs = 550,
  accessibilityLabel,
  style,
}: AnimatedVisitorCountProps): JSX.Element {
  const initialValue = typeof value === "number" ? Math.max(0, Math.round(value)) : 0;
  const animated = useRef(new Animated.Value(initialValue)).current;
  const displayedRef = useRef<number | null>(typeof value === "number" ? initialValue : null);
  const latestTarget = useRef<number | null>(typeof value === "number" ? initialValue : null);
  const [displayed, setDisplayed] = useState<number | null>(typeof value === "number" ? initialValue : null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(enabled);
      })
      .catch(() => {
        if (mounted) setReduceMotion(false);
      });

    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const listenerId = animated.addListener(({ value: animatedValue }) => {
      const next = Math.max(0, Math.round(animatedValue));
      if (displayedRef.current !== next) {
        displayedRef.current = next;
        setDisplayed(next);
      }
    });

    return () => animated.removeListener(listenerId);
  }, [animated]);

  useEffect(() => {
    if (value === null) {
      latestTarget.current = null;
      displayedRef.current = null;
      animated.stopAnimation();
      setDisplayed(null);
      return;
    }

    const target = Math.max(0, Math.round(value));
    if (latestTarget.current === target && displayedRef.current !== null) return;

    if (displayedRef.current === null || reduceMotion) {
      latestTarget.current = target;
      displayedRef.current = target;
      animated.stopAnimation();
      animated.setValue(target);
      setDisplayed(target);
      return;
    }

    animated.stopAnimation((currentValue) => {
      const start = Number.isFinite(currentValue) ? currentValue : displayedRef.current ?? target;
      latestTarget.current = target;
      animated.setValue(start);
      Animated.timing(animated, {
        toValue: target,
        duration: durationMs,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (!finished) return;
        displayedRef.current = target;
        setDisplayed(target);
      });
    });
  }, [animated, durationMs, reduceMotion, value]);

  const accessibilityValue = value === null ? "not available" : formatCount(value);

  return (
    <Text
      accessible
      accessibilityLabel={`${accessibilityLabel}: ${accessibilityValue}`}
      className="text-lg font-extrabold"
      style={[{ fontVariant: ["tabular-nums"], minWidth: 34, textAlign: "right" }, style]}
      numberOfLines={1}
    >
      {displayed === null ? "-" : formatCount(displayed)}
    </Text>
  );
}
