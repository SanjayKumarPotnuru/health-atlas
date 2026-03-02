import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import api from '../api/axios'
import './PrescriptionForm.css'

export default function PrescriptionForm({ patient, doctorId, onClose, onSuccess }) {
  const [organs, setOrgans] = useState([])
  const [medicines, setMedicines] = useState([{
    medicineName: '', genericName: '', dosage: '', frequency: '1-0-1',
    route: 'ORAL', timing: 'After Food', duration: '', instructions: ''
  }])
  const [form, setForm] = useState({
    chiefComplaint: '',
    finalDiagnosis: '',
    visitType: 'NORMAL',
    vitalsBp: '',
    vitalsBmi: '',
    vitalsTemperature: '',
    vitalsPulse: '',
    clinicalNotes: '',
    followUpDate: '',
    followUpNotes: '',
    prescriptionDate: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // multi-step form

  const ROUTES = ['ORAL', 'LOCAL APPLICATION', 'INTRAVENOUS', 'INTRAMUSCULAR', 'SUBCUTANEOUS', 'INHALATION', 'TOPICAL', 'SUBLINGUAL']
  const TIMINGS = ['Before Food', 'After Food', 'Before Breakfast', 'After Breakfast', 'Before Lunch', 'After Lunch', 'Before Dinner', 'After Dinner', 'At Bedtime', 'During Attack', 'Not Applicable', 'Empty Stomach']
  const FREQUENCIES = ['1-0-0', '0-1-0', '0-0-1', '1-1-0', '1-0-1', '0-1-1', '1-1-1', 'SOS', '1-1-1-1']

  const addMedicine = () => {
    setMedicines([...medicines, {
      medicineName: '', genericName: '', dosage: '', frequency: '1-0-1',
      route: 'ORAL', timing: 'After Food', duration: '', instructions: ''
    }])
  }

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index))
    }
  }

  const updateMedicine = (index, field, value) => {
    const updated = [...medicines]
    updated[index][field] = value
    setMedicines(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        patientId: patient.patientId,
        ...form,
        followUpDate: form.followUpDate || null,
        medicines: medicines.filter(m => m.medicineName.trim() !== '')
      }

      const response = await api.post(`/doctor/${doctorId}/prescription`, payload)
      alert('Prescription created successfully!')
      if (onSuccess) onSuccess(response.data)
      if (onClose) onClose()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create prescription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="prescription-overlay">
      <div className="prescription-modal">
        <div className="prescription-modal-header">
          <h2>📋 Generate Prescription</h2>
          <p>Patient: <strong>{patient.patientName}</strong></p>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step indicator */}
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
              <span className="step-num">1</span>
              <span className="step-label">Patient & Vitals</span>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`} onClick={() => setStep(2)}>
              <span className="step-num">2</span>
              <span className="step-label">Diagnosis</span>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`} onClick={() => setStep(3)}>
              <span className="step-num">3</span>
              <span className="step-label">Medicines</span>
            </div>
            <div className={`step ${step >= 4 ? 'active' : ''}`} onClick={() => setStep(4)}>
              <span className="step-num">4</span>
              <span className="step-label">Review</span>
            </div>
          </div>

          {/* Step 1: Vitals */}
          {step === 1 && (
            <div className="form-step">
              <h3>Visit & Vitals Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Visit Type</label>
                  <select value={form.visitType} onChange={e => setForm({...form, visitType: e.target.value})}>
                    <option value="NORMAL">Normal</option>
                    <option value="FOLLOW-UP">Follow-up</option>
                    <option value="EMERGENCY">Emergency</option>
                    <option value="ROUTINE">Routine Checkup</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Prescription Date</label>
                  <input type="date" value={form.prescriptionDate}
                    onChange={e => setForm({...form, prescriptionDate: e.target.value})} required />
                </div>
              </div>
              <div className="form-row vitals-row">
                <div className="form-group">
                  <label>BP (mmHg)</label>
                  <input type="text" placeholder="120/80" value={form.vitalsBp}
                    onChange={e => setForm({...form, vitalsBp: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>BMI</label>
                  <input type="text" placeholder="22.5" value={form.vitalsBmi}
                    onChange={e => setForm({...form, vitalsBmi: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Temperature</label>
                  <input type="text" placeholder="98.6°F" value={form.vitalsTemperature}
                    onChange={e => setForm({...form, vitalsTemperature: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Pulse (bpm)</label>
                  <input type="text" placeholder="72" value={form.vitalsPulse}
                    onChange={e => setForm({...form, vitalsPulse: e.target.value})} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 2: Diagnosis */}
          {step === 2 && (
            <div className="form-step">
              <h3>Chief Complaint & Diagnosis</h3>
              <div className="form-group">
                <label>Chief Complaint *</label>
                <textarea rows="3" placeholder="Describe patient's chief complaints and symptoms..."
                  value={form.chiefComplaint}
                  onChange={e => setForm({...form, chiefComplaint: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Final Diagnosis *</label>
                <input type="text" placeholder="e.g., Tinea Cruris, Hypertension Stage 2"
                  value={form.finalDiagnosis}
                  onChange={e => setForm({...form, finalDiagnosis: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Clinical Notes</label>
                <textarea rows="3" placeholder="Additional clinical observations..."
                  value={form.clinicalNotes}
                  onChange={e => setForm({...form, clinicalNotes: e.target.value})} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
              </div>
            </div>
          )}

          {/* Step 3: Medicines */}
          {step === 3 && (
            <div className="form-step">
              <h3>Rx - Medicines ({medicines.length})</h3>
              <div className="medicines-list">
                {medicines.map((med, index) => (
                  <div key={index} className="medicine-card">
                    <div className="medicine-header">
                      <span className="medicine-num">#{index + 1}</span>
                      {medicines.length > 1 && (
                        <button type="button" className="remove-med-btn" onClick={() => removeMedicine(index)}>✕</button>
                      )}
                    </div>
                    <div className="form-row">
                      <div className="form-group flex-2">
                        <label>Medicine Name *</label>
                        <input type="text" placeholder="e.g., SYNTRAN SB"
                          value={med.medicineName}
                          onChange={e => updateMedicine(index, 'medicineName', e.target.value)} required />
                      </div>
                      <div className="form-group flex-1">
                        <label>Dosage</label>
                        <input type="text" placeholder="e.g., 130MG"
                          value={med.dosage}
                          onChange={e => updateMedicine(index, 'dosage', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Generic Name</label>
                        <input type="text" placeholder="e.g., EBERCONAZOLE (1% W/W)"
                          value={med.genericName}
                          onChange={e => updateMedicine(index, 'genericName', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Frequency *</label>
                        <select value={med.frequency}
                          onChange={e => updateMedicine(index, 'frequency', e.target.value)}>
                          {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Route</label>
                        <select value={med.route}
                          onChange={e => updateMedicine(index, 'route', e.target.value)}>
                          {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Timing</label>
                        <select value={med.timing}
                          onChange={e => updateMedicine(index, 'timing', e.target.value)}>
                          {TIMINGS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Duration *</label>
                        <input type="text" placeholder="e.g., 2 Weeks"
                          value={med.duration}
                          onChange={e => updateMedicine(index, 'duration', e.target.value)} required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Special Instructions</label>
                      <input type="text" placeholder="e.g., 20 MINUTES BEFORE BATH"
                        value={med.instructions}
                        onChange={e => updateMedicine(index, 'instructions', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="btn btn-add-medicine" onClick={addMedicine}>+ Add Medicine</button>

              <h3 style={{marginTop: '20px'}}>Follow-up</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Follow-up Date</label>
                  <input type="date" value={form.followUpDate}
                    onChange={e => setForm({...form, followUpDate: e.target.value})} />
                </div>
                <div className="form-group flex-2">
                  <label>Follow-up Notes</label>
                  <input type="text" placeholder="e.g., Recheck BP and assess compliance"
                    value={form.followUpNotes}
                    onChange={e => setForm({...form, followUpNotes: e.target.value})} />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>Review →</button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="form-step">
              <h3>Review Prescription</h3>
              <div className="review-section">
                <div className="review-card">
                  <h4>Patient & Visit</h4>
                  <p><strong>Patient:</strong> {patient.patientName}</p>
                  <p><strong>Visit Type:</strong> {form.visitType}</p>
                  <p><strong>Date:</strong> {form.prescriptionDate}</p>
                  {form.vitalsBp && <p><strong>BP:</strong> {form.vitalsBp}</p>}
                  {form.vitalsBmi && <p><strong>BMI:</strong> {form.vitalsBmi}</p>}
                </div>
                <div className="review-card">
                  <h4>Diagnosis</h4>
                  <p><strong>Chief Complaint:</strong> {form.chiefComplaint}</p>
                  <p><strong>Final Diagnosis:</strong> <span className="diagnosis-highlight">{form.finalDiagnosis}</span></p>
                  {form.clinicalNotes && <p><strong>Notes:</strong> {form.clinicalNotes}</p>}
                </div>
                <div className="review-card">
                  <h4>Rx - {medicines.filter(m => m.medicineName).length} Medicine(s)</h4>
                  <table className="review-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Medicine</th>
                        <th>Frequency</th>
                        <th>Route</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.filter(m => m.medicineName).map((med, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            <strong>{med.medicineName}</strong>
                            {med.dosage && <span> {med.dosage}</span>}
                            {med.genericName && <div className="generic-name">{med.genericName}</div>}
                            {med.instructions && <div className="med-instruction">⚠ {med.instructions}</div>}
                          </td>
                          <td>{med.frequency}</td>
                          <td>{med.route}</td>
                          <td>{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {form.followUpDate && (
                  <div className="review-card">
                    <h4>Follow-up</h4>
                    <p><strong>Date:</strong> {form.followUpDate}</p>
                    {form.followUpNotes && <p><strong>Notes:</strong> {form.followUpNotes}</p>}
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setStep(3)}>← Back</button>
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? 'Generating...' : '✅ Generate Prescription & PDF'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
