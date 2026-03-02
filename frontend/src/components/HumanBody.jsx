import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

// Anatomical body regions for pain mapping
export const bodyRegions = {
  // Head & Neck
  head: { position: [0, 2.65, 0], size: [0.4, 0.45, 0.35], name: 'Head' },
  neck: { position: [0, 2.15, 0], size: [0.18, 0.25, 0.18], name: 'Neck' },
  
  // Torso - Front
  chest: { position: [0, 1.5, 0.22], size: [0.55, 0.45, 0.25], name: 'Chest' },
  upperAbdomen: { position: [0, 0.9, 0.2], size: [0.5, 0.3, 0.25], name: 'Upper Abdomen' },
  lowerAbdomen: { position: [0, 0.4, 0.18], size: [0.48, 0.35, 0.25], name: 'Lower Abdomen' },
  pelvis: { position: [0, -0.1, 0.15], size: [0.52, 0.3, 0.28], name: 'Pelvis' },
  
  // Torso - Back
  upperBack: { position: [0, 1.5, -0.18], size: [0.50, 0.45, 0.22], name: 'Upper Back' },
  lowerBack: { position: [0, 0.65, -0.18], size: [0.45, 0.5, 0.22], name: 'Lower Back' },
  
  // Arms - Right
  rightShoulder: { position: [0.6, 1.85, 0], size: [0.22, 0.22, 0.22], name: 'Right Shoulder' },
  rightUpperArm: { position: [0.85, 1.3, 0], size: [0.15, 0.4, 0.15], name: 'Right Upper Arm' },
  rightElbow: { position: [0.88, 0.85, 0], size: [0.13, 0.15, 0.13], name: 'Right Elbow' },
  rightForearm: { position: [0.9, 0.45, 0], size: [0.12, 0.35, 0.12], name: 'Right Forearm' },
  rightHand: { position: [0.92, 0.05, 0], size: [0.12, 0.2, 0.08], name: 'Right Hand' },
  
  // Arms - Left
  leftShoulder: { position: [-0.6, 1.85, 0], size: [0.22, 0.22, 0.22], name: 'Left Shoulder' },
  leftUpperArm: { position: [-0.85, 1.3, 0], size: [0.15, 0.4, 0.15], name: 'Left Upper Arm' },
  leftElbow: { position: [-0.88, 0.85, 0], size: [0.13, 0.15, 0.13], name: 'Left Elbow' },
  leftForearm: { position: [-0.9, 0.45, 0], size: [0.12, 0.35, 0.12], name: 'Left Forearm' },
  leftHand: { position: [-0.92, 0.05, 0], size: [0.12, 0.2, 0.08], name: 'Left Hand' },
  
  // Legs - Right
  rightHip: { position: [0.25, -0.15, 0], size: [0.22, 0.25, 0.25], name: 'Right Hip' },
  rightThigh: { position: [0.28, -0.65, 0], size: [0.18, 0.5, 0.18], name: 'Right Thigh' },
  rightKnee: { position: [0.28, -1.2, 0], size: [0.16, 0.18, 0.16], name: 'Right Knee' },
  rightCalf: { position: [0.28, -1.7, 0], size: [0.14, 0.45, 0.14], name: 'Right Calf' },
  rightAnkle: { position: [0.28, -2.15, 0], size: [0.11, 0.12, 0.11], name: 'Right Ankle' },
  rightFoot: { position: [0.28, -2.36, 0.08], size: [0.12, 0.1, 0.22], name: 'Right Foot' },
  
  // Legs - Left
  leftHip: { position: [-0.25, -0.15, 0], size: [0.22, 0.25, 0.25], name: 'Left Hip' },
  leftThigh: { position: [-0.28, -0.65, 0], size: [0.18, 0.5, 0.18], name: 'Left Thigh' },
  leftKnee: { position: [-0.28, -1.2, 0], size: [0.16, 0.18, 0.16], name: 'Left Knee' },
  leftCalf: { position: [-0.28, -1.7, 0], size: [0.14, 0.45, 0.14], name: 'Left Calf' },
  leftAnkle: { position: [-0.28, -2.15, 0], size: [0.11, 0.12, 0.11], name: 'Left Ankle' },
  leftFoot: { position: [-0.28, -2.36, 0.08], size: [0.12, 0.1, 0.22], name: 'Left Foot' },
}

