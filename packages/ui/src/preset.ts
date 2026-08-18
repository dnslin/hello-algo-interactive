import type { Config } from 'tailwindcss';

export const helloAlgoTailwindPreset: Partial<Config> = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        viz: {
          idle: {
            DEFAULT: 'var(--viz-idle)',
            fg: 'var(--viz-idle-fg)',
            border: 'var(--viz-idle-border)',
          },
          comparing: {
            DEFAULT: 'var(--viz-comparing)',
            fg: 'var(--viz-comparing-fg)',
            border: 'var(--viz-comparing-border)',
          },
          active: {
            DEFAULT: 'var(--viz-active)',
            fg: 'var(--viz-active-fg)',
            border: 'var(--viz-active-border)',
          },
          selected: {
            DEFAULT: 'var(--viz-selected)',
            fg: 'var(--viz-selected-fg)',
            border: 'var(--viz-selected-border)',
          },
          visited: {
            DEFAULT: 'var(--viz-visited)',
            fg: 'var(--viz-visited-fg)',
            border: 'var(--viz-visited-border)',
          },
          sorted: {
            DEFAULT: 'var(--viz-sorted)',
            fg: 'var(--viz-sorted-fg)',
            border: 'var(--viz-sorted-border)',
          },
          conflict: {
            DEFAULT: 'var(--viz-conflict)',
            fg: 'var(--viz-conflict-fg)',
            border: 'var(--viz-conflict-border)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionDuration: {
        focus: '180ms',
        compare: '240ms',
        move: '420ms',
        structural: '560ms',
        fade: '150ms',
      },
      transitionTimingFunction: {
        focus: 'cubic-bezier(0.2, 0, 0, 1)',
        compare: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        move: 'cubic-bezier(0.4, 0, 0.2, 1)',
        structural: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fade: 'linear',
      },
    },
  },
};

export default helloAlgoTailwindPreset;
