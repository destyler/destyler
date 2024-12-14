import { html } from 'lit';
import { Meta } from '@storybook/web-components';
import '../src';

export default {
  title: 'Components/AspectRatio',
  component: 'AspectRatio',
  decorators: [
    (Story) => html`
      <div style="width: 200px; border: 1px solid #ccc; margin: auto;">
        ${Story()}
      </div>
    `,
  ],
} as Meta;

export const Default = () => html`
  <destyler-aspect-ratio ratio="${16 / 9}">
    <img style="width: 100%; height: 100%;" src="https://images.unsplash.com/photo-1535025183041-0991a977e25b" alt="Avatar" />
  </destyler-aspect-ratio>
`;

export const CustomRatio = () => html`
  <destyler-aspect-ratio ratio="${4 / 3}">
  <img style="width: 100%; height: 100%;" src="https://images.unsplash.com/photo-1535025183041-0991a977e25b" alt="Avatar" />
  </destyler-aspect-ratio>
`;

export const DynamicRatio = () => {
  let ratio = 16 / 9;

  const handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    ratio = parseFloat(input.value) || 1;
    const aspectRatioElement = document.getElementById(
      'dynamic-destyler-aspect-ratio'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;
    if (aspectRatioElement) {
      aspectRatioElement.ratio = ratio;
    }
  };

  return html`
    <label>
      Aspect Ratio:
      <input
        type="number"
        min="0.1"
        step="0.1"
        value="${ratio}"
        @input="${handleInput}"
      />
    </label>
    <destyler-aspect-ratio id="dynamic-destyler-aspect-ratio" .ratio="${ratio}">
    <img style="width: 100%; height: 100%;" src="https://images.unsplash.com/photo-1535025183041-0991a977e25b" alt="Avatar" />
    </destyler-aspect-ratio>
  `;
};
