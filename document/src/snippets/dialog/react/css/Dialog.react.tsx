import * as dialog from '@destyler/dialog';
import { normalizeProps, useMachine } from '@destyler/react';
import { useId } from 'react';
import { createPortal } from 'react-dom';
import './Dialog.css';

export default function Dialog() {
  const [state, send] = useMachine(dialog.machine({ id: useId() }));
  const api = dialog.connect(state, send, normalizeProps);
  return (
    <>
      <button {...api.getTriggerProps()} className="dialog-trigger">Open Dialog</button>
      {api.open &&
        createPortal(
          <div>
            <div {...api.getBackdropProps()} className="dialog-backdrop" />
            <div {...api.getPositionerProps()} className="dialog-positioner">
              <div {...api.getContentProps()} className="dialog-content">
                <h2 {...api.getTitleProps()} className="dialog-title">Edit profile</h2>
                <p {...api.getDescriptionProps()} className="dialog-description">
                  Make changes to your profile here. Click save when you are done.
                </p>
                <button {...api.getCloseTriggerProps()} className="dialog-close-trigger">
                  <div className="i-carbon:close-large" />
                </button>
                <input placeholder="Enter name..." className="dialog-input" />
                <button className="dialog-action">Save Changes</button>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
}
