import { useState } from 'react'

export default function Account() {
  const [name, setName] = useState('Elone Hoo')
  const [username, setUsername] = useState('@elonehoo')

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          Account
        </h3>
        <p className="card-description">
          Make changes to your account here. Click save when you're done.
        </p>
      </div>
      <div className="card-content">
        <div className="form-field">
          <label
            className="form-label"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            className="form-input"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label
            className="form-label"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            className="form-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
      </div>
      <div className="card-footer">
        <button className="button-primary">
          Save Changes
        </button>
      </div>
    </div>
  )
}
