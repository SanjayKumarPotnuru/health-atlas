import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'
import PdfUploadSection from '../components/PdfUploadSection'
import PrescriptionView from '../components/PrescriptionView'
import '../components/PrescriptionView.css'
import './Dashboard.css'

export default function PatientDashboard() {
  const { user, logout } = useAuthStore()
  const [consents, setConsents] = useState([])
  const [records, setRecords] = useState([])
  const [organs, setOrgans] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'consents', 'records', 'documents'
  const [docSubTab, setDocSubTab] = useState('prescriptions') // 'prescriptions', 'uploads'
  const [showAddRecordModal, setShowAddRecordModal] = useState(false)
  const [newRecord, setNewRecord] = useState({
    organId: '',
    diagnosis: '',
    notes: '',
    treatmentStatus: 'NORMAL',
    recordDate: new Date().toISOString().split('T')[0]
  })
  const [customOrgan, setCustomOrgan] = useState('')
  const [showCustomOrganInput, setShowCustomOrganInput] = useState(false)
  const navigate = useNavigate()
  
  const fetchData = useCallback(async () => {
    try {
      const [consentsRes, recordsRes, organsRes, prescriptionsRes] = await Promise.all([
        api.get(`/patient/${user.profileId}/consents`),
        api.get(`/patient/${user.profileId}/records`),
        api.get('/organs'),
        api.get(`/patient/${user.profileId}/prescriptions`)
      ])
      setConsents(consentsRes.data)
      setRecords(recordsRes.data)
      setOrgans(organsRes.data)
      setPrescriptions(prescriptionsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [user.profileId])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])
  
  const handleConsentAction = async (consentId, action) => {
    try {
      await api.put(`/patient/${user.profileId}/consent/${consentId}/${action}`)
      fetchData()
      const actionMsg = action === 'approve' ? 'approved' : 'revoked'
      alert(`Consent ${actionMsg} successfully!`)
    } catch (error) {
      console.error(`Error ${action} consent:`, error)
      alert(`Failed to ${action} consent`)
    }
  }

  const getConsentTypeLabel = (type) => {
    const labels = {
      'ONE_TIME': '🔒 One-Time Access',
      'SEVEN_DAYS': '📅 7 Days Access',
      'THIRTY_DAYS': '📅 30 Days Access',
      'ALWAYS': '🔓 Permanent Access'
    }
    return labels[type] || type
  }

  const getConsentTypeDescription = (type) => {
    const descriptions = {
      'ONE_TIME': 'Doctor can view your records only once',
      'SEVEN_DAYS': 'Doctor can access your records for 7 days',
      'THIRTY_DAYS': 'Doctor can access your records for 30 days',
      'ALWAYS': 'Doctor has permanent access to your records'
    }
    return descriptions[type] || 'Custom access period'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleAddRecord = async (e) => {
    e.preventDefault()
    
    if (!newRecord.organId || !newRecord.diagnosis) {
      alert('Please fill in all required fields')
      return
    }

    if (showCustomOrganInput && !customOrgan.trim()) {
      alert('Please enter the custom body part/organ name')
      return
    }

    try {
      const recordData = { ...newRecord }
      // If custom organ is entered, prepend it to notes
      if (showCustomOrganInput && customOrgan.trim()) {
        recordData.notes = `Custom Body Part: ${customOrgan.trim()}${recordData.notes ? '\n\n' + recordData.notes : ''}`
      }
      
      await api.post(`/patient/${user.profileId}/medical-record`, recordData)
      setShowAddRecordModal(false)
      setNewRecord({
        organId: '',
        diagnosis: '',
        notes: '',
        treatmentStatus: 'NORMAL',
        recordDate: new Date().toISOString().split('T')[0]
      })
      setCustomOrgan('')
      setShowCustomOrganInput(false)
      fetchData()
      alert('Medical record added successfully!')
    } catch (error) {
      console.error('Error adding medical record:', error)
      alert(error.response?.data?.message || 'Failed to add medical record')
    }
  }

  const handleRecordChange = (e) => {
    const { name, value } = e.target
    setNewRecord({ ...newRecord, [name]: value })
    
    // Find the "Other" organ and show custom input if selected
    if (name === 'organId') {
      const selectedOrgan = organs.find(o => o.id === parseInt(value))
      if (selectedOrgan && selectedOrgan.name === 'other') {
        setShowCustomOrganInput(true)
      } else {
        setShowCustomOrganInput(false)
        setCustomOrgan('')
      }
    }
  }

  // Filter consents by status
  const pendingConsents = consents.filter(c => c.status === 'PENDING')
  const approvedConsents = consents.filter(c => c.status === 'APPROVED')
  const revokedConsents = consents.filter(c => c.status === 'REVOKED' || c.status === 'DENIED')
  
  // Calculate active doctors
  const activeDoctors = new Set(approvedConsents.map(c => c.doctor?.id)).size
  
  if (loading) {
    return <div className="loading">Loading your dashboard...</div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <div className="user-info">
          <span>👋 Hi, {user.firstName || 'Patient'}</span>
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
          className={`tab ${activeTab === 'consents' ? 'active' : ''}`}
          onClick={() => setActiveTab('consents')}
        >
          🔐 Consent Management
          {pendingConsents.length > 0 && (
            <span className="badge">{pendingConsents.length}</span>
          )}
        </button>
        <button 
          className={`tab ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => setActiveTab('records')}
        >
          📋 Medical Records
        </button>
        <button 
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          📁 Documents & Prescriptions
          {prescriptions.length > 0 && (
            <span className="badge">{prescriptions.length}</span>
          )}
        </button>
      </div>
      
      <div className="dashboard-content container">
        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card card">
                <div className="stat-icon">👨‍⚕️</div>
                <div className="stat-info">
                  <h3>{activeDoctors}</h3>
                  <p>Active Doctor{activeDoctors !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">📋</div>
                <div className="stat-info">
                  <h3>{records.length}</h3>
                  <p>Medical Record{records.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{pendingConsents.length}</h3>
                  <p>Pending Request{pendingConsents.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {pendingConsents.length > 0 && (
              <div className="alert-section">
                <div className="alert alert-warning">
                  <h3>⚠️ {pendingConsents.length} Consent Request{pendingConsents.length !== 1 ? 's' : ''} Awaiting Your Response</h3>
                  <button 
                    onClick={() => setActiveTab('consents')}
                    className="btn btn-primary"
                  >
                    Review Requests
                  </button>
                </div>
              </div>
            )}
            
            <div className="action-card card">
              <h2>🧍 Interactive 3D Anatomy Viewer</h2>
              <p>Explore your medical history with our interactive 3D anatomy viewer. See affected organs and detailed medical records.</p>
              <button 
                onClick={() => navigate(`/anatomy/${user.profileId}`)}
                className="btn btn-primary btn-large"
              >
                Open 3D Anatomy Viewer
              </button>
            </div>
            
            <div className="section">
              <h2>📊 Recent Medical Records</h2>
              {records.length === 0 ? (
                <div className="empty-state card">
                  <div className="empty-icon">📋</div>
                  <h3>No medical records yet</h3>
                  <p>Your medical history will appear here once your doctor adds records.</p>
                </div>
              ) : (
                <div className="records-list">
                  {records.slice(0, 5).map((record) => (
                    <div key={record.id} className="record-item card">
                      <div className="record-icon">🏥</div>
                      <div className="record-details">
                        <h3>{record.organ?.displayName || record.organName}</h3>
                        <p className="diagnosis">{record.diagnosis}</p>
                        <div className="record-meta">
                          <span className="doctor">👨‍⚕️ Dr. {record.doctor?.firstName} {record.doctor?.lastName}</span>
                          <span className="date">📅 {new Date(record.recordDate || record.recordedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {records.length > 5 && (
                    <button 
                      onClick={() => setActiveTab('records')}
                      className="btn btn-secondary"
                    >
                      View All {records.length} Records
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'consents' && (
          <>
            <div className="section">
              <div className="section-header">
                <h2>🔐 Consent Management</h2>
                <p className="subtitle">Control who can access your medical records</p>
              </div>

              {pendingConsents.length > 0 && (
                <div className="consent-section">
                  <h3 className="section-title">⏳ Pending Requests ({pendingConsents.length})</h3>
                  <div className="consent-list">
                    {pendingConsents.map((consent) => (
                      <div key={consent.id} className="consent-card card pending">
                        <div className="consent-header">
                          <div className="doctor-info">
                            <h3>👨‍⚕️ Dr. {consent.doctor?.firstName} {consent.doctor?.lastName}</h3>
                            <p className="specialization">{consent.doctor?.specialization}</p>
                            <p className="hospital">{consent.doctor?.hospitalAffiliation}</p>
                          </div>
                          <span className="status-badge pending">⏳ Pending</span>
                        </div>
                        <div className="consent-details">
                          <div className="consent-type-info">
                            <h4>{getConsentTypeLabel(consent.consentType)}</h4>
                            <p>{getConsentTypeDescription(consent.consentType)}</p>
                          </div>
                          <p className="requested-date">Requested: {new Date(consent.requestedAt).toLocaleString()}</p>
                        </div>
                        <div className="consent-actions">
                          <button
                            onClick={() => handleConsentAction(consent.id, 'approve')}
                            className="btn btn-success"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleConsentAction(consent.id, 'revoke')}
                            className="btn btn-danger"
                          >
                            ✗ Deny
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {approvedConsents.length > 0 && (
                <div className="consent-section">
                  <h3 className="section-title">✅ Active Access ({approvedConsents.length})</h3>
                  <div className="consent-list">
                    {approvedConsents.map((consent) => (
                      <div key={consent.id} className="consent-card card approved">
                        <div className="consent-header">
                          <div className="doctor-info">
                            <h3>👨‍⚕️ Dr. {consent.doctor?.firstName} {consent.doctor?.lastName}</h3>
                            <p className="specialization">{consent.doctor?.specialization}</p>
                            <p className="hospital">{consent.doctor?.hospitalAffiliation}</p>
                          </div>
                          <span className="status-badge approved">✓ Active</span>
                        </div>
                        <div className="consent-details">
                          <div className="consent-type-info">
                            <h4>{getConsentTypeLabel(consent.consentType)}</h4>
                            {consent.expiresAt && (
                              <p className="expires">Expires: {new Date(consent.expiresAt).toLocaleDateString()}</p>
                            )}
                          </div>
                          <p className="approved-date">Approved: {new Date(consent.approvedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="consent-actions">
                          <button
                            onClick={() => handleConsentAction(consent.id, 'revoke')}
                            className="btn btn-danger"
                          >
                            🚫 Revoke Access
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {revokedConsents.length > 0 && (
                <div className="consent-section">
                  <h3 className="section-title">🚫 Revoked/Denied ({revokedConsents.length})</h3>
                  <div className="consent-list">
                    {revokedConsents.map((consent) => (
                      <div key={consent.id} className="consent-card card revoked">
                        <div className="consent-header">
                          <div className="doctor-info">
                            <h3>👨‍⚕️ Dr. {consent.doctor?.firstName} {consent.doctor?.lastName}</h3>
                            <p className="specialization">{consent.doctor?.specialization}</p>
                          </div>
                          <span className="status-badge revoked">{consent.status === 'REVOKED' ? '🚫 Revoked' : '✗ Denied'}</span>
                        </div>
                        <div className="consent-details">
                          <p className="revoked-date">
                            {consent.status === 'REVOKED' ? 'Revoked' : 'Denied'}: {new Date(consent.revokedAt || consent.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {consents.length === 0 && (
                <div className="empty-state card">
                  <div className="empty-icon">🔐</div>
                  <h3>No consent requests yet</h3>
                  <p>When doctors request access to your medical records, they will appear here for your approval.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'records' && (
          <div className="section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2>📋 All Medical Records</h2>
              <button 
                onClick={() => setShowAddRecordModal(true)}
                className="btn btn-primary"
                style={{fontSize: '1rem', padding: '10px 20px'}}
              >
                ➕ Add Medical Record
              </button>
            </div>

            {records.length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">📋</div>
                <h3>No medical records yet</h3>
                <p>Track your health by adding medical records or wait for your doctor to add them.</p>
                <button 
                  onClick={() => setShowAddRecordModal(true)}
                  className="btn btn-primary"
                  style={{marginTop: '20px'}}
                >
                  ➕ Add Your First Record
                </button>
              </div>
            ) : (
              <div className="records-list">
                {records.map((record) => (
                  <div key={record.id} className="record-item card detailed">
                    <div className="record-icon">🏥</div>
                    <div className="record-details">
                      <h3>{record.organ?.displayName || record.organName}</h3>
                      <p className="diagnosis"><strong>Diagnosis:</strong> {record.diagnosis}</p>
                      {record.prescriptions && (
                        <p className="treatment"><strong>Prescriptions:</strong> {record.prescriptions}</p>
                      )}
                      {record.clinicalNotes && (
                        <p className="notes"><strong>Clinical Notes:</strong> {record.clinicalNotes}</p>
                      )}
                      <div className="record-meta">
                        <span className="doctor">👨‍⚕️ {record.doctorName || 'Self-Reported'}</span>
                        {record.doctorName && record.doctorName !== 'Self-Reported' && record.doctor?.specialization && (
                          <span className="specialization">({record.doctor.specialization})</span>
                        )}
                        <span className="date">📅 {new Date(record.recordDate || record.recordedAt).toLocaleDateString()}</span>
                        <span className={`status ${record.treatmentStatus?.toLowerCase()}`}>
                          {record.treatmentStatus === 'UNDER_TREATMENT' ? '🔴 Under Treatment' : '✅ Normal'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="section">
            <div className="doc-sub-tabs" style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px'}}>
              <button
                onClick={() => setDocSubTab('prescriptions')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  background: docSubTab === 'prescriptions' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'var(--bg-card-hover)',
                  color: docSubTab === 'prescriptions' ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
              >
                💊 Prescriptions {prescriptions.length > 0 && `(${prescriptions.length})`}
              </button>
              <button
                onClick={() => setDocSubTab('uploads')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px 8px 0 0',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  background: docSubTab === 'uploads' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'var(--bg-card-hover)',
                  color: docSubTab === 'uploads' ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
              >
                📄 Uploaded Documents
              </button>
            </div>

            {docSubTab === 'prescriptions' && (
              <div>
                <h2>💊 My Prescriptions</h2>
                <PrescriptionView
                  prescriptions={prescriptions}
                  userRole="PATIENT"
                />
              </div>
            )}

            {docSubTab === 'uploads' && (
              <PdfUploadSection userId={user.profileId} organs={organs} />
            )}
          </div>
        )}
      </div>

      {/* Add Medical Record Modal */}
      {showAddRecordModal && (
        <div className="modal-overlay" onClick={() => setShowAddRecordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '600px'}}>
            <div className="modal-header">
              <h2>➕ Add Medical Record</h2>
              <button onClick={() => setShowAddRecordModal(false)} className="close-btn">×</button>
            </div>
            
            <form onSubmit={handleAddRecord}>
              <div className="form-group">
                <label>Affected Body Part/Organ *</label>
                <select
                  name="organId"
                  value={newRecord.organId}
                  onChange={handleRecordChange}
                  required
                  style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)'}}
                >
                  <option value="">Select an organ...</option>
                  {organs.map((organ) => (
                    <option key={organ.id} value={organ.id}>
                      {organ.name === 'other' ? '🔸 Other (Specify below)' : organ.displayName}
                    </option>
                  ))}
                </select>
              </div>

              {showCustomOrganInput && (
                <div className="form-group">
                  <label>Specify Body Part/Organ *</label>
                  <input
                    type="text"
                    value={customOrgan}
                    onChange={(e) => setCustomOrgan(e.target.value)}
                    placeholder="Enter the body part or organ name..."
                    required
                    style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)'}}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Symptoms/Diagnosis *</label>
                <textarea
                  name="diagnosis"
                  value={newRecord.diagnosis}
                  onChange={handleRecordChange}
                  placeholder="Describe your symptoms or diagnosis..."
                  required
                  rows="4"
                  style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)', resize: 'vertical', background: 'var(--bg-card)', color: 'var(--text-primary)'}}
                />
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  value={newRecord.notes}
                  onChange={handleRecordChange}
                  placeholder="Any additional information..."
                  rows="3"
                  style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)', resize: 'vertical', background: 'var(--bg-card)', color: 'var(--text-primary)'}}
                />
              </div>

              <div className="form-group">
                <label>Treatment Status *</label>
                <select
                  name="treatmentStatus"
                  value={newRecord.treatmentStatus}
                  onChange={handleRecordChange}
                  required
                  style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)'}}
                >
                  <option value="NORMAL">✅ Normal - No treatment required</option>
                  <option value="UNDER_TREATMENT">🔴 Under Treatment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="recordDate"
                  value={newRecord.recordDate}
                  onChange={handleRecordChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)'}}
                />
              </div>

              <div className="modal-actions" style={{display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px'}}>
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  ➕ Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
