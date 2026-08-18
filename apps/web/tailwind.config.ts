import type { Config } from 'tailwindcss';
import { helloAlgoTailwindPreset } from '@hello-algo/ui/preset';

const config: Config = {
  presets: [helloAlgoTailwindPreset],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
