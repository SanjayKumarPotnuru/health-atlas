import { useState, useRef } from 'react'
import svgPaths from './body-svg-data'

/**
 * Interactive 2D SVG Human Body Anatomy Visualization
 * 
 * Uses a smooth anatomical silhouette SVG with overlay markers.
 * Features:
 * - Realistic human body outline (smooth SVG paths)
 * - Red circular markers for medical issues with pulsing animation
 * - Front/back view with CSS flip transition
 * - Severity-based marker coloring
 * - Tooltip on hover
 * - Pain point support
 * - Severity scale legend
 */

// ============================================
// Organ → Body Part name mapping
// ============================================
const ORGAN_TO_BODY_PART = {
  'brain': 'head',
  'head': 'head',
  'heart': 'chest',
  'lungs': 'chest',
  'liver': 'abdomen',
  'stomach': 'abdomen',
  'intestines': 'abdomen',
  'kidneys': 'lower back',
  'spine': 'lower back',
  'bladder': 'abdomen',
  'pancreas': 'abdomen',
  'gallbladder': 'abdomen',
  'thyroid': 'neck',
  'prostate': 'abdomen',
  'uterus': 'abdomen',
  'eyes': 'head',
  'ears': 'head',
  'skin': 'chest',
  'bones': 'left leg',
  'spleen': 'abdomen',
  'other': 'chest',
}

// ============================================
// Marker positions as % of container (0-100)
// ============================================
const FRONT_MARKERS = {
  head:              { x: 50,   y: 5.5 },
  neck:              { x: 50,   y: 11.5 },
  chest:             { x: 50,   y: 24 },
  abdomen:           { x: 50,   y: 36 },
  'left shoulder':   { x: 35,   y: 16.5 },
  'right shoulder':  { x: 65,   y: 16.5 },
  'left arm':        { x: 28,   y: 28 },
  'right arm':       { x: 72,   y: 28 },
  'left forearm':    { x: 22,   y: 42 },
  'right forearm':   { x: 78,   y: 42 },
  'left hand':       { x: 15,   y: 53 },
  'right hand':      { x: 85,   y: 53 },
  'left hip':        { x: 42,   y: 43 },
  'right hip':       { x: 58,   y: 43 },
  'left thigh':      { x: 40,   y: 57 },
  'right thigh':     { x: 60,   y: 57 },
  'left knee':       { x: 39,   y: 69 },
  'right knee':      { x: 61,   y: 69 },
  'left leg':        { x: 38,   y: 80 },
  'right leg':       { x: 62,   y: 80 },
  'left foot':       { x: 37,   y: 95 },
  'right foot':      { x: 63,   y: 95 },
}

const BACK_MARKERS = {
  head:              { x: 50,   y: 5.5 },
  neck:              { x: 50,   y: 11.5 },
  'upper back':      { x: 50,   y: 24 },
  'lower back':      { x: 50,   y: 36 },
  'left shoulder':   { x: 35,   y: 16.5 },
  'right shoulder':  { x: 65,   y: 16.5 },
  'left arm':        { x: 28,   y: 28 },
  'right arm':       { x: 72,   y: 28 },
  'left forearm':    { x: 22,   y: 42 },
  'right forearm':   { x: 78,   y: 42 },
  'left hand':       { x: 15,   y: 53 },
  'right hand':      { x: 85,   y: 53 },
  'left hip':        { x: 42,   y: 43 },
  'right hip':       { x: 58,   y: 43 },
  'left thigh':      { x: 40,   y: 57 },
  'right thigh':     { x: 60,   y: 57 },
  'left knee':       { x: 39,   y: 69 },
  'right knee':      { x: 61,   y: 69 },
  'left leg':        { x: 38,   y: 80 },
  'right leg':       { x: 62,   y: 80 },
  'left foot':       { x: 37,   y: 95 },
  'right foot':      { x: 63,   y: 95 },
}

// Body part display names
const BODY_PART_NAMES = {
  head: 'Head',
  neck: 'Neck',
  chest: 'Chest',
  abdomen: 'Abdomen',
  'upper back': 'Upper Back',
  'lower back': 'Lower Back',
  'left shoulder': 'Left Shoulder',
  'right shoulder': 'Right Shoulder',
  'left arm': 'Left Upper Arm',
  'right arm': 'Right Upper Arm',
  'left forearm': 'Left Forearm',
  'right forearm': 'Right Forearm',
  'left hand': 'Left Hand',
  'right hand': 'Right Hand',
  'left hip': 'Left Hip',
  'right hip': 'Right Hip',
  'left thigh': 'Left Thigh',
  'right thigh': 'Right Thigh',
  'left knee': 'Left Knee',
  'right knee': 'Right Knee',
  'left leg': 'Left Calf',
  'right leg': 'Right Calf',
  'left foot': 'Left Foot',
  'right foot': 'Right Foot',
}

