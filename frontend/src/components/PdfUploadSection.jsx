import { useState, useEffect } from 'react'
import api from '../api/axios'
import './PrescriptionView.css'

export default function PdfUploadSection({ userId, organs }) {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploads, setUploads] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    organId: '',
    documentName: '',
    description: ''
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewId, setPreviewId] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  // Fetch uploads when component loads
  useEffect(() => {
    fetchUploads()
  }, [])

  const fetchUploads = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/uploads/patient/${userId}`)
      setUploads(response.data)
    } catch (error) {
      console.error('Error fetching uploads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed')
        e.target.value = ''
        return
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        e.target.value = ''
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!selectedFile) {
      alert('Please select a PDF file')
      return
    }

    if (!uploadForm.documentName.trim()) {
      alert('Please enter a document name')
      return
    }

    try {
      setLoading(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('documentName', uploadForm.documentName)
      if (uploadForm.organId) {
        formData.append('organId', uploadForm.organId)
      }
      if (uploadForm.description) {
        formData.append('description', uploadForm.description)
      }

      await api.post(`/uploads/patient/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(percentCompleted)
        }
      })

      alert('PDF uploaded successfully!')
      setShowUploadModal(false)
      setUploadForm({ organId: '', documentName: '', description: '' })
      setSelectedFile(null)
      setUploadProgress(0)
      fetchUploads()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert(error.response?.data?.message || 'Failed to upload PDF')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (uploadId, documentName) => {
    try {
      const response = await api.get(`/uploads/download/${uploadId}`, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${documentName}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading file:', error)
      alert('Failed to download file')
    }
  }

  const handleDelete = async (uploadId) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      await api.delete(`/uploads/${uploadId}`)
      alert('Document deleted successfully!')
      fetchUploads()
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete document')
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const handleViewInline = async (upload) => {
    if (previewId === upload.id) {
      setPreviewId(null)
      if (pdfUrl) { window.URL.revokeObjectURL(pdfUrl); setPdfUrl(null) }
      return
    }
    setLoadingPreview(true)
    setPreviewId(upload.id)
    try {
      const response = await api.get(`/uploads/download/${upload.id}`, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      if (pdfUrl) window.URL.revokeObjectURL(pdfUrl)
      setPdfUrl(url)
    } catch (error) {
      console.error('Failed to load preview:', error)
      setPreviewId(null)
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleOpenNewTab = async (upload) => {
    try {
      const response = await api.get(`/uploads/download/${upload.id}`, { responseType: 'blob' })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (error) {
      alert('Failed to open document')
    }
  }

  return (
    <div className="section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📄 Uploaded Documents</h2>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn btn-primary"
          style={{ fontSize: '1rem', padding: '10px 20px' }}
        >
          📤 Upload PDF
        </button>
      </div>

      {loading && uploads.length === 0 ? (
        <div className="prescriptions-empty">
          <div className="preview-spinner" style={{margin: '0 auto 12px'}}></div>
          <p>Loading documents...</p>
        </div>
      ) : uploads.length === 0 ? (
        <div className="prescriptions-empty">
          <div className="empty-doc-icon">📄</div>
          <h3 style={{margin: '10px 0 5px'}}>No documents uploaded yet</h3>
          <p>Upload lab reports, prescriptions, and medical scans.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn btn-primary"
            style={{ marginTop: '15px' }}
          >
            📤 Upload Your First Document
          </button>
        </div>
      ) : (
        <div className="doc-gallery">
          {uploads.map((upload) => (
            <div key={upload.id} className={`doc-card ${previewId === upload.id ? 'expanded' : ''}`}>
              {/* Paper thumbnail */}
              <div className="doc-paper" onClick={() => handleViewInline(upload)}>
                <div className="doc-paper-corner"></div>
                <div className="doc-paper-content">
                  <div className="doc-header-strip">
                    <span className="doc-type-badge upload-badge">PDF</span>
                    <span className="doc-date">
                      {new Date(upload.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="doc-title">{upload.documentName}</div>
                  <div className="doc-subtitle">
                    {upload.organName && <span>🏥 {upload.organName}</span>}
                    {upload.description && <span>{upload.description}</span>}
                  </div>
                  <div className="doc-preview-lines">
                    <div className="preview-line" style={{width: '85%'}}></div>
                    <div className="preview-line" style={{width: '70%'}}></div>
                    <div className="preview-line" style={{width: '80%'}}></div>
                  </div>
                  <div className="doc-footer-info">
                    <span className="med-count">📏 {formatFileSize(upload.fileSize)}</span>
                    {upload.isVerified && <span className="hospital-tag" style={{background: '#f0fff4', color: '#38a169', borderColor: '#c6f6d5'}}>✓ Verified</span>}
                  </div>
                </div>
                <div className="doc-click-hint">Click to preview</div>
              </div>

              {/* Action buttons */}
              <div className="doc-actions">
                <button className="doc-btn doc-btn-view" onClick={() => handleOpenNewTab(upload)} title="Open in new tab">
                  <span className="doc-btn-icon">🔍</span> View
                </button>
                <button className="doc-btn doc-btn-download" onClick={() => handleDownload(upload.id, upload.documentName)} title="Download">
                  <span className="doc-btn-icon">⬇️</span> Download
                </button>
                <button className="doc-btn" onClick={() => handleDelete(upload.id)} title="Delete"
                  style={{color: '#e53e3e', flex: '0 0 auto', padding: '11px 14px'}}>
                  🗑️
                </button>
              </div>

              {/* Inline PDF preview */}
              {previewId === upload.id && (
                <div className="doc-preview-panel">
                  {loadingPreview ? (
                    <div className="preview-loading">
                      <div className="preview-spinner"></div>
                      <p>Loading document...</p>
                    </div>
                  ) : pdfUrl ? (
                    <div className="preview-embed">
                      <div className="preview-toolbar">
                        <span className="preview-title">📄 {upload.documentName}</span>
                        <button className="preview-close" onClick={(e) => { e.stopPropagation(); setPreviewId(null); window.URL.revokeObjectURL(pdfUrl); setPdfUrl(null) }}>✕</button>
                      </div>
                      <iframe
                        src={pdfUrl + '#toolbar=1&navpanes=0'}
                        title={upload.documentName}
                        className="pdf-iframe"
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>📤 Upload Medical Document (PDF)</h2>
              <button onClick={() => setShowUploadModal(false)} className="close-btn">×</button>
            </div>

            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Document Name *</label>
                <input
                  type="text"
                  value={uploadForm.documentName}
                  onChange={(e) => setUploadForm({ ...uploadForm, documentName: e.target.value })}
                  placeholder="e.g., Blood Test Results, X-Ray Report"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
              </div>

              <div className="form-group">
                <label>Related Body Part/Organ (Optional)</label>
                <select
                  value={uploadForm.organId}
                  onChange={(e) => setUploadForm({ ...uploadForm, organId: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                >
                  <option value="">Select an organ (optional)</option>
                  {organs.map((organ) => (
                    <option key={organ.id} value={organ.id}>
                      {organ.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Add any notes about this document..."
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label>Select PDF File * (Max 10MB)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                />
                {selectedFile && (
                  <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>
                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ width: '100%', height: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: '#4CAF50', transition: 'width 0.3s' }} />
                  </div>
                  <p style={{ textAlign: 'center', marginTop: '5px', fontSize: '0.9rem' }}>
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}

              <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '⏳ Uploading...' : '📤 Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
