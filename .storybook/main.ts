import { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../packages/components/**/.story/*.story.@(js|jsx|ts|tsx|mdx)'],
  framework: '@storybook/web-components-vite', // 👈 Add this
};

export default config;
