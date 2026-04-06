import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import './index.css'
const API = import.meta.env.VITE_API_URL;

const SignupForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  // ✅ validation helpers
  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password)   // check for at least 1 number
    return password.length >= 5 && hasNumber
  }

  const validateEmail = (email) => {
    return email.endsWith('@gmail.com')
  }

  const submitForm = async (e) => {
    e.preventDefault()

    // ✅ frontend validations
    if (!validateEmail(email)) {
      setErrorMsg("Email must end with @gmail.com")
      return
    }

    if (!validatePassword(password)) {
      setErrorMsg("Password must be at least 5 characters and contain at least 1 number")
      return
    }

    try {
      await axios.post(`${API}/api/auth/signup`, {
        username,
        password,
        email
      })

      // after signup, redirect to login
      navigate('/login')
    } catch (error) {
      console.error(error)
      setErrorMsg("Signup failed")
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submitForm}>
        <h1 className="brand-name">Zyra</h1>
        <h2 className="login-heading">Create Account</h2>

        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && <p className="error">{errorMsg}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignupForm
