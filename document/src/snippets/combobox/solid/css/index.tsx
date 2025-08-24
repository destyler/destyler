/** @jsxImportSource solid-js */
import * as combobox from '@destyler/combobox';
import { normalizeProps, useMachine } from '@destyler/solid';
import { createSignal, createUniqueId, createMemo } from 'solid-js';
import { Portal } from 'solid-js/web';
import './index.css';

const comboboxData = [
  { label: 'Vue', code: 'vue' },
  { label: 'React', code: 'react' },
  { label: 'Svelte', code: 'svelte' },
  { label: 'Solid', code: 'solid' },
  { label: 'Nuxt', code: 'nuxt' },
  { label: 'Next', code: 'next' },
  { label: 'Svelte Kit', code: 'svelte-kit' },
];

export default function Combobox() {
  const [options, setOptions] = createSignal(comboboxData);
  const id = createUniqueId();

  const collection = combobox.collection({
    items: options(),
    itemToValue: item => item.code,
    itemToString: item => item.label,
  });

  const [state, send] = useMachine(
    combobox.machine({
      id,
      collection,
      onOpenChange: () => {
        setOptions(comboboxData);
      },
      onInputValueChange: ({ inputValue }) => {
        const filtered = comboboxData.filter(item =>
          item.label.toLowerCase().includes(inputValue.toLowerCase()),
        );
        setOptions(filtered.length > 0 ? filtered : comboboxData);
      },
      placeholder: 'Select a framework',
    }),
  );

  const api = createMemo(()=>combobox.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="combobox-root">
      <div {...api().getControlProps()} class="combobox-control">
        <input
          {...api().getInputProps()}
          class="combobox-input"
        />
        <button
          {...api().getTriggerProps()}
          class="combobox-trigger"
        >
          <div class="combobox-chevron" data-state={api().open ? 'open' : 'closed'}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </button>
      </div>
      {api().open && (
        <Portal mount={document.body}>
          <div
            {...api().getPositionerProps()}
            class="combobox-positioner"
          >
            {options().length > 0 && (
              <ul
                {...api().getContentProps()}
                class="combobox-content"
                data-state={api().open ? 'open' : 'closed'}
              >
                {options().map(item => (
                  <li
                    {...api().getItemProps({ item })}
                    class="combobox-item"
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Portal>
      )}
    </div>
  );
}
