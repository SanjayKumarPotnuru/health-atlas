import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'
import PrescriptionForm from '../components/PrescriptionForm'
import PrescriptionView from '../components/PrescriptionView'
import '../components/PrescriptionForm.css'
import '../components/PrescriptionView.css'
import './Dashboard.css'

export default function DoctorDashboard() {
  const { user, logout } = useAuthStore()
  const [consents, setConsents] = useState([])
  const [patients, setPatients] = useState([])
  const [patientEmail, setPatientEmail] = useState('')
  const [patientSearchTerm, setPatientSearchTerm] = useState('')
  const [showPatientDropdown, setShowPatientDropdown] = useState(false)
  const [consentType, setConsentType] = useState('SEVEN_DAYS')
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [organs, setOrgans] = useState([])
  const [recordForm, setRecordForm] = useState({
    organId: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  })
  const [prescriptionPatient, setPrescriptionPatient] = useState(null)
  const [doctorPrescriptions, setDoctorPrescriptions] = useState([])
  const [showPrescriptions, setShowPrescriptions] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)
  
  useEffect(() => {
    fetchConsents()
    fetchOrgans()
    fetchPatients()
    fetchPrescriptions()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPatientDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const fetchConsents = async () => {
    try {
      const response = await api.get(`/doctor/${user.userId}/consents`)
      setConsents(response.data)
    } catch (error) {
      console.error('Error fetching consents:', error)
    }
  }
  
  const fetchOrgans = async () => {
    try {
      const response = await api.get('/organs')
      setOrgans(response.data)
    } catch (error) {
      console.error('Error fetching organs:', error)
    }
  }

  const fetchPatients = async () => {
    try {
      const response = await api.get(`/doctor/${user.userId}/patients`)
      setPatients(response.data)
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get(`/doctor/${user.userId}/prescriptions`)
      setDoctorPrescriptions(response.data)
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    }
  }
  
  const requestConsent = async (e) => {
    e.preventDefault()
    
    if (!patientEmail) {
      alert('Please select a patient from the dropdown')
      return
    }
    
    try {
      await api.post(`/doctor/${user.userId}/consent/request`, {
        patientEmail,
        consentType
      })
      setPatientEmail('')
      setPatientSearchTerm('')
      fetchConsents()
      alert('Consent request sent successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to request consent')
    }
  }
  
  const addRecord = async (e) => {
    e.preventDefault()
    if (!selectedPatient) return
    
    try {
      await api.post(`/doctor/${user.userId}/medical-record`, {
        patientId: selectedPatient.patientId,
        ...recordForm
      })
      setRecordForm({ organId: '', diagnosis: '', treatment: '', notes: '' })
      setSelectedPatient(null)
      alert('Medical record added successfully!')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add record')
    }
  }
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handlePatientSearch = (e) => {
    const value = e.target.value
    setPatientSearchTerm(value)
    setShowPatientDropdown(true)
  }

  const selectPatient = (patient) => {
    setPatientEmail(patient.email)
    setPatientSearchTerm(patient.name + ' - ' + patient.email)
    setShowPatientDropdown(false)
  }

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(patientSearchTerm.toLowerCase())
  )
  
  const pendingConsents = consents.filter(c => c.status === 'PENDING')
  const approvedConsents = consents.filter(c => c.status === 'APPROVED')
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🏥 Doctor Portal</h1>
        <div className="user-info">
          <span>Dr. {user.name}</span>
          <button onClick={() => navigate('/profile')} className="btn btn-link">👤 Profile</button>
          <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
        </div>
      </header>
      
      <div className="dashboard-content container">
        <div className="section">
          <h2>📝 Request Patient Consent</h2>
          <div className="card">
            <form onSubmit={requestConsent}>
              <div className="form-group">
                <label>Patient Email</label>
                <div className="searchable-select" ref={dropdownRef}>
                  <input
                    type="text"
                    value={patientSearchTerm}
                    onChange={handlePatientSearch}
                    onFocus={() => setShowPatientDropdown(true)}
                    placeholder="Search patient by name or email..."
                    className="search-input"
                    autoComplete="off"
                  />
                  {showPatientDropdown && filteredPatients.length > 0 && (
                    <div className="dropdown-list">
                      {filteredPatients.map((patient) => (
                        <div
                          key={patient.id}
                          className="dropdown-item"
                          onClick={() => selectPatient(patient)}
                        >
                          <div className="patient-info-row">
                            <div className="patient-details">
                              <div className="patient-name">{patient.name}</div>
                              <div className="patient-email">{patient.email}</div>
                            </div>
                            {patient.consentStatus && (
                              <div className={`consent-badge ${patient.consentStatus.toLowerCase()}`}>
                                {patient.consentStatus === 'PENDING' && '⏳ Pending'}
                                {patient.consentStatus === 'APPROVED' && '✅ Approved'}
                                {patient.consentStatus === 'REVOKED' && '❌ Revoked'}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showPatientDropdown && filteredPatients.length === 0 && patientSearchTerm && (
                    <div className="dropdown-list">
                      <div className="dropdown-item no-results">No patients found</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Consent Type</label>
                <select value={consentType} onChange={(e) => setConsentType(e.target.value)}>
                  <option value="ONE_TIME">One Time</option>
                  <option value="SEVEN_DAYS">7 Days</option>
                  <option value="THIRTY_DAYS">30 Days</option>
                  <option value="ALWAYS">Always</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Request Consent</button>
            </form>
          </div>
        </div>
        
        <div className="section">
          <h2>⏳ My Pending Consents</h2>
          {pendingConsents.length === 0 ? (
            <p className="empty-state">No pending consent requests</p>
          ) : (
            <div className="consent-list">
              {pendingConsents.map((consent) => (
                <div key={consent.id} className="consent-item card pending-consent">
                  <div className="consent-info">
                    <h3>{consent.patientName}</h3>
                    <p>Type: {consent.consentType.replace('_', ' ')}</p>
                    <p className="date">Requested: {new Date(consent.requestedAt).toLocaleDateString()}</p>
                    <span className="status-badge pending">⏳ Awaiting Patient Approval</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="section">
          <h2>✅ My Active Consents</h2>
          {approvedConsents.length === 0 ? (
            <p className="empty-state">No active consents</p>
          ) : (
            <div className="consent-list">
              {approvedConsents.map((consent) => (
                <div key={consent.id} className="consent-item card">
                  <div className="consent-info">
                    <h3>{consent.patientName}</h3>
                    <p>Type: {consent.consentType.replace('_', ' ')}</p>
                    {consent.expiresAt && (
                      <p className="date">Expires: {new Date(consent.expiresAt).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="consent-actions">
                    <button
                      onClick={() => navigate(`/anatomy/${consent.patientId}`)}
                      className="btn btn-primary"
                    >
                      View Records
                    </button>
                    <button
                      onClick={() => setSelectedPatient(consent)}
                      className="btn btn-secondary"
                    >
                      Add Record
                    </button>
                    <button
                      onClick={() => setPrescriptionPatient(consent)}
                      className="btn btn-success"
                      style={{background: 'linear-gradient(135deg, #38a169, #2f855a)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600}}
                    >
                      📋 Write Prescription
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="section">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>� Documents & Prescriptions ({doctorPrescriptions.length})</h2>
            <button
              onClick={() => setShowPrescriptions(!showPrescriptions)}
              className="btn btn-secondary"
            >
              {showPrescriptions ? 'Hide' : 'Show'}
            </button>
          </div>
          {showPrescriptions && (
            <PrescriptionView
              prescriptions={doctorPrescriptions}
              userRole="DOCTOR"
            />
          )}
          {!showPrescriptions && doctorPrescriptions.length > 0 && (
            <p className="empty-state" style={{padding: '15px', marginTop: '10px'}}>Click "Show" to view all {doctorPrescriptions.length} prescription(s)</p>
          )}
        </div>

        {prescriptionPatient && (
          <PrescriptionForm
            patient={prescriptionPatient}
            doctorId={user.userId}
            onClose={() => setPrescriptionPatient(null)}
            onSuccess={() => {
              setPrescriptionPatient(null)
              fetchPrescriptions()
            }}
          />
        )}

        {selectedPatient && (
          <div className="section">
            <h2>➕ Add Medical Record for {selectedPatient.patientName}</h2>
            <div className="card">
              <form onSubmit={addRecord}>
                <div className="form-group">
                  <label>Organ System</label>
                  <select
                    value={recordForm.organId}
                    onChange={(e) => setRecordForm({...recordForm, organId: e.target.value})}
                    required
                  >
                    <option value="">Select organ...</option>
                    {organs.map(organ => (
                      <option key={organ.id} value={organ.id}>{organ.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Diagnosis</label>
                  <input
                    type="text"
                    value={recordForm.diagnosis}
                    onChange={(e) => setRecordForm({...recordForm, diagnosis: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Treatment</label>
                  <input
                    type="text"
                    value={recordForm.treatment}
                    onChange={(e) => setRecordForm({...recordForm, treatment: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={recordForm.notes}
                    onChange={(e) => setRecordForm({...recordForm, notes: e.target.value})}
                    rows="4"
                  />
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button type="submit" className="btn btn-primary">Save Record</button>
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