// Realistic anatomical organ data with accurate colors and positions
const organPositions = {
  'brain': { 
    position: [0, 2.6, 0], 
    color: '#FFB6C1', 
    size: [0.35, 0.3, 0.32], 
    type: 'brain',
    medicalColor: '#F8B8C8'
  },
  'heart': { 
    position: [0.08, 1.3, 0.15], 
    color: '#8B0000', 
    size: [0.22, 0.26, 0.18], 
    type: 'heart',
    medicalColor: '#DC143C'
  },
  'lungs': { 
    position: [0, 1.45, -0.05], 
    color: '#FFB6D9', 
    size: [0.28, 0.4, 0.25], 
    type: 'lungs',
    medicalColor: '#F8A8C8',
    dual: true
  },
  'liver': { 
    position: [0.3, 0.65, 0.12], 
    color: '#8B4513', 
    size: [0.45, 0.28, 0.22], 
    type: 'liver',
    medicalColor: '#B8442D'
  },
  'kidneys': { 
    position: [0, 0.3, -0.22], 
    color: '#A0522D', 
    size: [0.12, 0.18, 0.12], 
    type: 'kidney',
    medicalColor: '#C87855',
    dual: true
  },
  'stomach': { 
    position: [-0.15, 0.75, 0.18], 
    color: '#CD853F', 
    size: [0.22, 0.28, 0.2], 
    type: 'stomach',
    medicalColor: '#DEB887'
  },
  'intestines': { 
    position: [0, 0.05, 0.15], 
    color: '#F4A460', 
    size: [0.35, 0.5, 0.3], 
    type: 'intestines',
    medicalColor: '#F5B682'
  },
  'pancreas': { 
    position: [0.05, 0.55, 0.08], 
    color: '#D2691E', 
    size: [0.18, 0.08, 0.1], 
    type: 'pancreas',
    medicalColor: '#E89850'
  },
  'spleen': { 
    position: [-0.42, 0.85, 0.08], 
    color: '#800020', 
    size: [0.12, 0.18, 0.1], 
    type: 'spleen',
    medicalColor: '#A52A4A'
  },
  'thyroid': { 
    position: [0, 2.15, 0.25], 
    color: '#CD5C5C', 
    size: [0.12, 0.1, 0.08], 
    type: 'thyroid',
    medicalColor: '#E88888'
  },
  'skin': { 
    position: [0, 1.2, 0], 
    color: '#FFE4C4', 
    size: [0.6, 1.6, 0.3], 
    type: 'skin',
    medicalColor: '#FDEBD0'
  },
  'bones': { 
    position: [0, 1.2, 0], 
    color: '#F5F5DC', 
    size: [0.5, 1.5, 0.25], 
    type: 'skeleton',
    medicalColor: '#FFFACD'
  },
  'eyes': { 
    position: [0, 2.7, 0.32], 
    color: '#4682B4', 
    size: [0.15, 0.08, 0.08], 
    type: 'simple',
    medicalColor: '#87CEEB',
    dual: true
  },
  'ears': { 
    position: [0, 2.55, 0], 
    color: '#FFE4C4', 
    size: [0.08, 0.12, 0.08], 
    type: 'simple',
    medicalColor: '#FDEBD0',
    dual: true
  }
}

