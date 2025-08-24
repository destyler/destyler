export default function Password() {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Password</h3>
        <p className="card-description">
          Change your password here. After saving, you'll be logged out.
        </p>
      </div>
      <div className="card-content">
        <div className="form-field">
          <label
            className="form-label"
            htmlFor="current-password"
          >
            Current password
          </label>
          <input
            id="current-password"
            type="password"
            className="form-input"
          />
        </div>
        <div className="form-field">
          <label
            className="form-label"
            htmlFor="new-password"
          >
            New password
          </label>
          <input
            id="new-password"
            type="password"
            className="form-input"
          />
        </div>
      </div>
      <div className="card-footer">
        <button className="button-primary">Save Password</button>
      </div>
    </div>
  )
}
