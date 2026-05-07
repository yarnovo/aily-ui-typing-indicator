/**
 * Web 端组件测试 · vitest + @testing-library/react
 *
 * 6+ cases:
 * - 渲染 3 个圆点
 * - variant dots / pulse / wave class 反映
 * - size 反映 dot 大小 (CSS variable / class)
 * - color 反映 (inline CSS variable)
 * - inBubble 切换 bg (class on/off)
 * - aria-label 默认 / 自定义
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TypingIndicator } from '../src/TypingIndicator'
import { DEFAULT_ARIA_LABEL, allSizes, allVariants } from '../src/TypingIndicator.behavior'

describe('TypingIndicator (Web) · 渲染', () => {
  it('渲染 3 个圆点', () => {
    const { container } = render(<TypingIndicator />)
    const dots = container.querySelectorAll('.ak-typing-indicator__dot')
    expect(dots).toHaveLength(3)
  })

  it('根容器有 ak-typing-indicator class', () => {
    const { container } = render(<TypingIndicator />)
    expect(container.querySelector('.ak-typing-indicator')).toBeTruthy()
  })
})

describe('TypingIndicator (Web) · variant', () => {
  for (const v of allVariants) {
    it(`variant=${v} 加 ak-typing-indicator--${v} class`, () => {
      const { container } = render(<TypingIndicator variant={v} />)
      expect(container.querySelector(`.ak-typing-indicator--${v}`)).toBeTruthy()
    })
  }

  it('default variant = dots', () => {
    const { container } = render(<TypingIndicator />)
    expect(container.querySelector('.ak-typing-indicator--dots')).toBeTruthy()
  })

  it('切 variant 不影响圆点数量 (始终 3 个)', () => {
    for (const v of allVariants) {
      const { container, unmount } = render(<TypingIndicator variant={v} />)
      expect(container.querySelectorAll('.ak-typing-indicator__dot')).toHaveLength(3)
      unmount()
    }
  })
})

describe('TypingIndicator (Web) · size', () => {
  for (const s of allSizes) {
    it(`size=${s} 加 ak-typing-indicator--${s} class`, () => {
      const { container } = render(<TypingIndicator size={s} />)
      expect(container.querySelector(`.ak-typing-indicator--${s}`)).toBeTruthy()
    })
  }

  it('default size = md', () => {
    const { container } = render(<TypingIndicator />)
    expect(container.querySelector('.ak-typing-indicator--md')).toBeTruthy()
  })
})

describe('TypingIndicator (Web) · color', () => {
  it('未传 color · 不注入 inline style', () => {
    const { container } = render(<TypingIndicator />)
    const root = container.querySelector('.ak-typing-indicator') as HTMLElement
    // jsdom: 未注入时 cssText 为空
    expect(root.style.getPropertyValue('--ak-typing-indicator-color')).toBe('')
  })

  it('传 color · 通过 CSS variable 注入', () => {
    const { container } = render(<TypingIndicator color="#ff0066" />)
    const root = container.querySelector('.ak-typing-indicator') as HTMLElement
    expect(root.style.getPropertyValue('--ak-typing-indicator-color')).toBe('#ff0066')
  })
})

describe('TypingIndicator (Web) · inBubble', () => {
  it('default inBubble=true · 加 in-bubble class', () => {
    const { container } = render(<TypingIndicator />)
    expect(container.querySelector('.ak-typing-indicator--in-bubble')).toBeTruthy()
  })

  it('inBubble=false · 不加 in-bubble class', () => {
    const { container } = render(<TypingIndicator inBubble={false} />)
    expect(container.querySelector('.ak-typing-indicator--in-bubble')).toBeFalsy()
  })
})

describe('TypingIndicator (Web) · a11y', () => {
  it(`默认 aria-label = ${DEFAULT_ARIA_LABEL}`, () => {
    render(<TypingIndicator />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', DEFAULT_ARIA_LABEL)
  })

  it('自定义 aria-label 覆盖默认', () => {
    render(<TypingIndicator ariaLabel="AI 思考中" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'AI 思考中')
  })

  it('aria-live=polite (动态通知不打断)', () => {
    render(<TypingIndicator />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('圆点 aria-hidden · 不污染 a11y tree', () => {
    const { container } = render(<TypingIndicator />)
    const dots = container.querySelectorAll('.ak-typing-indicator__dot')
    dots.forEach((d) => expect(d).toHaveAttribute('aria-hidden', 'true'))
  })
})
