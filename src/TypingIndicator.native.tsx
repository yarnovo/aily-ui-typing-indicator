/**
 * akong TypingIndicator · React Native 实现
 *
 * Metro bundler 默认按 `.native.tsx` 后缀解析 RN 端 · `.tsx` 解析 Web 端
 * 用方 `import { TypingIndicator } from '@aily-ui/typing-indicator'` 自动取对应平台
 *
 * 实现策略:
 *  - View 容器 · 3 Animated.View 圆点
 *  - dots: translateY 跳动 · 错峰 delay 0 / 160 / 320 ms
 *  - pulse: 同时 opacity 0.4 ↔ 1
 *  - wave: scale 0.8 ↔ 1.2 错峰
 *  - prefers-reduced-motion: AccessibilityInfo.isReduceMotionEnabled · 关 loop
 */

import { useEffect, useRef, useState } from 'react'
import { Animated, AccessibilityInfo, Easing, View, useColorScheme } from 'react-native'
import { tokens } from '@aily-ui/tokens'
import type { TypingIndicatorProps, TypingIndicatorSize } from './TypingIndicator.types'
import {
  DEFAULT_ARIA_LABEL,
  animationDelaySec,
  animationDurationSec,
  dotGapPx,
  dotSizePx,
} from './TypingIndicator.behavior'

const DURATION_MS = animationDurationSec * 1000
const HALF_MS = DURATION_MS / 2

function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    let cancelled = false
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (!cancelled) setReduce(!!v)
    })
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => setReduce(!!v))
    return () => {
      cancelled = true
      sub?.remove?.()
    }
  }, [])
  return reduce
}

function useDotAnim(
  variant: NonNullable<TypingIndicatorProps['variant']>,
  index: number,
  reduce: boolean,
): Animated.Value {
  const value = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (reduce) {
      value.setValue(0)
      return
    }

    // pulse 不错峰 · dots/wave 错峰
    const delay = variant === 'pulse' ? 0 : animationDelaySec[index] * 1000

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: HALF_MS,
          delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: HALF_MS,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => {
      loop.stop()
    }
  }, [variant, index, reduce, value])

  return value
}

function dotAnimatedStyle(
  variant: NonNullable<TypingIndicatorProps['variant']>,
  v: Animated.Value,
) {
  if (variant === 'dots') {
    return {
      transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
    } as const
  }
  if (variant === 'pulse') {
    return {
      opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
    } as const
  }
  // wave
  return {
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }],
  } as const
}

function bubbleStyles(scheme: 'light' | 'dark') {
  const t = scheme === 'dark' ? tokens.dark : tokens.light
  return {
    backgroundColor: t.bgSubtle,
    borderRadius: tokens.radius['2xl'] ?? 16,
    padding: 12,
  }
}

function defaultColor(scheme: 'light' | 'dark'): string {
  const t = scheme === 'dark' ? tokens.dark : tokens.light
  // tokens 没有显式 fgTertiary · 用 fgSubtle 接近 (灰 9 系)
  return t.fgSubtle as string
}

function Dot(props: {
  variant: NonNullable<TypingIndicatorProps['variant']>
  index: number
  size: TypingIndicatorSize
  color: string
  reduce: boolean
}) {
  const { variant, index, size, color, reduce } = props
  const v = useDotAnim(variant, index, reduce)
  const dim = dotSizePx[size]
  const animStyle = dotAnimatedStyle(variant, v)
  return (
    <Animated.View
      style={[
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: color,
        },
        // RN 类型严格 · transform 与 opacity 各占一份 · 这里 spread 直接接受
        animStyle as object,
      ]}
    />
  )
}

export function TypingIndicator(props: TypingIndicatorProps) {
  const {
    variant = 'dots',
    size = 'md',
    color,
    inBubble = true,
    ariaLabel = DEFAULT_ARIA_LABEL,
  } = props

  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark'
  const reduce = useReduceMotion()
  const dotColor = color ?? defaultColor(scheme)
  const gap = dotGapPx[size]

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={ariaLabel}
      accessibilityLiveRegion="polite"
      style={[
        {
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          alignSelf: 'flex-start' as const,
          gap,
        },
        inBubble && bubbleStyles(scheme),
      ]}
    >
      <Dot variant={variant} index={0} size={size} color={dotColor} reduce={reduce} />
      <Dot variant={variant} index={1} size={size} color={dotColor} reduce={reduce} />
      <Dot variant={variant} index={2} size={size} color={dotColor} reduce={reduce} />
    </View>
  )
}

export default TypingIndicator
