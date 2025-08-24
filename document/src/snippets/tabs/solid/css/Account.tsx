/** @jsxImportSource solid-js */
import { createSignal } from 'solid-js'

export default function Account() {
  const [name, setName] = createSignal('Elone Hoo')
  const [username, setUsername] = createSignal('@elonehoo')

  return (
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          Account
        </h3>
        <p class="card-description">
          Make changes to your account here. Click save when you're done.
        </p>
      </div>
      <div class="card-content">
        <div class="form-field">
          <label
            class="form-label"
            for="name"
          >
            Name
          </label>
          <input
            id="name"
            class="form-input"
            value={name()}
            onInput={e => setName(e.target.value)}
          />
        </div>
        <div class="form-field">
          <label
            class="form-label"
            for="username"
          >
            Username
          </label>
          <input
            id="username"
            class="form-input"
            value={username()}
            onInput={e => setUsername(e.target.value)}
          />
        </div>
      </div>
      <div class="card-footer">
        <button class="button-primary">
          Save Changes
        </button>
      </div>
    </div>
  )
}
