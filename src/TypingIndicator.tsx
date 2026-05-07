import type { TypingIndicatorProps } from './TypingIndicator.types'
import './TypingIndicator.css'

const cls = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ')

/** akong TypingIndicator · Web · DOM `<button>` */
export function TypingIndicator(props: TypingIndicatorProps) {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    iconLeft,
    iconRight,
    children,
    onClick,
    onPress,
    type = 'button',
    ariaLabel,
  } = props

  const handle = () => {
    if (disabled || loading) return
    onClick?.()
    onPress?.()
  }

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handle}
      className={cls(
        'ak-typing-indicator',
        `ak-typing-indicator--${variant}`,
        `ak-typing-indicator--${size}`,
        fullWidth && 'ak-typing-indicator--full-width',
        loading && 'ak-typing-indicator--loading',
      )}
    >
      {iconLeft && <span className="ak-typing-indicator__icon">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="ak-typing-indicator__icon">{iconRight}</span>}
    </button>
  )
}

export default TypingIndicator
