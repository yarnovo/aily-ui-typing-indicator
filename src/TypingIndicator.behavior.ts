/**
 * 跨端行为契约 · Web + RN 都遵循
 *
 * TypingIndicator 是纯展示组件 · 没有交互回调
 * 行为契约聚焦"渲染结果一致":
 *  - 任何 variant / size / inBubble 组合都渲染 3 个圆点
 *  - aria-label 默认 '正在输入' · 自定义会覆盖
 *  - prefers-reduced-motion 自动关动画 (CSS / RN 各端实现)
 */

import type { TypingIndicatorVariant, TypingIndicatorSize } from './TypingIndicator.types'

export const DEFAULT_ARIA_LABEL = '正在输入'

/** 圆点尺寸 px · Web/RN 共用 */
export const dotSizePx: Record<TypingIndicatorSize, number> = {
  sm: 6,
  md: 8,
  lg: 10,
}

/** 圆点之间 gap px · Web/RN 共用 */
export const dotGapPx: Record<TypingIndicatorSize, number> = {
  sm: 3,
  md: 4,
  lg: 4,
}

/** 动画错峰 delay (秒) · 三个圆点 · dots/wave 共用 */
export const animationDelaySec = [0, 0.16, 0.32] as const

/** 动画周期 (秒) */
export const animationDurationSec = 1.4

export const allVariants: TypingIndicatorVariant[] = ['dots', 'pulse', 'wave']
export const allSizes: TypingIndicatorSize[] = ['sm', 'md', 'lg']