// ============================================
// Click region detection
// ============================================
function detectBodyRegion(xPct, yPct, view) {
  if (yPct < 9) return 'head'
  if (yPct < 13) return 'neck'
  
  if (yPct < 20) {
    if (xPct < 38) return 'left shoulder'
    if (xPct > 62) return 'right shoulder'
    return view === 'front' ? 'chest' : 'upper back'
  }
  
  if (yPct < 33) {
    if (xPct < 25) return 'left arm'
    if (xPct > 75) return 'right arm'
    return view === 'front' ? 'chest' : 'upper back'
  }
  
  if (yPct < 46) {
    if (xPct < 20) return 'left forearm'
    if (xPct > 80) return 'right forearm'
    if (xPct < 45) return view === 'front' ? 'abdomen' : 'lower back'
    if (xPct > 55) return view === 'front' ? 'abdomen' : 'lower back'
    return view === 'front' ? 'abdomen' : 'lower back'
  }
  
  if (yPct < 50) {
    if (xPct < 18) return 'left hand'
    if (xPct > 82) return 'right hand'
    if (xPct < 46) return 'left hip'
    if (xPct > 54) return 'right hip'
    return view === 'front' ? 'abdomen' : 'lower back'
  }
  
  if (yPct < 65) {
    if (xPct < 50) return 'left thigh'
    return 'right thigh'
  }
  
  if (yPct < 73) {
    if (xPct < 50) return 'left knee'
    return 'right knee'
  }
  
  if (yPct < 92) {
    if (xPct < 50) return 'left leg'
    return 'right leg'
  }
  
  if (xPct < 50) return 'left foot'
  return 'right foot'
}

// Severity ranking helper
function severityRank(s) {
  if (s === 'active') return 2
  if (s === 'past') return 1
  return 0
}

// Severity color helper
function getSeverityColor(severity) {
  switch (severity) {
    case 'active': return '#ef4444'   // Red - currently experiencing
    case 'past':   return '#f97316'   // Orange - experienced in the past
    case 'pain':   return '#ef4444'   // Red - pain point
    default:       return '#f97316'
  }
}

