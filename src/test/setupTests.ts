import '@testing-library/jest-dom'
import { vi } from 'vitest'

Object.defineProperty(window, 'alert', {
  writable: true,
  value: vi.fn(),
})

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: vi.fn(() => ({})),
})
