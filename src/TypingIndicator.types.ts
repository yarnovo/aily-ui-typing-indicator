/**
 * akong TypingIndicator · 跨端 props 真源
 *
 * 用途: 打字 / 思考动画 · 表示 AI / 对方正在输入 · 跨端 (Web + RN)
 */

export type TypingIndicatorVariant = 'dots' | 'pulse' | 'wave'
export type TypingIndicatorSize = 'sm' | 'md' | 'lg'

export interface TypingIndicatorProps {
  /** 动画形态 · 默认 'dots' (依次跳动) */
  variant?: TypingIndicatorVariant
  /** 圆点尺寸 · sm=6px / md=8px / lg=10px · 默认 'md' */
  size?: TypingIndicatorSize
  /** 圆点颜色 · 默认 var(--ak-fg-tertiary) · CSS color string */
  color?: string
  /** 是否套气泡风格 (bg-subtle rounded-2xl padding-3) · 默认 true · 显示在 assistant 气泡位置 */
  inBubble?: boolean
  /** a11y 标签 · 默认 '正在输入' */
  ariaLabel?: string
}
