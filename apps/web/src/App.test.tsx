import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App.js';

describe('Web Application Shell & Bubble Sort Tracer-Bullet', () => {
  it('renders the brand title and welcome banner', () => {
    render(<App />);
    expect(screen.getByText('Hello Algo Interactive')).toBeInTheDocument();
    expect(
      screen.getByText(/基于《Hello 算法》的交互式演示平台/)
    ).toBeInTheDocument();
  });

  it('renders the interactive Bubble Sort tracer-bullet visualizer by default', () => {
    render(<App />);
    expect(screen.getByText('冒泡排序')).toBeInTheDocument();
    expect(screen.getByText('P0 Tracer-Bullet')).toBeInTheDocument();
    expect(screen.getByText('可视化动画视口 (Sequence Scene)')).toBeInTheDocument();
    expect(screen.getByText('执行讲解 (Narration)')).toBeInTheDocument();
    expect(screen.getByText('实时变量观察 (State & Variables)')).toBeInTheDocument();

    // Verify initial elements with stable entity IDs #0, #1, #2, #3, #4, #5
    expect(screen.getAllByText('#0').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('#1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('#2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('#3').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('#4').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('#5').length).toBeGreaterThanOrEqual(1);
  });

  it('supports playback stepping, reset, and speed changes', () => {
    render(<App />);
    const stepForwardBtn = screen.getByTitle(/单步前进/i);
    const resetBtn = screen.getByTitle(/重置到第一步/i);

    // Initial step: Step 1
    expect(screen.getByText(/步数: 1 \//i)).toBeInTheDocument();

    // Step forward
    fireEvent.click(stepForwardBtn);
    expect(screen.getByText(/步数: 2 \//i)).toBeInTheDocument();

    fireEvent.click(stepForwardBtn);
    expect(screen.getByText(/步数: 3 \//i)).toBeInTheDocument();

    // Reset back to Step 1
    fireEvent.click(resetBtn);
    expect(screen.getByText(/步数: 1 \//i)).toBeInTheDocument();
  });

  it('supports code panel language tab switching', () => {
    render(<App />);
    const pyTab = screen.getByText('Python');
    const goTab = screen.getByText('Go');
    const tsTab = screen.getByText('TypeScript');

    expect(tsTab).toBeInTheDocument();
    expect(pyTab).toBeInTheDocument();
    expect(goTab).toBeInTheDocument();

    fireEvent.click(pyTab);
    expect(screen.getByText(/def bubble_sort/)).toBeInTheDocument();

    fireEvent.click(goTab);
    expect(screen.getByText(/func bubbleSort/)).toBeInTheDocument();

    fireEvent.click(tsTab);
    expect(screen.getByText(/function bubbleSort/)).toBeInTheDocument();
  });

  it('switches between interactive demo tab and design system overview tab', () => {
    render(<App />);
    const overviewTab = screen.getByText('设计系统与架构规范');
    fireEvent.click(overviewTab);

    expect(
      screen.getByText('OKLCH 算法状态语义色盘 (Design Tokens)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Motion 运动规范 (Motion Tokens)')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Monorepo 核心包架构')
    ).toBeInTheDocument();

    const demoTab = screen.getByText('冒泡排序交互演示 (Tracer-Bullet)');
    fireEvent.click(demoTab);
    expect(screen.getByText('可视化动画视口 (Sequence Scene)')).toBeInTheDocument();
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
