import { html } from 'lit';
import { Meta } from '@storybook/web-components';
import '../src';

function UnoTemplate(){
  return html`
  <style>
    @unocss-placeholder
  </style>
  `
}

export default {
  title: 'Components/AspectRatio',
  component: 'AspectRatio',
  decorators: [
    (Story) => html`
      ${UnoTemplate()}
      <div class="w-200px border border-solid border-[#ccc] m-auto">
        ${Story()}
      </div>
    `,
  ],
} as Meta;

export const Default = () => html`
  <destyler-aspect-ratio ratio="${16 / 9}">
    <img class="w-full h-full" src="https://images.unsplash.com/photo-1535025183041-0991a977e25b" alt="Avatar" />
  </destyler-aspect-ratio>
`;

export const CustomRatio = () => html`
  <destyler-aspect-ratio ratio="${4 / 3}">
  <img class="w-full h-full" src="https://images.unsplash.com/photo-1535025183041-0991a977e25b" alt="Avatar" />
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
    <img class="w-full h-full" src="https://images.unsplash.com/photo-1535025183041-0991a977e25b" alt="Avatar" />
    </destyler-aspect-ratio>
  `;
};