function Organ({ name, position, color, size, selected, onClick, type, medicalColor, dual }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.0008
      
      // Smooth rotation when selected
      if (selected) {
        meshRef.current.rotation.y += 0.02
      }
      
      // Scale animation
      const targetScale = selected ? 1.25 : hovered ? 1.08 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.1
      )
    }
    
    // Glow animation
    if (glowRef.current) {
      const glowIntensity = selected ? 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.15 : 0.25
      glowRef.current.material.opacity = glowIntensity
    }
  })
  
  const createOrganGeometry = () => {
    const [sx, sy, sz] = Array.isArray(size) ? size : [size, size, size]
    
    switch(type) {
      case 'brain':
        // Complex brain shape
        return (
          <group>
            <mesh scale={[1, 1, 1]}>
              <sphereGeometry args={[sx, 32, 32]} />
              <meshStandardMaterial 
                color={selected ? '#FFD700' : color}
                roughness={0.7}
                metalness={0.1}
                emissive={selected ? '#FFD700' : medicalColor}
                emissiveIntensity={selected ? 0.6 : 0.3}
              />
            </mesh>
            {/* Brain hemispheres detail */}
            <mesh position={[-sx * 0.3, 0, 0]} scale={[0.7, 0.95, 0.9]}>
              <sphereGeometry args={[sx * 0.65, 24, 24]} />
              <meshStandardMaterial 
                color={selected ? '#FFD700' : color}
                roughness={0.75}
                metalness={0.05}
                transparent
                opacity={0.8}
                emissive={selected ? '#FFD700' : medicalColor}
                emissiveIntensity={selected ? 0.5 : 0.2}
              />
            </mesh>
            <mesh position={[sx * 0.3, 0, 0]} scale={[0.7, 0.95, 0.9]}>
              <sphereGeometry args={[sx * 0.65, 24, 24]} />
              <meshStandardMaterial 
                color={selected ? '#FFD700' : color}
                roughness={0.75}
                metalness={0.05}
                transparent
                opacity={0.8}
                emissive={selected ? '#FFD700' : medicalColor}
                emissiveIntensity={selected ? 0.5 : 0.2}
              />
            </mesh>
          </group>
        )
      
      case 'heart':
        // Heart shape
        return (
          <group rotation={[0, 0, -Math.PI / 6]}>
            <mesh scale={[1, 1.15, 0.85]}>
              <sphereGeometry args={[sx * 1.2, 32, 32]} />
              <meshStandardMaterial 
                color={selected ? '#FFD700' : color}
                roughness={0.4}
                metalness={0.2}
                emissive={selected ? '#FFD700' : medicalColor}
                emissiveIntensity={selected ? 0.8 : 0.4}
              />
            </mesh>
            <mesh position={[-sx * 0.5, sy * 0.4, 0]}>
              <sphereGeometry args={[sx * 0.7, 24, 24]} />
              <meshStandardMaterial 
                color={selected ? '#FFD700' : color}
                roughness={0.4}
                metalness={0.2}
                emissive={selected ? '#FFD700' : medicalColor}
                emissiveIntensity={selected ? 0.8 : 0.4}
              />
            </mesh>
            <mesh position={[sx * 0.5, sy * 0.4, 0]}>
              <sphereGeometry args={[sx * 0.7, 24, 24]} />
              <meshStandardMaterial 
                color={selected ? '#FFD700' : color}
                roughness={0.4}
                metalness={0.2}
                emissive={selected ? '#FFD700' : medicalColor}
                emissiveIntensity={selected ? 0.8 : 0.4}
              />
            </mesh>
          </group>
        )
      
      case 'liver':
        // Liver - irregular wedge shape
        return (
          <mesh scale={[1, 0.7, 0.9]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[sx, sy, sz]} />
            <meshStandardMaterial 
              color={selected ? '#FFD700' : color}
              roughness={0.5}
              metalness={0.15}
              emissive={selected ? '#FFD700' : medicalColor}
              emissiveIntensity={selected ? 0.6 : 0.35}
            />
          </mesh>
        )
      
      case 'kidney':
        // Bean-shaped kidney
        return (
          <mesh scale={[1, 1.3, 1]} rotation={[0, 0, Math.PI / 6]}>
            <capsuleGeometry args={[sx * 0.8, sy * 0.6, 12, 24]} />
            <meshStandardMaterial 
              color={selected ? '#FFD700' : color}
              roughness={0.5}
              metalness={0.1}
              emissive={selected ? '#FFD700' : medicalColor}
              emissiveIntensity={selected ? 0.6 : 0.3}
            />
          </mesh>
        )
      
      case 'stomach':
        // Stomach - curved pouch
        return (
          <mesh scale={[1, 1.2, 0.95]} rotation={[0.3, 0, 0]}>
            <sphereGeometry args={[sx, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.8]} />
            <meshStandardMaterial 
              color={selected ? '#FFD700' : color}
              roughness={0.6}
              metalness={0.1}
              emissive={selected ? '#FFD700' : medicalColor}
              emissiveIntensity={selected ? 0.5 : 0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      
      case 'intestines':
        // Coiled intestines
        return (
          <group>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[sx * 0.5, sx * 0.18, 16, 32]} />
              <meshStandardMaterial 
                color={selected ? '#FFD700' : color}
                roughness={0.6}
                metalness={0.1}
                emissive={selected ? '#FFD700' : medicalColor}
                emissiveIntensity={selected ? 0.5 : 0.3}
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]} scale={[0.7, 0.7, 1]}>
              <torusGeometry args={[sx * 0.35, sx * 0.15, 12, 24]} />
              <meshStandardMaterial 
                color={selected ? '#FFD700' : color}
                roughness={0.6}
                metalness={0.1}
                transparent
                opacity={0.8}
                emissive={selected ? '#FFD700' : medicalColor}
                emissiveIntensity={selected ? 0.5 : 0.3}
              />
            </mesh>
          </group>
        )
      
      case 'lungs':
        // Lung - organic cone shape
        return (
          <mesh scale={[1, 1.3, 0.8]}>
            <sphereGeometry args={[sx, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.75]} />
            <meshStandardMaterial 
              color={selected ? '#FFD700' : color}
              roughness={0.7}
              metalness={0.05}
              emissive={selected ? '#FFD700' : medicalColor}
              emissiveIntensity={selected ? 0.5 : 0.25}
            />
          </mesh>
        )
      
      default:
        // Default ellipsoid shape
        return (
          <mesh scale={[sx / sx, sy / sx, sz / sx]}>
            <sphereGeometry args={[sx, 24, 24]} />
            <meshStandardMaterial 
              color={selected ? '#FFD700' : color}
              roughness={0.5}
              metalness={0.1}
              emissive={selected ? '#FFD700' : medicalColor}
              emissiveIntensity={selected ? 0.5 : 0.3}
            />
          </mesh>
        )
    }
  }
  
  const renderContent = () => {
    if (dual && type === 'lungs') {
      const [sx] = Array.isArray(size) ? size : [size, size, size]
      return (
        <>
          <group position={[-sx * 1, 0, 0]}>
            {createOrganGeometry()}
          </group>
          <group position={[sx * 1, 0, 0]}>
            {createOrganGeometry()}
          </group>
        </>
      )
    } else if (dual && type === 'kidney') {
      const [sx] = Array.isArray(size) ? size : [size, size, size]
      return (
        <>
          <group position={[-sx * 2.5, 0, 0]}>
            {createOrganGeometry()}
          </group>
          <group position={[sx * 2.5, 0, 0]}>
            {createOrganGeometry()}
          </group>
        </>
      )
    }
    
    return createOrganGeometry()
  }
  
  return (
    <group 
      position={position} 
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      {/* Outer glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[Math.max(...(Array.isArray(size) ? size : [size])) * 1.5, 16, 16]} />
        <meshBasicMaterial 
          color={selected ? '#FFD700' : medicalColor}
          opacity={selected ? 0.4 : 0.2}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <group ref={meshRef}>
        {renderContent()}
      </group>
      
      {/* Enhanced label */}
      {(hovered || selected) && (
        <Text
          position={[0, Math.max(...(Array.isArray(size) ? size : [size])) + 0.25, 0]}
          fontSize={selected ? 0.16 : 0.13}
          color={selected ? '#FFD700' : '#FFFFFF'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {name.toUpperCase()}
        </Text>
      )}
    </group>
  )
}

