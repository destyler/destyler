/** @jsxImportSource solid-js */

export default function Password() {
  return (
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">
          Password
        </h3>
        <p class="card-description">
          Change your password here. After saving, you'll be logged out.
        </p>
      </div>
      <div class="card-content">
        <div class="form-field">
          <label
            class="form-label"
            for="current-password"
          >
            Current password
          </label>
          <input
            id="current-password"
            type="password"
            class="form-input"
          />
        </div>
        <div class="form-field">
          <label
            class="form-label"
            for="new-password"
          >
            New password
          </label>
          <input
            id="new-password"
            type="password"
            class="form-input"
          />
        </div>
      </div>
      <div class="card-footer">
        <button class="button-primary">
          Save Password
        </button>
      </div>
    </div>
  )
}
