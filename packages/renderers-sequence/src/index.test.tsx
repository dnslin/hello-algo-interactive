import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  createInitialSequenceState,
  SequenceRenderer,
  type SequenceSceneState,
} from './index.js';

describe('Renderers Sequence - Initial State', () => {
  it('creates initial sequence elements with stable entity IDs', () => {
    const raw = [5, 1, 4, 2, 8];
    const state = createInitialSequenceState(raw);

    expect(state.elements).toHaveLength(5);
    expect(state.elements[0]).toEqual({
      id: 'e_0',
      value: 5,
      state: 'idle',
      index: 0,
    });
    expect(state.elements[4]).toEqual({
      id: 'e_4',
      value: 8,
      state: 'idle',
      index: 4,
    });
    expect(state.pointers).toEqual([]);
    expect(state.sortedIndices).toEqual([]);
  });

  it('handles empty input arrays', () => {
    const state = createInitialSequenceState([]);
    expect(state.elements).toEqual([]);
    expect(state.pointers).toEqual([]);
  });
});

describe('Renderers Sequence - SequenceRenderer Component', () => {
  it('renders elements with values, entity IDs, and index markers', () => {
    const state = createInitialSequenceState([4, 1, 3]);
    render(<SequenceRenderer state={state} />);

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('#0')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('[0]')).toBeInTheDocument();
    expect(screen.getByText('[1]')).toBeInTheDocument();
    expect(screen.getByText('[2]')).toBeInTheDocument();
  });

  it('renders pointers and highlights comparing elements', () => {
    const state: SequenceSceneState<number> = {
      elements: [
        { id: 'e_0', value: 4, state: 'comparing', index: 0 },
        { id: 'e_1', value: 1, state: 'comparing', index: 1 },
        { id: 'e_2', value: 5, state: 'sorted', index: 2 },
      ],
      pointers: [
        { name: 'i', index: 0, label: 'i=0' },
        { name: 'j', index: 1, label: 'j=1' },
      ],
      sortedIndices: [2],
    };

    render(<SequenceRenderer state={state} speed={2} />);

    expect(screen.getByText('i=0')).toBeInTheDocument();
    expect(screen.getByText('j=1')).toBeInTheDocument();
    expect(screen.getByText('就位')).toBeInTheDocument();
    expect(screen.getAllByText('比较').length).toBeGreaterThanOrEqual(2);
  });

  it('fires onElementClick when element is clicked', () => {
    const state = createInitialSequenceState([10, 20]);
    const handleClick = vi.fn();
    render(<SequenceRenderer state={state} onElementClick={handleClick} />);

    fireEvent.click(screen.getByText('10'));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'e_0', value: 10 }),
      0
    );
  });
});
