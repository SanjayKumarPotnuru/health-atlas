import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'
import './Dashboard.css'

export default function AdminDashboard() {
  const { user, logout } = useAuthStore()
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [records, setRecords] = useState([])
  const [consents, setConsents] = useState([])
  const [pendingApprovals, setPendingApprovals] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDetails, setSelectedDetails] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const navigate = useNavigate()

  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsRes, usersRes, patientsRes, doctorsRes, recordsRes, consentsRes, pendingRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/users'),
        api.get('/admin/patients'),
        api.get('/admin/doctors'),
        api.get('/admin/medical-records'),
        api.get('/admin/consents'),
        api.get('/admin/pending-approvals')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
      setPatients(patientsRes.data)
      setDoctors(doctorsRes.data)
      setRecords(recordsRes.data)
      setConsents(consentsRes.data)
      setPendingApprovals(pendingRes.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [fetchDashboardData])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleUserActive = async (userId) => {
    try {
      await api.put(`/admin/user/${userId}/toggle-active`)
      fetchDashboardData()
      alert('User status updated successfully!')
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('Failed to update user status')
    }
  }

  const viewPatientDetails = async (patientId) => {
    try {
      const response = await api.get(`/admin/patient/${patientId}/details`)
      setSelectedDetails({ type: 'PATIENT', data: response.data })
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Error fetching patient details:', error)
      alert('Failed to load patient details')
    }
  }

  const viewDoctorDetails = async (doctorId) => {
    try {
      const response = await api.get(`/admin/doctor/${doctorId}/details`)
      setSelectedDetails({ type: 'DOCTOR', data: response.data })
      setShowDetailsModal(true)
    } catch (error) {
      console.error('Error fetching doctor details:', error)
      alert('Failed to load doctor details')
    }
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedDetails(null)
  }

  const approveUser = async (userId) => {
    if (!confirm('Are you sure you want to approve this user?')) return
    
    try {
      await api.put(`/admin/approve-user/${userId}`)
      fetchDashboardData()
      alert('User approved successfully!')
    } catch (error) {
      console.error('Error approving user:', error)
      alert(error.response?.data?.message || 'Failed to approve user')
    }
  }

  const rejectUser = async (userId) => {
    if (!confirm('Are you sure you want to reject this user? This will permanently delete their registration.')) return
    
    try {
      await api.delete(`/admin/reject-user/${userId}`)
      fetchDashboardData()
      alert('User registration rejected and deleted')
    } catch (error) {
      console.error('Error rejecting user:', error)
      alert(error.response?.data?.message || 'Failed to reject user')
    }
  }

  const grantConsentAccess = async (consentId) => {
    if (!confirm('Are you sure you want to grant this consent on behalf of the patient?')) return
    
    try {
      await api.put(`/admin/consent/${consentId}/approve`)
      fetchDashboardData()
      alert('Consent granted successfully!')
    } catch (error) {
      console.error('Error granting consent:', error)
      alert(error.response?.data?.message || 'Failed to grant consent')
    }
  }

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🔐 Admin Dashboard</h1>
        <div className="user-info">
          <button onClick={fetchDashboardData} className="btn btn-secondary" style={{fontSize: '0.85rem', padding: '6px 12px'}}>🔄 Refresh</button>
          <span>👤 Admin</span>
          <button onClick={() => navigate('/profile')} className="btn btn-link">👤 Profile</button>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Approvals ({pendingApprovals.length})
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({stats.totalUsers})
        </button>
        <button 
          className={`tab ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          📋 Medical Records ({stats.totalRecords})
        </button>
        <button 
          className={`tab ${activeTab === 'consents' ? 'active' : ''}`}
          onClick={() => setActiveTab('consents')}
        >
          🔐 Consents ({stats.totalConsents})
        </button>
      </div>

      <div className="dashboard-content container">
        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">🏥</div>
                <div className="stat-info">
                  <h3>{stats.totalPatients}</h3>
                  <p>Patients</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">👨‍⚕️</div>
                <div className="stat-info">
                  <h3>{stats.totalDoctors}</h3>
                  <p>Doctors</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.activeUsers}</h3>
                  <p>Active Users</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{pendingApprovals.length}</h3>
                  <p>Pending Approvals</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>{stats.totalRecords}</h3>
                  <p>Medical Records</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">🔴</div>
                <div className="stat-info">
                  <h3>{stats.activeRecords}</h3>
                  <p>Under Treatment</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">🔐</div>
                <div className="stat-info">
                  <h3>{stats.totalConsents}</h3>
                  <p>Total Consents</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{stats.pendingConsents}</h3>
                  <p>Pending Consents</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.approvedConsents}</h3>
                  <p>Approved Consents</p>
                </div>
              </div>
            </div>

            {stats.pendingConsents > 0 && (
              <div className="section">
                <h2>⏳ Pending Consent Requests ({stats.pendingConsents})</h2>
                <div className="consent-list">
                  {consents.filter(c => c.status === 'PENDING').slice(0, 3).map((consent) => (
                    <div key={consent.id} className="consent-card card pending">
                      <div className="consent-header">
                        <div className="doctor-info">
                          <h3>👨‍⚕️ Dr. {consent.doctor?.firstName} {consent.doctor?.lastName}</h3>
                          <p className="specialization">{consent.doctor?.specialization}</p>
                          <p style={{marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                            → Patient: {consent.patientName}
                          </p>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end'}}>
                          <span className="status-badge pending">⏳ Awaiting Patient Approval</span>
                          <button 
                            onClick={() => grantConsentAccess(consent.id)}
                            className="btn btn-primary"
                            style={{fontSize: '0.85rem', padding: '8px 16px'}}
                          >
                            ✓ Grant Access
                          </button>
                        </div>
                      </div>
                      <div className="consent-details">
                        <div className="consent-type-info">
                          <h4>{consent.consentType.replace('_', ' ')}</h4>
                        </div>
                        <p className="requested-date">Requested: {new Date(consent.requestedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {stats.pendingConsents > 3 && (
                  <button 
                    onClick={() => setActiveTab('consents')} 
                    className="btn btn-secondary"
                    style={{marginTop: '15px'}}
                  >
                    View All {stats.pendingConsents} Pending Consents →
                  </button>
                )}
              </div>
            )}

            <div className="section">
              <h2>📈 System Analytics</h2>
              <div className="card">
                <div style={{padding: '30px'}}>
                  <h3 style={{marginBottom: '20px', color: 'var(--accent-primary)'}}>User Distribution</h3>
                  <div style={{display: 'flex', gap: '20px', marginBottom: '30px'}}>
                    <div style={{flex: 1, textAlign: 'center'}}>
                      <div style={{fontSize: '3rem'}}>👥</div>
                      <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)'}}>{stats.totalPatients}</div>
                      <div style={{color: 'var(--text-muted)'}}>Patients</div>
                    </div>
                    <div style={{flex: 1, textAlign: 'center'}}>
                      <div style={{fontSize: '3rem'}}>👨‍⚕️</div>
                      <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#38a169'}}>{stats.totalDoctors}</div>
                      <div style={{color: 'var(--text-muted)'}}>Doctors</div>
                    </div>
                  </div>
                  <h3 style={{marginBottom: '20px', color: 'var(--accent-primary)'}}>Record Status</h3>
                  <div style={{display: 'flex', gap: '20px'}}>
                    <div style={{flex: 1, textAlign: 'center'}}>
                      <div style={{fontSize: '3rem'}}>🔴</div>
                      <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#e53e3e'}}>{stats.activeRecords}</div>
                      <div style={{color: 'var(--text-muted)'}}>Active Treatment</div>
                    </div>
                    <div style={{flex: 1, textAlign: 'center'}}>
                      <div style={{fontSize: '3rem'}}>✅</div>
                      <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#38a169'}}>{stats.totalRecords - stats.activeRecords}</div>
                      <div style={{color: 'var(--text-muted)'}}>Normal/Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'pending' && (
          <div className="section">
            <h2>⏳ Pending User Approvals</h2>
            {pendingApprovals.length === 0 ? (
              <div className="card" style={{padding: '40px', textAlign: 'center'}}>
                <div style={{fontSize: '4rem', marginBottom: '20px'}}>✅</div>
                <h3 style={{color: '#38a169', marginBottom: '10px'}}>No Pending Approvals</h3>
                <p style={{color: 'var(--text-muted)'}}>All registration requests have been processed.</p>
              </div>
            ) : (
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden'}}>
                  <thead style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white'}}>
                    <tr>
                      <th style={{padding: '15px', textAlign: 'left'}}>Name</th>
                      <th style={{padding: '15px', textAlign: 'left'}}>Role</th>
                      <th style={{padding: '15px', textAlign: 'left'}}>Details</th>
                      <th style={{padding: '15px', textAlign: 'left'}}>Registered</th>
                      <th style={{padding: '15px', textAlign: 'left'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingApprovals.map((user, index) => (
                      <tr key={user.id} style={{borderBottom: '1px solid var(--border-color)', background: index % 2 === 0 ? 'var(--bg-card-hover)' : 'var(--bg-card)'}}>
                        <td style={{padding: '15px', fontWeight: '600'}}>
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'N/A'}
                        </td>
                        <td style={{padding: '15px'}}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            background: user.role === 'PATIENT' ? '#e0f2fe' : '#dcfce7',
                            color: user.role === 'PATIENT' ? '#0369a1' : '#15803d'
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={{padding: '15px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                          {user.role === 'PATIENT' && (
                            <div>
                              {user.phone && <div>📞 {user.phone}</div>}
                              {user.dateOfBirth && <div>🎂 {new Date(user.dateOfBirth).toLocaleDateString()}</div>}
                              {user.gender && <div>⚧ {user.gender}</div>}
                            </div>
                          )}
                          {user.role === 'DOCTOR' && (
                            <div>
                              {user.specialization && <div>🏥 {user.specialization}</div>}
                              {user.licenseNumber && <div>🆔 {user.licenseNumber}</div>}
                              {user.hospitalAffiliation && <div>🏢 {user.hospitalAffiliation}</div>}
                            </div>
                          )}
                        </td>
                        <td style={{padding: '15px', fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                          {new Date(user.createdAt).toLocaleString()}
                        </td>
                        <td style={{padding: '15px'}}>
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button
                              onClick={() => approveUser(user.id)}
                              style={{
                                padding: '6px 12px',
                                background: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                              }}
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => rejectUser(user.id)}
                              style={{
                                padding: '6px 12px',
                                background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                              }}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="section">
            <h2>👥 All System Users</h2>
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden'}}>
                <thead style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
                  <tr>
                    <th style={{padding: '15px', textAlign: 'left'}}>ID</th>
                    <th style={{padding: '15px', textAlign: 'left'}}>Name</th>
                    <th style={{padding: '15px', textAlign: 'left'}}>Role</th>
                    <th style={{padding: '15px', textAlign: 'left'}}>Details</th>
                    <th style={{padding: '15px', textAlign: 'left'}}>Status</th>
                    <th style={{padding: '15px', textAlign: 'left'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} style={{borderBottom: '1px solid var(--border-color)', background: index % 2 === 0 ? 'var(--bg-card-hover)' : 'var(--bg-card)'}}>
                      <td style={{padding: '15px'}}>{user.id}</td>
                      <td style={{padding: '15px', fontWeight: '600'}}>
                        {user.firstName && user.lastName ? (
                          user.role === 'PATIENT' || user.role === 'DOCTOR' ? (
                            <button
                              onClick={() => user.role === 'PATIENT' ? viewPatientDetails(user.patientId) : viewDoctorDetails(user.doctorId)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--accent-primary)',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                                fontWeight: '600',
                                padding: 0
                              }}
                            >
                              {`${user.firstName} ${user.lastName}`}
                            </button>
                          ) : (
                            `${user.firstName} ${user.lastName}`
                          )
                        ) : '-'}
                      </td>

                      <td style={{padding: '15px'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          background: user.role === 'PATIENT' ? '#e0f2fe' : user.role === 'DOCTOR' ? '#dcfce7' : '#fef3c7',
                          color: user.role === 'PATIENT' ? '#0369a1' : user.role === 'DOCTOR' ? '#15803d' : '#ca8a04'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{padding: '15px', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                        {user.specialization && `${user.specialization}`}
                        {user.hospitalAffiliation && ` - ${user.hospitalAffiliation}`}
                        {user.phone && user.phone}
                        {user.gender && ` (${user.gender})`}
                      </td>
                      <td style={{padding: '15px'}}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          background: user.isActive ? '#dcfce7' : '#fee2e2',
                          color: user.isActive ? '#15803d' : '#991b1b'
                        }}>
                          {user.isActive ? '✅ Active' : '🚫 Inactive'}
                        </span>
                      </td>
                      <td style={{padding: '15px'}}>
                        <button
                          onClick={() => toggleUserActive(user.id)}
                          className="btn btn-secondary"
                          style={{fontSize: '0.85rem', padding: '6px 12px'}}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="section">
            <h2>📋 All Medical Records</h2>
            <div className="records-list">
              {records.map((record) => (
                <div key={record.id} className="record-item card detailed">
                  <div className="record-details">
                    <h3>🏥 {record.organ?.displayName || 'Medical Record'}</h3>
                    <p className="diagnosis"><strong>Diagnosis:</strong> {record.diagnosis}</p>
                    {record.prescriptions && (
                      <p className="treatment"><strong>Prescriptions:</strong> {record.prescriptions}</p>
                    )}
                    {record.clinicalNotes && (
                      <p className="notes"><strong>Clinical Notes:</strong> {record.clinicalNotes}</p>
                    )}
                    <div className="record-meta">
                      <span>👤 Patient ID: {record.patient?.id}</span>
                      <span className="doctor">👨‍⚕️ Dr. {record.doctor?.firstName} {record.doctor?.lastName}</span>
                      <span className="specialization">({record.doctor?.specialization})</span>
                      <span className="date">📅 {new Date(record.recordDate || record.recordedAt).toLocaleDateString()}</span>
                      <span className={`status ${record.treatmentStatus?.toLowerCase()}`}>
                        {record.treatmentStatus === 'UNDER_TREATMENT' ? '🔴 Under Treatment' : '✅ Normal'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'consents' && (
          <div className="section">
            <h2>🔐 All Consent Requests</h2>
            <div className="consent-list">
              {consents.map((consent) => (
                <div key={consent.id} className={`consent-card card ${consent.status.toLowerCase()}`}>
                  <div className="consent-header">
                    <div className="doctor-info">
                      <h3>👨‍⚕️ Dr. {consent.doctor?.firstName} {consent.doctor?.lastName}</h3>
                      <p className="specialization">{consent.doctor?.specialization}</p>
                      <p className="hospital">{consent.doctor?.hospitalAffiliation}</p>
                      <p style={{marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
                        → Patient: {consent.patientName} (ID: {consent.patientId})
                      </p>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end'}}>
                      <span className={`status-badge ${consent.status.toLowerCase()}`}>
                        {consent.status === 'PENDING' && '⏳ Pending'}
                        {consent.status === 'APPROVED' && '✓ Approved'}
                        {consent.status === 'REVOKED' && '🚫 Revoked'}
                        {consent.status === 'EXPIRED' && '⏰ Expired'}
                      </span>
                      {consent.status === 'PENDING' && (
                        <button 
                          onClick={() => grantConsentAccess(consent.id)}
                          className="btn btn-primary"
                          style={{fontSize: '0.85rem', padding: '8px 16px'}}
                        >
                          ✓ Grant Access
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="consent-details">
                    <div className="consent-type-info">
                      <h4>{consent.consentType.replace('_', ' ')}</h4>
                    </div>
                    <p className="requested-date">Requested: {new Date(consent.requestedAt).toLocaleString()}</p>
                    {consent.approvedAt && (
                      <p className="approved-date">Approved: {new Date(consent.approvedAt).toLocaleString()}</p>
                    )}
                    {consent.expiresAt && (
                      <p className="expires">Expires: {new Date(consent.expiresAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={closeDetailsModal}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0, color: 'var(--accent-primary)'}}>
                {selectedDetails.type === 'PATIENT' ? '👤 Patient Details' : '👨‍⚕️ Doctor Details'}
              </h2>
              <button onClick={closeDetailsModal} style={{
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}>×</button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div style={{borderBottom: '2px solid var(--accent-primary)', paddingBottom: '12px'}}>
                <h3 style={{color: 'var(--accent-primary)', marginBottom: '8px'}}>Personal Information</h3>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>First Name</label>
                  <div style={{fontWeight: '600', color: 'var(--text-primary)'}}>{selectedDetails.data.firstName}</div>
                </div>
                <div>
                  <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Last Name</label>
                  <div style={{fontWeight: '600', color: 'var(--text-primary)'}}>{selectedDetails.data.lastName}</div>
                </div>
              </div>

              <div>
                <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Email</label>
                <div style={{fontWeight: '500', color: 'var(--text-primary)'}}>{selectedDetails.data.email}</div>
              </div>

              {selectedDetails.data.phone && (
                <div>
                  <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Phone</label>
                  <div style={{fontWeight: '500', color: 'var(--text-primary)'}}>{selectedDetails.data.phone}</div>
                </div>
              )}

              {selectedDetails.type === 'PATIENT' && (
                <>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                    <div>
                      <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Date of Birth</label>
                      <div style={{fontWeight: '500', color: 'var(--text-primary)'}}>{selectedDetails.data.dateOfBirth}</div>
                    </div>
                    <div>
                      <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Gender</label>
                      <div style={{fontWeight: '500', color: 'var(--text-primary)'}}>{selectedDetails.data.gender}</div>
                    </div>
                  </div>

                  {selectedDetails.data.address && (
                    <div>
                      <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Address</label>
                      <div style={{fontWeight: '500', color: 'var(--text-primary)'}}>{selectedDetails.data.address}</div>
                    </div>
                  )}

                  {(selectedDetails.data.emergencyContact || selectedDetails.data.emergencyPhone) && (
                    <>
                      <div style={{borderBottom: '2px solid var(--accent-primary)', paddingBottom: '12px', marginTop: '12px'}}>
                        <h3 style={{color: 'var(--accent-primary)', marginBottom: '8px'}}>Emergency Contact</h3>
                      </div>
                      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                        {selectedDetails.data.emergencyContact && (
                          <div>
                            <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Contact Name</label>
                            <div style={{fontWeight: '500', color: 'var(--text-primary)'}}>{selectedDetails.data.emergencyContact}</div>
                          </div>
                        )}
                        {selectedDetails.data.emergencyPhone && (
                          <div>
                            <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Contact Phone</label>
                            <div style={{fontWeight: '500', color: 'var(--text-primary)'}}>{selectedDetails.data.emergencyPhone}</div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}

              {selectedDetails.type === 'DOCTOR' && (
                <>
                  <div style={{borderBottom: '2px solid var(--accent-primary)', paddingBottom: '12px', marginTop: '12px'}}>
                    <h3 style={{color: 'var(--accent-primary)', marginBottom: '8px'}}>Professional Information</h3>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                    <div>
                      <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Specialization</label>
                      <div style={{fontWeight: '600', color: 'var(--text-primary)'}}>{selectedDetails.data.specialization}</div>
                    </div>
                    <div>
                      <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>License Number</label>
                      <div style={{fontWeight: '500', color: 'var(--text-primary)'}}>{selectedDetails.data.licenseNumber}</div>
                    </div>
                  </div>

                  {selectedDetails.data.hospitalAffiliation && (
                    <div>
                      <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Hospital Affiliation</label>
                      <div style={{fontWeight: '500', color: 'var(--text-primary)'}}>{selectedDetails.data.hospitalAffiliation}</div>
                    </div>
                  )}

                  {selectedDetails.data.yearsOfExperience && (
                    <div>
                      <label style={{fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600'}}>Years of Experience</label>
                      <div style={{fontWeight: '500', color: 'var(--text-primary)'}}>{selectedDetails.data.yearsOfExperience} years</div>
                    </div>
                  )}
                </>
              )}

              <div style={{borderBottom: '2px solid var(--accent-primary)', paddingBottom: '12px', marginTop: '12px'}}>
                <h3 style={{color: 'var(--accent-primary)', marginBottom: '8px'}}>Statistics</h3>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div style={{textAlign: 'center', padding: '16px', background: 'var(--bg-card-hover)', borderRadius: '8px'}}>
                  <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)'}}>{selectedDetails.data.medicalRecordsCount}</div>
                  <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Medical Records</div>
                </div>
                <div style={{textAlign: 'center', padding: '16px', background: 'var(--bg-card-hover)', borderRadius: '8px'}}>
                  <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#38a169'}}>{selectedDetails.data.consentsCount}</div>
                  <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Consents</div>
                </div>
              </div>

              <div style={{marginTop: '8px', padding: '12px', background: selectedDetails.data.isActive ? '#dcfce7' : '#fee2e2', borderRadius: '8px'}}>
                <div style={{textAlign: 'center', fontWeight: '600', color: selectedDetails.data.isActive ? '#15803d' : '#991b1b'}}>
                  {selectedDetails.data.isActive ? '✅ Account Active' : '🚫 Account Inactive'}
                </div>
              </div>

              <button onClick={closeDetailsModal} style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