// Interactive Body Region Component
function BodyRegion({ id, position, size, name, isPainPoint, onTogglePain, hovered, onHover }) {
  const meshRef = useRef()
  const [localHover, setLocalHover] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      const targetOpacity = isPainPoint ? 0.7 : (localHover ? 0.3 : 0.15)
      meshRef.current.material.opacity = THREE.MathUtils.lerp(
        meshRef.current.material.opacity,
        targetOpacity,
        0.1
      )
    }
  })
  
  const [sx, sy, sz] = size
  
  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onTogglePain(id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setLocalHover(true)
          onHover(id, name)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setLocalHover(false)
          onHover(null, null)
          document.body.style.cursor = 'default'
        }}
      >
        <boxGeometry args={[sx, sy, sz]} />
        <meshStandardMaterial
          color={isPainPoint ? '#FF0000' : '#00BFFF'}
          transparent
          opacity={isPainPoint ? 0.7 : 0.15}
          emissive={isPainPoint ? '#FF0000' : '#00BFFF'}
          emissiveIntensity={isPainPoint ? 0.8 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outline for better visibility */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(sx, sy, sz)]} />
        <lineBasicMaterial 
          color={isPainPoint ? '#FF0000' : localHover ? '#FFFFFF' : '#4DD0E1'} 
          opacity={isPainPoint ? 0.9 : localHover ? 0.6 : 0.3}
          transparent
          linewidth={2}
        />
      </lineSegments>
      
      {/* Pain indicator */}
      {isPainPoint && (
        <mesh position={[0, sy / 2 + 0.1, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>
      )}
    </group>
  )
}

