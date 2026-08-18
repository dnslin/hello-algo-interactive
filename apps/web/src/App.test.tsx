import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App.js';

describe('Web Application Shell', () => {
  it('renders the brand title and welcome banner', () => {
    render(<App />);
    expect(screen.getByText('Hello Algo Interactive')).toBeDefined();
    expect(
      screen.getByText(/基于《Hello 算法》的交互式演示平台/)
    ).toBeDefined();
  });

  it('renders design token states and benchmark algorithms', () => {
    render(<App />);
    expect(screen.getByText('OKLCH 算法状态语义色盘 (Design Tokens)')).toBeDefined();
    expect(screen.getByText('冒泡排序 (Bubble Sort)')).toBeDefined();
    expect(screen.getByText('广度优先遍历 (BFS)')).toBeDefined();
    expect(screen.getByText('N 皇后问题 (N-Queens)')).toBeDefined();
  });

  it('toggles theme between light and dark modes', () => {
    render(<App />);
    const toggleButton = screen.getByRole('button', { name: /Toggle Theme/i });
    expect(toggleButton.textContent).toContain('深色模式');

    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(toggleButton.textContent).toContain('浅色模式');

    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(toggleButton.textContent).toContain('深色模式');
  });
});
