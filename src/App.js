import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import './styles.css'
import { OrbitControls, TransformControls } from 'drei'

const Box = ({position, size}) => {
  const mesh = useRef() // Gives access to mesh
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [color, setColor] = useState('black')
  const hoverColor = 'gray'
  const activeColor = 'cyan'

  const getColor = () => {
    if (active) return activeColor;
    if (hovered) return hoverColor;
    return color;
  }

  return (
    <mesh
      position={position}
      onClick={(e) => setActive(!active)}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={getColor()} />
    </mesh>
  )
}
  
const Main = () => {
  const orbit = useRef()
  const transform = useRef()

  useEffect(() => {
    if (transform.current) {
      const controls = transform.current
      // controls.setMode(mode)
      const callback = event => (orbit.current.enabled = !event.value)
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
  })
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <gridHelper />
      <TransformControls ref={transform}>
        <group position={[0, 0, 0]} rotation={[0, 0, 0]} dispose={null}>
          <Box position={[-1.2, 0, 0]} size={[1, 2, 1]} />
          <Box position={[0, 0, 0]} size={[1, 1.5, 1]}  />
          <Box position={[1.2, 0, 0]} size={[1, 1.75, 1]}  />
        </group>
      </TransformControls>
      <OrbitControls ref={orbit} enabledDamping dampingFactor={1} rotateSpeed={1}/>
    </>
  )
}
  
export default function App() {
  return (
    <Canvas>
      <Main />
    </Canvas>
  )
}