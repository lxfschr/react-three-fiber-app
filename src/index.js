import ReactDOM from 'react-dom'
import React from 'react'
import { Canvas } from 'react-three-fiber'
import './styles.css'
import { TransformControls } from 'drei'

// Click and drag parts of the control to move

const Scene = () => (
  <Canvas pixelRatio={window.devicePixelRatio} camera={{ position: [10, 10, 10] }}>
    <gridHelper />
    <TransformControls>
      <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} dispose={null}>
        <mesh>
          <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
          <meshNormalMaterial attach="material" />
          <mesh position={[0, -7, 0]}>
          <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
          <meshNormalMaterial attach="material" />
        </mesh>
        </mesh>
      </group>
    </TransformControls>
  </Canvas>
)

ReactDOM.render(<Scene />, document.getElementById('root'))