// Detailed Anatomical Body Mesh - Medical Reference Style
function AnatomicalBody({ painPoints }) {
  const bodyRef = useRef()
  
  useFrame((state) => {
    if (bodyRef.current) {
      // Subtle breathing
      const breathe = Math.sin(state.clock.elapsedTime * 0.6) * 0.008
      bodyRef.current.scale.set(1, 1 + breathe, 1)
    }
  })
  
  return (
    <group ref={bodyRef}>
      {/* SKIN LAYER - Translucent */}
      <mesh>
        <capsuleGeometry args={[0.58, 3.2, 32, 64]} />
        <meshPhysicalMaterial
          color="#FFD5C2"
          transparent
          opacity={0.12}
          metalness={0.05}
          roughness={0.7}
          transmission={0.85}
          thickness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* MUSCLE LAYER - Visible through skin */}
      <group>
        {/* Torso muscles */}
        <mesh position={[0.22, 1.4, 0.32]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.28, 0.65, 0.12]} />
          <meshStandardMaterial color="#B8524D" transparent opacity={0.25} />
        </mesh>
        <mesh position={[-0.22, 1.4, 0.32]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.28, 0.65, 0.12]} />
          <meshStandardMaterial color="#B8524D" transparent opacity={0.25} />
        </mesh>
        
        {/* Abdominal muscles */}
        <mesh position={[0, 0.7, 0.35]}>
          <boxGeometry args={[0.42, 0.65, 0.08]} />
          <meshStandardMaterial color="#C97370" transparent opacity={0.22} />
        </mesh>
        
        {/* Shoulder muscles */}
        <mesh position={[0.5, 1.85, 0.08]} rotation={[0, 0, 0.3]}>
          <sphereGeometry args={[0.2, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color="#B34D4D" transparent opacity={0.28} />
        </mesh>
        <mesh position={[-0.5, 1.85, 0.08]} rotation={[0, 0, -0.3]}>
          <sphereGeometry args={[0.2, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
          <meshStandardMaterial color="#B34D4D" transparent opacity={0.28} />
        </mesh>
        
        {/* Back muscles */}
        <mesh position={[0, 1.3, -0.35]}>
          <boxGeometry args={[0.48, 0.75, 0.08]} />
          <meshStandardMaterial color="#A84848" transparent opacity={0.24} />
        </mesh>
        
        {/* Leg muscles */}
        <mesh position={[0.28, -0.7, 0.22]}>
          <capsuleGeometry args={[0.15, 0.6, 16, 32]} />
          <meshStandardMaterial color="#C06060" transparent opacity={0.26} />
        </mesh>
        <mesh position={[-0.28, -0.7, 0.22]}>
          <capsuleGeometry args={[0.15, 0.6, 16, 32]} />
          <meshStandardMaterial color="#C06060" transparent opacity={0.26} />
        </mesh>
        
        {/* Calf muscles */}
        <mesh position={[0.28, -1.7, -0.08]} rotation={[0.2, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.45, 12, 24]} />
          <meshStandardMaterial color="#B35555" transparent opacity={0.24} />
        </mesh>
        <mesh position={[-0.28, -1.7, -0.08]} rotation={[0.2, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.45, 12, 24]} />
          <meshStandardMaterial color="#B35555" transparent opacity={0.24} />
        </mesh>
      </group>
      
      {/* SKELETAL STRUCTURE - Hints */}
      <group>
        {/* Skull */}
        <mesh position={[0, 2.65, 0]}>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshStandardMaterial 
            color="#FFFACD" 
            transparent 
            opacity={0.18} 
            emissive="#FFFACD"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Spine */}
        <mesh position={[0, 0.5, -0.32]}>
          <cylinderGeometry args={[0.035, 0.035, 2.8, 16]} />
          <meshStandardMaterial color="#FFF8DC" transparent opacity={0.22} />
        </mesh>
        
        {/* Rib cage */}
        {[...Array(10)].map((_, i) => {
          const yPos = 1.6 - i * 0.14
          const scale = 1 - Math.abs(i - 4.5) * 0.1
          return (
            <group key={i} position={[0, yPos, -0.22]}>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.38 * scale, 0.012, 8, 24, Math.PI * 0.95]} />
                <meshStandardMaterial color="#FFF5E6" transparent opacity={0.18} />
              </mesh>
            </group>
          )
        })}
        
        {/* Pelvis */}
        <mesh position={[0, -0.08, -0.22]}>
          <torusGeometry args={[0.35, 0.08, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#FFF8DC" transparent opacity={0.2} />
        </mesh>
        
        {/* Femur bones */}
        <mesh position={[0.28, -0.85, -0.15]}>
          <cylinderGeometry args={[0.045, 0.05, 0.8, 16]} />
          <meshStandardMaterial color="#FFFACD" transparent opacity={0.18} />
        </mesh>
        <mesh position={[-0.28, -0.85, -0.15]}>
          <cylinderGeometry args={[0.045, 0.05, 0.8, 16]} />
          <meshStandardMaterial color="#FFFACD" transparent opacity={0.18} />
        </mesh>
        
        {/* Tibia/Fibula */}
        <mesh position={[0.28, -1.7, -0.18]}>
          <cylinderGeometry args={[0.035, 0.038, 0.5, 12]} />
          <meshStandardMaterial color="#FFF5E6" transparent opacity={0.16} />
        </mesh>
        <mesh position={[-0.28, -1.7, -0.18]}>
          <cylinderGeometry args={[0.035, 0.038, 0.5, 12]} />
          <meshStandardMaterial color="#FFF5E6" transparent opacity={0.16} />
        </mesh>
      </group>
      
      {/* Body contour outline */}
      <mesh>
        <capsuleGeometry args={[0.62, 3.25, 8, 16]} />
        <meshBasicMaterial 
          color="#4DD0E1" 
          wireframe 
          transparent 
          opacity={0.15} 
        />
      </mesh>
    </group>
  )
}

export default function HumanBody({ organs, selectedOrgan, onOrganClick, painPoints = [], onPainPointsChange, affectedOrgans = [], medicalRecords = [] }) {
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [hoveredName, setHoveredName] = useState(null)
  const [localPainPoints, setLocalPainPoints] = useState(painPoints)
  
  const handleTogglePain = (regionId) => {
    const newPainPoints = localPainPoints.includes(regionId)
      ? localPainPoints.filter(id => id !== regionId)
      : [...localPainPoints, regionId]
    
    setLocalPainPoints(newPainPoints)
    if (onPainPointsChange) {
      onPainPointsChange(newPainPoints)
   }
  }
  
  const handleHover = (regionId, name) => {
    setHoveredRegion(regionId)
    setHoveredName(name)
  }
  
  return (
    <group>
      {/* Anatomical body mesh */}
      <AnatomicalBody painPoints={localPainPoints} />
      
      {/* Render actual organs */}
      {organs.map((organ) => {
        const organPos = organPositions[organ.name]
        if (!organPos) return null
        
        const isAffected = affectedOrgans.includes(organ.name)
        const isSelected = selectedOrgan === organ.id
        
        return (
          <group key={organ.id}>
            <Organ
              name={organ.displayName}
              position={organPos.position}
              color={isAffected ? '#FF0000' : organPos.color}
              size={organPos.size}
              selected={isSelected}
              onClick={() => onOrganClick(organ.id)}
              type={organPos.type}
              medicalColor={isAffected ? '#FF4444' : organPos.medicalColor}
              dual={organPos.dual}
            />
            {/* Warning indicator for affected organs */}
            {isAffected && !isSelected && (
              <Text
                position={[organPos.position[0], organPos.position[1] + 0.3, organPos.position[2]]}
                fontSize={0.15}
                color="#FF0000"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
                fontWeight="bold"
              >
                ⚠
              </Text>
            )}
          </group>
        )
      })}
      
      {/* Interactive pain point regions */}
      {Object.entries(bodyRegions).map(([id, region]) => (
        <BodyRegion
          key={id}
          id={id}
          position={region.position}
          size={region.size}
          name={region.name}
          isPainPoint={localPainPoints.includes(id)}
          onTogglePain={handleTogglePain}
          hovered={hoveredRegion === id}
          onHover={handleHover}
        />
      ))}
      
      {/* Instructions overlay */}
      {hoveredName && (
        <Text
          position={[0, 3.2, 0]}
          fontSize={0.18}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {hoveredName}
        </Text>
      )}
      
      {/* Legend */}
      <Text
        position={[-1.5, 2.8, 0]}
        fontSize={0.12}
        color="#00BFFF"
        anchorX="left"
        anchorY="top"
        maxWidth={1.5}
      >
        Click to mark pain areas
      </Text>
      
      <Text
        position={[-1.5, 2.6, 0]}
        fontSize={0.1}
        color="#FF0000"
        anchorX="left"
        anchorY="top"
      >
        ● Affected Organ / Pain
      </Text>
      
      <Text
        position={[-1.5, 2.45, 0]}
        fontSize={0.1}
        color="#00BFFF"
        anchorX="left"
        anchorY="top"
      >
        ● Healthy / Normal
      </Text>
      
      {affectedOrgans.length > 0 && (
        <Text
          position={[-1.5, 2.2, 0]}
          fontSize={0.11}
          color="#FF0000"
          anchorX="left"
          anchorY="top"
          maxWidth={1.5}
        >
          {`⚠ ${affectedOrgans.length} organ${affectedOrgans.length > 1 ? 's' : ''} affected`}
        </Text>
      )}
      
      {localPainPoints.length > 0 && (
        <Text
          position={[-1.5, 1.95, 0]}
          fontSize={0.11}
          color="#FFD700"
          anchorX="left"
          anchorY="top"
          maxWidth={1.5}
        >
          {`${localPainPoints.length} pain point${localPainPoints.length > 1 ? 's' : ''} marked`}
        </Text>
      )}
    </group>
  )
}