// ============================================
// Component
// ============================================
export default function InteractiveHumanBody({
  issues = [],
  onPartClick,
  selectedPart,
  view = 'front',
  gender = 'MALE',
}) {
  const containerRef = useRef(null)
  const [hoveredMarker, setHoveredMarker] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Build issue map (highest severity per body part)
  const issueMap = new Map()
  issues.forEach(issue => {
    const key = issue.bodyPart?.toLowerCase()
    if (key) {
      const existing = issueMap.get(key)
      if (!existing || severityRank(issue.severity) > severityRank(existing.severity)) {
        issueMap.set(key, issue)
      }
    }
  })

  // Get marker positions for current view
  const positions = view === 'front' ? FRONT_MARKERS : BACK_MARKERS

  // Collect markers from medical record issues only
  const markers = []
  issueMap.forEach((issue, partKey) => {
    const pos = positions[partKey]
    if (pos) {
      markers.push({
        id: `issue-${partKey}`,
        partKey,
        severity: issue.severity,
        diagnosis: issue.diagnosis,
        description: issue.description,
        x: pos.x,
        y: pos.y,
      })
    }
  })

  // Handle marker click - select for detail view
  const handleMarkerClick = (e, partKey) => {
    e.stopPropagation()
    if (onPartClick) onPartClick(partKey)
  }

  // Handle marker hover
  const handleMarkerEnter = (e, marker) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 60,
      })
    }
    setHoveredMarker(marker)
  }

  return (
    <div className="ihb-wrapper">
      {/* Anatomy Card */}
      <div className="ihb-card" ref={containerRef}>
        
        {/* Body SVG with flip animation */}
        <div
          className="ihb-body-flip"
          style={{
            transform: view === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FRONT VIEW LAYER */}
          <div className="ihb-body-face">
            <svg
              className="ihb-body-svg"
              viewBox="0 0 595.5 1135.28"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Silhouette */}
              <path d={svgPaths.p26030800} className="ihb-path-silhouette" />
              <path d={svgPaths.p1e9043f0} className="ihb-path-navel" />

              {/* Front Features: Ears/Eyes, Nipples */}
              <g opacity="0.8">
                <path d={svgPaths.p18f00180} fill="#e2e8f0" />
                <path d={svgPaths.p6662f00} fill="#e2e8f0" />
                <path d={svgPaths.p38c22080} fill="#f1f5f9" />
                <path d={svgPaths.pcd9400} fill="#f1f5f9" />
              </g>

              {/* Front Detailed Lines */}
              <path d={svgPaths.p2bc2d240} className="ihb-path-details" />
            </svg>
          </div>

          {/* BACK VIEW LAYER */}
          <div className="ihb-body-face ihb-body-face-back">
            <svg
              className="ihb-body-svg"
              viewBox="0 0 595.5 1135.28"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Silhouette (Same) */}
              <path d={svgPaths.p26030800} className="ihb-path-silhouette" />
              <path d={svgPaths.p1e9043f0} className="ihb-path-navel" />

              {/* Back Features: Spine, Shoulder blades, Dimples, Calves */}
              <g stroke="#cbd5e1" strokeWidth="1.2" fill="none" strokeLinecap="round">
                {/* Spine line */}
                <line x1="297.75" y1="130" x2="297.75" y2="520" strokeDasharray="4 8" />

                {/* Shoulder blades (Scapulae) */}
                <path d="M220 180 Q240 175 260 220" opacity="0.6" />
                <path d="M375 180 Q355 175 335 220" opacity="0.6" />

                {/* Lower back dimples */}
                <circle cx="275" cy="530" r="1.5" fill="#cbd5e1" stroke="none" />
                <circle cx="320" cy="530" r="1.5" fill="#cbd5e1" stroke="none" />

                {/* Calf muscles */}
                <path d="M220 780 Q210 820 225 860" opacity="0.4" />
                <path d="M375 780 Q385 820 370 860" opacity="0.4" />
              </g>

              {/* Faint main lines for context */}
              <path d={svgPaths.p2bc2d240} stroke="#cbd5e1" strokeWidth="0.8" fill="none" opacity="0.1" />
            </svg>
          </div>
        </div>

        {/* Issue & Pain Markers Layer */}
        <div className="ihb-markers-layer">
          {markers.map(marker => {
            const isSelected = selectedPart === marker.partKey
            const color = getSeverityColor(marker.severity)

            return (
              <button
                key={marker.id}
                className={`ihb-marker ${isSelected ? 'ihb-marker-selected' : ''}`}
                style={{
                  left: `${marker.x}%`,
                  top: `${marker.y}%`,
                  '--marker-color': color,
                }}
                onClick={(e) => handleMarkerClick(e, marker.partKey)}
                onMouseEnter={(e) => handleMarkerEnter(e, marker)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                {/* Pulsing ring */}
                <span className="ihb-marker-ping" />
                {/* Solid circle */}
                <span className="ihb-marker-dot">
                  {/* Alert icon */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ihb-marker-icon">
                    <circle cx="12" cy="12" r="10" stroke="none" />
                    <line x1="12" y1="8" x2="12" y2="13" />
                    <circle cx="12" cy="16" r="0.5" fill="white" stroke="none" />
                  </svg>
                </span>
              </button>
            )
          })}
        </div>

        {/* Tooltip */}
        {hoveredMarker && (
          <div
            className="ihb-tooltip"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
            }}
          >
            <span className="ihb-tooltip-name">
              {BODY_PART_NAMES[hoveredMarker.partKey] || hoveredMarker.partKey}
            </span>
            <span className={`ihb-tooltip-severity ihb-sev-${hoveredMarker.severity}`}>
              {hoveredMarker.severity === 'active' ? 'CURRENT ISSUE' : 'PAST ISSUE'}
            </span>
            {hoveredMarker.diagnosis && (
              <span className="ihb-tooltip-diagnosis">{hoveredMarker.diagnosis}</span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="ihb-legend">
        <div className="ihb-legend-title">Issue Status</div>
        <div className="ihb-legend-items">
          <div className="ihb-legend-item">
            <span className="ihb-legend-dot" style={{ backgroundColor: '#ef4444' }} />
            <span>Current Issue</span>
          </div>
          <div className="ihb-legend-item">
            <span className="ihb-legend-dot" style={{ backgroundColor: '#f97316' }} />
            <span>Past Issue</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Helper: convert medical records to body issues
// ============================================
export function mapRecordsToBodyIssues(records, organs) {
  const issueMap = new Map()

  records.forEach(record => {
    // Support both nested (record.organ.name) and flat (record.organName) shapes
    const organName = (record.organ?.name || record.organName || '').toLowerCase()
    if (!organName) return

    const bodyPart = ORGAN_TO_BODY_PART[organName] || organName

    // Red for current issues, orange for past
    const isActive = record.treatmentStatus === 'UNDER_TREATMENT' || record.treatmentStatus === 'MONITORING'
    const severity = isActive ? 'active' : 'past'

    const existing = issueMap.get(bodyPart)
    const sevRank = { active: 2, past: 1 }

    if (!existing || sevRank[severity] > sevRank[existing.severity]) {
      issueMap.set(bodyPart, {
        bodyPart,
        severity,
        diagnosis: record.diagnosis,
        description: record.clinicalNotes || record.diagnosis,
        doctorName: record.doctorName || (record.doctor ? `Dr. ${record.doctor.firstName} ${record.doctor.lastName}` : null),
        recordDate: record.recordDate,
        treatmentStatus: record.treatmentStatus,
      })
    }
  })

  return Array.from(issueMap.values())
}
