import type { CSSProperties } from 'react'
import type { TypingIndicatorProps } from './TypingIndicator.types'
import { DEFAULT_ARIA_LABEL } from './TypingIndicator.behavior'
import './TypingIndicator.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong TypingIndicator · Web · 3 圆点动画 (dots / pulse / wave) */
export function TypingIndicator(props: TypingIndicatorProps) {
  const {
    variant = 'dots',
    size = 'md',
    color,
    inBubble = true,
    ariaLabel = DEFAULT_ARIA_LABEL,
  } = props

  const dotStyle = color ? ({ '--ak-typing-indicator-color': color } as CSSProperties) : undefined

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      className={cls(
        'ak-typing-indicator',
        `ak-typing-indicator--${variant}`,
        `ak-typing-indicator--${size}`,
        inBubble && 'ak-typing-indicator--in-bubble',
      )}
      style={dotStyle}
    >
      <span className="ak-typing-indicator__dot" aria-hidden="true" />
      <span className="ak-typing-indicator__dot" aria-hidden="true" />
      <span className="ak-typing-indicator__dot" aria-hidden="true" />
    </div>
  )
}

export default TypingIndicator
