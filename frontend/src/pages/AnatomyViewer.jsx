import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'
import InteractiveHumanBody, { mapRecordsToBodyIssues } from '../components/InteractiveHumanBody'
import '../components/InteractiveHumanBody.css'
import './AnatomyViewer.css'

export default function AnatomyViewer() {
  const { patientId } = useParams()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  
  const [organs, setOrgans] = useState([])
  const [selectedPart, setSelectedPart] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [bodyIssues, setBodyIssues] = useState([])
  const [patientInfo, setPatientInfo] = useState(null)
  const [currentView, setCurrentView] = useState('front')
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    try {
      // Fetch organs and records (critical data)
      const [organsRes, recordsRes] = await Promise.all([
        api.get('/organs'),
        api.get(`/patient/${patientId}/records`),
      ])
      setOrgans(organsRes.data)
      setRecords(recordsRes.data)
      
      // Convert medical records to body issues
      const issues = mapRecordsToBodyIssues(recordsRes.data, organsRes.data)
      setBodyIssues(issues)

      // Fetch patient profile info
      // Use the summary endpoint (works for DOCTOR, ADMIN, PATIENT roles) to get demographics
      try {
        const summaryRes = await api.get(`/patient/${patientId}/summary`)
        if (summaryRes.data) {
          const summary = summaryRes.data
          setPatientInfo({
            firstName: summary.firstName || '',
            lastName: summary.lastName || '',
            dateOfBirth: summary.dateOfBirth || null,
            gender: summary.gender || null,
            phone: summary.phone || null,
            bloodGroup: null,
          })
        }
      } catch {
        // Fallback: use auth store info
        if (user) {
          setPatientInfo({
            firstName: user.name?.split(' ')[0] || '',
            lastName: user.name?.split(' ').slice(1).join(' ') || '',
            dateOfBirth: null,
            gender: null,
            phone: null,
            bloodGroup: null,
          })
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handlePartClick = (partId) => {
    setSelectedPart(selectedPart === partId ? null : partId)
  }
  
  // Find the selected issue details
  const selectedIssue = bodyIssues.find(i => i.bodyPart?.toLowerCase() === selectedPart?.toLowerCase())
  
  // Get records for the selected body part
  const getRecordsForPart = (partId) => {
    if (!partId) return []
    return records.filter(r => {
      const organName = (r.organ?.name || r.organName || '').toLowerCase()
      const ORGAN_MAP = {
        'brain': 'head', 'head': 'head', 'heart': 'chest', 'lungs': 'chest',
        'liver': 'abdomen', 'stomach': 'abdomen', 'intestines': 'abdomen',
        'kidneys': 'lower back', 'spine': 'lower back', 'bladder': 'abdomen',
        'thyroid': 'neck', 'eyes': 'head', 'ears': 'head',
        'bones': 'left leg', 'spleen': 'abdomen', 'pancreas': 'abdomen',
        'skin': 'chest', 'other': 'chest',
      }
      return (ORGAN_MAP[organName] || organName) === partId.toLowerCase()
    })
  }
  
  // Health score based on issues
  const calculateHealthScore = () => {
    const activeCount = bodyIssues.filter(i => i.severity === 'active').length
    const pastCount = bodyIssues.filter(i => i.severity === 'past').length
    return Math.max(0, 100 - (activeCount * 15) - (pastCount * 5))
  }
  
  const healthScore = calculateHealthScore()
  
  if (loading) {
    return (
      <div className="anatomy-viewer">
        <div className="av-loading">
          <div className="av-loading-spinner"></div>
          <p>Loading Anatomy Visualization...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="anatomy-viewer">
      {/* Header */}
      <header className="viewer-header">
        <div className="av-header-left">
          <div className="av-logo">
            <span className="av-logo-icon">🧬</span>
            <span className="av-logo-text">Health Atlas</span>
          </div>
        </div>
        
        {patientInfo && (
          <div className="av-patient-badge">
            <div className="av-patient-avatar">
              {patientInfo.firstName?.charAt(0)}{patientInfo.lastName?.charAt(0)}
            </div>
            <div className="av-patient-info">
              <span className="av-patient-name">{patientInfo.firstName} {patientInfo.lastName}</span>
              <span className="av-patient-meta">
                {new Date().getFullYear() - new Date(patientInfo.dateOfBirth).getFullYear()} yrs • {patientInfo.gender} • ID: #{patientId}
              </span>
            </div>
          </div>
        )}
        
        <button onClick={() => navigate(-1)} className="av-back-btn">
          ← Back to Dashboard
        </button>
      </header>
      
      <div className="av-main-layout">
        {/* Left Sidebar - Patient Vitals */}
        <aside className="av-sidebar-left">
          {patientInfo && (
            <div className="av-vitals-card">
              <div className="av-vitals-avatar-lg">
                {patientInfo.firstName?.charAt(0)}{patientInfo.lastName?.charAt(0)}
              </div>
              <h3 className="av-vitals-name">{patientInfo.firstName} {patientInfo.lastName}</h3>
              <p className="av-vitals-id">Patient ID: #{patientId}</p>
              
              <div className="av-vitals-grid">
                <div className="av-vital-item">
                  <span className="av-vital-label">Age</span>
                  <span className="av-vital-value">{new Date().getFullYear() - new Date(patientInfo.dateOfBirth).getFullYear()} yrs</span>
                </div>
                <div className="av-vital-item">
                  <span className="av-vital-label">Gender</span>
                  <span className="av-vital-value">{patientInfo.gender}</span>
                </div>
                <div className="av-vital-item">
                  <span className="av-vital-label">Blood</span>
                  <span className="av-vital-value">{patientInfo.bloodGroup || 'N/A'}</span>
                </div>
                <div className="av-vital-item">
                  <span className="av-vital-label">Phone</span>
                  <span className="av-vital-value">{patientInfo.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* All Organs */}
          <div className="av-organs-card">
            <h3>🫀 Organs & Systems</h3>
            <div className="av-organs-list">
              {organs.map(organ => {
                const hasCondition = records.some(r => {
                  const recOrgan = (r.organ?.name || r.organName || '').toLowerCase()
                  return recOrgan === organ.name.toLowerCase() && r.treatmentStatus === 'UNDER_TREATMENT'
                })
                return (
                  <div key={organ.id} className={`av-organ-item ${hasCondition ? 'has-condition' : ''}`}>
                    {hasCondition && <span className="av-organ-alert">⚠️</span>}
                    <span>{organ.displayName}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </aside>
        
        {/* Center - Anatomy View */}
        <main className="av-center">
          <div className="av-anatomy-card">
            <div className="av-anatomy-header">
              <div>
                <h2 className="av-anatomy-title">Anatomical Analysis</h2>
                <p className="av-anatomy-subtitle">Interactive body map showing health concerns and pain points</p>
              </div>
              <div className="av-view-toggle">
                <button
                  onClick={() => setCurrentView('front')}
                  className={`av-view-btn ${currentView === 'front' ? 'active' : ''}`}
                >
                  FRONT VIEW
                </button>
                <button
                  onClick={() => setCurrentView('back')}
                  className={`av-view-btn ${currentView === 'back' ? 'active' : ''}`}
                >
                  BACK VIEW
                </button>
              </div>
            </div>
            
            <div className="av-anatomy-body">
              <InteractiveHumanBody
                issues={bodyIssues}
                onPartClick={handlePartClick}
                selectedPart={selectedPart}
                view={currentView}
                gender={patientInfo?.gender}
              />
            </div>
            
            <div className="av-controls-hint">
              <p>� Red = current issue • 🟠 Orange = past issue • Hover markers for details</p>
            </div>
          </div>
        </main>
        
        {/* Right Sidebar - Issues & Details */}
        <aside className="av-sidebar-right">
          <div className="anatomy-issues-panel">
            <div className="aip-header">
              <div className="aip-header-icon">⚠️</div>
              <h3>Active Concerns ({bodyIssues.length})</h3>
            </div>
            <p className="aip-subtitle">Health issues detected from medical records</p>
            
            {bodyIssues.length === 0 ? (
              <div className="aip-no-issues">
                <div className="aip-no-issues-icon">✅</div>
                <h4>No active health issues</h4>
                <p>All systems are functioning normally</p>
              </div>
            ) : (
              <div>
                {bodyIssues.map((issue, index) => (
                  <div
                    key={index}
                    className={`aip-issue-card ${selectedPart === issue.bodyPart ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedPart(selectedPart === issue.bodyPart ? null : issue.bodyPart)
                    }}
                  >
                    <div className="aip-issue-top">
                      <div className="aip-issue-badges">
                        <span className={`aip-badge aip-badge-${issue.severity}`}>
                          {issue.severity === 'active' ? 'CURRENT' : 'PAST'}
                        </span>
                      </div>
                      <span className="aip-issue-arrow">›</span>
                    </div>
                    <h4 className="aip-issue-name">{issue.bodyPart}</h4>
                    <p className="aip-issue-desc">{issue.description}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Selected Issue Detail */}
            {selectedIssue && (
              <div className="aip-detail-panel">
                <button className="aip-detail-close" onClick={() => setSelectedPart(null)}>✕</button>
                <div className="aip-detail-header">
                  <div className="aip-detail-icon">ℹ️</div>
                  <div>
                    <h4 className="aip-detail-name">{selectedIssue.bodyPart}</h4>
                    <span className="aip-detail-label">Detailed Brief</span>
                  </div>
                </div>
                
                <p className="aip-detail-text">{selectedIssue.description}</p>
                
                {(selectedIssue.doctorName || selectedIssue.recordDate) && (
                  <div className="aip-detail-meta">
                    {selectedIssue.doctorName && (
                      <div className="aip-detail-meta-item">
                        <span>👨‍⚕️</span>
                        <span>{selectedIssue.doctorName}</span>
                      </div>
                    )}
                    {selectedIssue.recordDate && (
                      <div className="aip-detail-meta-item">
                        <span>📅</span>
                        <span>{new Date(selectedIssue.recordDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    )}
                    {selectedIssue.treatmentStatus && (
                      <div className="aip-detail-meta-item">
                        <span>🔴</span>
                        <span>{selectedIssue.treatmentStatus.replace(/_/g, ' ')}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Medical records for this body part */}
                {getRecordsForPart(selectedPart).length > 0 && (
                  <div className="av-part-records">
                    <h5 className="av-part-records-title">📋 Medical Records</h5>
                    {getRecordsForPart(selectedPart).map(record => (
                      <div key={record.id} className={`av-record-mini ${record.treatmentStatus === 'UNDER_TREATMENT' ? 'active' : ''}`}>
                        <div className="av-record-mini-header">
                          <span className="av-record-mini-date">
                            {new Date(record.recordDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <span className={`av-record-mini-status ${record.treatmentStatus.toLowerCase()}`}>
                            {record.treatmentStatus === 'UNDER_TREATMENT' ? '● Active' : '✓ Normal'}
                          </span>
                        </div>
                        <p className="av-record-mini-diagnosis">{record.diagnosis}</p>
                        {record.prescriptions && (
                          <p className="av-record-mini-rx">💊 {record.prescriptions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Quick Stats */}
            {bodyIssues.length > 0 && (
              <div className="aip-stats">
                <div className="aip-stat aip-stat-high">
                  <div className="aip-stat-label">Current</div>
                  <div className="aip-stat-count">{bodyIssues.filter(i => i.severity === 'active').length}</div>
                </div>
                <div className="aip-stat aip-stat-medium">
                  <div className="aip-stat-label">Past</div>
                  <div className="aip-stat-count">{bodyIssues.filter(i => i.severity === 'past').length}</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Health Score */}
          <div className="aip-vital-card">
            <h4 className="aip-vital-title">Overall Health Score</h4>
            <p className="aip-vital-subtitle">Based on {bodyIssues.length} active concern{bodyIssues.length !== 1 ? 's' : ''}</p>
            <div className="aip-vital-score">
              <span className="aip-vital-number">{healthScore}</span>
              <span className="aip-vital-max">/100</span>
            </div>
            <div className="aip-vital-bar">
              <div className="aip-vital-bar-fill" style={{ width: `${healthScore}%` }}></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

