import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import './Register.css'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    specialization: '',
    licenseNumber: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    
    try {
      const endpoint = formData.role === 'PATIENT' 
        ? '/auth/patient/register' 
        : '/auth/doctor/register'
      
      // Split name into firstName and lastName for backend
      const nameParts = formData.name.trim().split(' ')
      const requestData = {
        ...formData,
        firstName: nameParts[0],
        lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0],
        phone: formData.phoneNumber
      }
      delete requestData.name
      delete requestData.phoneNumber
      
      await api.post(endpoint, requestData)
      setSuccess(true)
      // Optionally navigate to login after a delay
      setTimeout(() => navigate('/login'), 5000)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="register-container">
      <div className="register-card card">
        <h1>🏥 Create Account</h1>
        <h2>Health Atlas Registration</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="role-selector">
            <label>
              <input
                type="radio"
                name="role"
                value="PATIENT"
                checked={formData.role === 'PATIENT'}
                onChange={handleChange}
              />
              Patient
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="DOCTOR"
                checked={formData.role === 'DOCTOR'}
                onChange={handleChange}
              />
              Doctor
            </label>
          </div>
          
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          
          {formData.role === 'PATIENT' && (
            <>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select...</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </>
          )}
          
          {formData.role === 'DOCTOR' && (
            <>
              <div className="form-group">
                <label>Specialization *</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required={formData.role === 'DOCTOR'}
                />
              </div>
              
              <div className="form-group">
                <label>License Number *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required={formData.role === 'DOCTOR'}
                />
              </div>
            </>
          )}
          
          {error && <div className="error-message">{error}</div>}
          
          {success && (
            <div className="success-message">
              <h3>✅ Registration Successful!</h3>
              <p>Your account has been created and is <strong>pending admin approval</strong>.</p>
              <p>You will be able to log in once an administrator approves your registration.</p>
              <p className="redirect-notice">Redirecting to login page in 5 seconds...</p>
            </div>
          )}
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading || success}>
            {loading ? 'Creating Account...' : success ? 'Registration Complete' : 'Register'}
          </button>
        </form>
        
        <div className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  )
}
