import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'
import './Profile.css'

const Profile = () => {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const endpoint = `/${user.role.toLowerCase()}/${user.userId}/profile`
      const response = await api.get(endpoint)
      setProfile(response.data)
      setFormData(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load profile')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = `/${user.role.toLowerCase()}/${user.userId}/profile`
      const response = await api.put(endpoint, formData)
      setProfile(response.data)
      setFormData(response.data)
      setIsEditing(false)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update profile')
      console.error(err)
    }
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
    setError('')
  }

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>
  }

  if (!profile) {
    return <div className="profile-error">Profile not found</div>
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {!isEditing && user.role !== 'ADMIN' && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="profile-card">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            {/* Common Fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="form-control disabled"
                />
              </div>
            </div>

            {user.role === 'PATIENT' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Date of Birth *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth || ''}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleChange}
                      required
                      className="form-control"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    rows="3"
                    className="form-control"
                  />
                </div>

                <div className="form-section-title">Emergency Contact</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact || ''}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone || ''}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </>
            )}

            {user.role === 'DOCTOR' && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Specialization *</label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization || ''}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>License Number</label>
                    <input
                      type="text"
                      value={formData.licenseNumber || ''}
                      disabled
                      className="form-control disabled"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Years of Experience</label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience || ''}
                      onChange={handleChange}
                      min="0"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Hospital Affiliation</label>
                  <input
                    type="text"
                    name="hospitalAffiliation"
                    value={formData.hospitalAffiliation || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="profile-section">
              <div className="profile-field">
                <label>Email</label>
                <div className="profile-value">{profile.email}</div>
              </div>
            </div>

            {user.role === 'PATIENT' && (
              <>
                <div className="profile-section">
                  <h3>Personal Information</h3>
                  <div className="profile-grid">
                    <div className="profile-field">
                      <label>First Name</label>
                      <div className="profile-value">{profile.firstName}</div>
                    </div>
                    <div className="profile-field">
                      <label>Last Name</label>
                      <div className="profile-value">{profile.lastName}</div>
                    </div>
                    <div className="profile-field">
                      <label>Date of Birth</label>
                      <div className="profile-value">{profile.dateOfBirth}</div>
                    </div>
                    <div className="profile-field">
                      <label>Gender</label>
                      <div className="profile-value">{profile.gender}</div>
                    </div>
                    <div className="profile-field">
                      <label>Phone</label>
                      <div className="profile-value">{profile.phone || 'Not provided'}</div>
                    </div>
                  </div>
                  <div className="profile-field">
                    <label>Address</label>
                    <div className="profile-value">{profile.address || 'Not provided'}</div>
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Emergency Contact</h3>
                  <div className="profile-grid">
                    <div className="profile-field">
                      <label>Contact Name</label>
                      <div className="profile-value">{profile.emergencyContact || 'Not provided'}</div>
                    </div>
                    <div className="profile-field">
                      <label>Contact Phone</label>
                      <div className="profile-value">{profile.emergencyPhone || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {user.role === 'DOCTOR' && (
              <>
                <div className="profile-section">
                  <h3>Personal Information</h3>
                  <div className="profile-grid">
                    <div className="profile-field">
                      <label>First Name</label>
                      <div className="profile-value">{profile.firstName}</div>
                    </div>
                    <div className="profile-field">
                      <label>Last Name</label>
                      <div className="profile-value">{profile.lastName}</div>
                    </div>
                    <div className="profile-field">
                      <label>Phone</label>
                      <div className="profile-value">{profile.phone || 'Not provided'}</div>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h3>Professional Information</h3>
                  <div className="profile-grid">
                    <div className="profile-field">
                      <label>Specialization</label>
                      <div className="profile-value">{profile.specialization}</div>
                    </div>
                    <div className="profile-field">
                      <label>License Number</label>
                      <div className="profile-value">{profile.licenseNumber}</div>
                    </div>
                    <div className="profile-field">
                      <label>Years of Experience</label>
                      <div className="profile-value">{profile.yearsOfExperience || 'Not provided'}</div>
                    </div>
                    <div className="profile-field">
                      <label>Hospital Affiliation</label>
                      <div className="profile-value">{profile.hospitalAffiliation || 'Not provided'}</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {user.role === 'ADMIN' && (
              <div className="profile-section">
                <h3>Account Information</h3>
                <div className="profile-field">
                  <label>Role</label>
                  <div className="profile-value">
                    <span className="role-badge">{profile.role}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
