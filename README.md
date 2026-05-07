# @akong/typing-indicator

akong TypingIndicator · 极简 · 跨端 (Web + React Native)

打字 / 思考动画 · 表示 AI / 对方正在输入 · 跨端一致。

## Demo

[GitHub Pages 演示](https://yarnovo.github.io/akong-typing-indicator/)

## 安装

```bash
npm i github:yarnovo/akong-typing-indicator github:yarnovo/akong-tokens
```

## Web

```tsx
import { TypingIndicator } from '@akong/typing-indicator'
import '@akong/typing-indicator/style.css'
import '@akong/tokens/style.css'  // 顶层引一次 token (整个 app 共用)

// 默认 (dots / md / inBubble) · 直接放 assistant 气泡位置
<TypingIndicator />

// 不同动画形态
<TypingIndicator variant="pulse" />
<TypingIndicator variant="wave" size="lg" />

// 自定义颜色
<TypingIndicator color="var(--ak-accent)" />

// 不要气泡 (裸圆点 · 嵌进别处)
<TypingIndicator inBubble={false} size="sm" />

// 自定义 a11y label
<TypingIndicator ariaLabel="AI 思考中" />
```

## React Native

```tsx
import { TypingIndicator } from '@akong/typing-indicator'

<TypingIndicator variant="dots" size="md" />
```

Metro bundler 自动按 `.native.tsx` 后缀解析 · 同 `import` 路径两端通用。

## API

| Prop | Type | Default | 说明 |
|---|---|---|---|
| variant | `dots` / `pulse` / `wave` | `dots` | 动画形态 |
| size | `sm` / `md` / `lg` | `md` | 圆点直径 6 / 8 / 10 px |
| color | string | `var(--ak-fg-tertiary)` | 圆点颜色 (CSS color) |
| inBubble | boolean | `true` | 套气泡风格 (bg-subtle · radius 2xl · padding 12) |
| ariaLabel | string | `'正在输入'` | a11y |

## variant

- **dots** — 3 圆点依次跳动 (translateY -4px · 错峰 0 / 0.16 / 0.32s · 周期 1.4s)
- **pulse** — 3 圆点同时呼吸 (opacity 0.4 ↔ 1 · 周期 1.4s)
- **wave** — 3 圆点 scale 0.8 ↔ 1.2 错峰 (类似 dots 但纵向 scale)

所有 variant 周期固定 1.4s ease-in-out infinite · 圆点 gap 3-4 px。

## 设计原则

- **一份 props**：Web 跟 RN 共享 `TypingIndicator.types.ts`
- **两端实现**：`TypingIndicator.tsx` (Web · CSS keyframes) + `TypingIndicator.native.tsx` (RN · Animated API)
- **a11y 默认对**：role=status · aria-live=polite · aria-label 默认 '正在输入'
- **prefers-reduced-motion 自动关动画**：Web 用 CSS media query · RN 用 `AccessibilityInfo.isReduceMotionEnabled`
- **token 100% 接 @akong/tokens**：改一处 token 自动 update
