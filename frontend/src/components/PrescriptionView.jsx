import { useState } from 'react'
import api from '../api/axios'
import './PrescriptionView.css'

export default function PrescriptionView({ prescriptions, userRole, title }) {
  const [previewId, setPreviewId] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [downloading, setDownloading] = useState(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  const loadPreview = async (rx) => {
    if (previewId === rx.id) {
      setPreviewId(null)
      if (pdfUrl) { window.URL.revokeObjectURL(pdfUrl); setPdfUrl(null) }
      return
    }
    setLoadingPreview(true)
    setPreviewId(rx.id)
    try {
      const response = await api.get(`/prescriptions/${rx.id}/pdf`, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      if (pdfUrl) window.URL.revokeObjectURL(pdfUrl)
      setPdfUrl(url)
    } catch (error) {
      console.error('Failed to load preview:', error)
      alert('Failed to load prescription preview')
      setPreviewId(null)
    } finally {
      setLoadingPreview(false)
    }
  }

  const openInNewTab = async (rx) => {
    try {
      const response = await api.get(`/prescriptions/${rx.id}/pdf`, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => window.URL.revokeObjectURL(url), 1000)
    } catch (error) {
      alert('Failed to open prescription PDF')
    }
  }

  const downloadPdf = async (rx) => {
    setDownloading(rx.id)
    try {
      const response = await api.get(`/prescriptions/${rx.id}/pdf`, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Prescription_${rx.patientName.replace(/\s+/g, '_')}_${rx.prescriptionDate}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to download prescription PDF')
    } finally {
      setDownloading(null)
    }
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <div className="prescriptions-empty">
        <div className="empty-doc-icon">📋</div>
        <p>No prescriptions found</p>
      </div>
    )
  }

  return (
    <div className="prescriptions-view">
      {title && <h3 className="prescriptions-title">{title}</h3>}
      <div className="doc-gallery">
        {prescriptions.map((rx) => (
          <div key={rx.id} className={`doc-card ${previewId === rx.id ? 'expanded' : ''}`}>
            {/* Document thumbnail — looks like a real paper */}
            <div className="doc-paper" onClick={() => loadPreview(rx)}>
              <div className="doc-paper-corner"></div>
              <div className="doc-paper-content">
                <div className="doc-header-strip">
                  <span className="doc-type-badge rx-badge">Rx</span>
                  <span className="doc-date">
                    {new Date(rx.prescriptionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="doc-title">{rx.finalDiagnosis}</div>
                <div className="doc-subtitle">
                  {userRole !== 'PATIENT' && <span>🧑 {rx.patientName}</span>}
                  {userRole !== 'DOCTOR' && <span>👨‍⚕️ {rx.doctorName}</span>}
                </div>
                <div className="doc-preview-lines">
                  <div className="preview-line" style={{width: '90%'}}></div>
                  <div className="preview-line" style={{width: '75%'}}></div>
                  <div className="preview-line" style={{width: '85%'}}></div>
                  <div className="preview-line" style={{width: '60%'}}></div>
                </div>
                <div className="doc-footer-info">
                  <span className="med-count">💊 {rx.medicines?.length || 0} medicine(s)</span>
                  {rx.hospitalAffiliation && <span className="hospital-tag">🏥 {rx.hospitalAffiliation}</span>}
                </div>
              </div>
              <div className="doc-click-hint">Click to preview</div>
            </div>

            {/* Action buttons */}
            <div className="doc-actions">
              <button className="doc-btn doc-btn-view" onClick={() => openInNewTab(rx)} title="Open in new tab">
                <span className="doc-btn-icon">🔍</span> View
              </button>
              <button className="doc-btn doc-btn-download" onClick={() => downloadPdf(rx)}
                disabled={downloading === rx.id} title="Download PDF">
                <span className="doc-btn-icon">{downloading === rx.id ? '⏳' : '⬇️'}</span> Download
              </button>
            </div>

            {/* Inline PDF preview */}
            {previewId === rx.id && (
              <div className="doc-preview-panel">
                {loadingPreview ? (
                  <div className="preview-loading">
                    <div className="preview-spinner"></div>
                    <p>Loading prescription...</p>
                  </div>
                ) : pdfUrl ? (
                  <div className="preview-embed">
                    <div className="preview-toolbar">
                      <span className="preview-title">📄 Prescription — {rx.finalDiagnosis}</span>
                      <button className="preview-close" onClick={(e) => { e.stopPropagation(); setPreviewId(null); window.URL.revokeObjectURL(pdfUrl); setPdfUrl(null) }}>✕</button>
                    </div>
                    <iframe
                      src={pdfUrl + '#toolbar=1&navpanes=0'}
                      title={`Prescription ${rx.id}`}
                      className="pdf-iframe"
                    />
                  </div>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
