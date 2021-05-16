import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useResource } from 'react-three-fiber'
import { OrbitControls, TransformControls } from 'drei'
import { Controls, useControl } from "react-three-gui"
import "./AppController"
import AppController from './AppController'


const MeshView = ({mesh}) => {
  const getThreeJsMeshBasedOnType = () => {
    switch (mesh.type) {
      case "BOX":
        return (
          <boxGeometry args={mesh.parameters.size} />
        )
      case "SPHERE":
        return (
          <sphereGeometry args={mesh.parameters.size} />
        )
      default:
        throw new Error("No associated ThreeJs geometry for type ", mesh.type)
    }  
  }
  
  return (
    <mesh>
      {getThreeJsMeshBasedOnType()}
      <meshStandardMaterial color={mesh.color} />
    </mesh>
  )
}

const NodeView = ({node}) => {
  // Set up state for the hovered and active state
  const [active, setActive] = useState(false)
  const [color, setColor] = useState('black')
  const activeColor = 'cyan'

  const getColor = () => {
    if (active) return activeColor;
    return color;
  }

  return (
    <group
      position={node.position}
      onClick={(e) => setActive(!active)}>
      {node.mesh && <MeshView mesh={node.mesh} />}
      {node.children.map((child, i) => { console.log("child: ", child); return <NodeView key={""+i} node={child} /> })}
    </group>
  )
}

const SceneTransformableView = ({ active, children, orbitControls }) => {
  const transformControls = useRef()
  const mode = useControl("mode", { type: "select", items: ["translate", "rotate", "scale"] })

  useEffect(() => {
   if (transformControls.current) {
      const controls = transformControls.current;
      controls.setMode(mode)
      const callback = (event) => (orbitControls.current.enabled = !event.value);
      controls.addEventListener("dragging-changed", callback);
      return () => controls.removeEventListener("dragging-changed", callback);
   }
 });

  if (!active) return children
 
  return <TransformControls ref={transformControls}>{children}</TransformControls>
}
  
const Main = () => {
  const orbitControls = useRef()
  const transform = useRef()

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, -10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      {/* <gridHelper /> */}
      <SceneTransformableView active={true} orbitControls={orbitControls} >
        {AppController.instance.sceneItems.map((item, i) => {console.log("item: ", item); return <NodeView key={""+i} node={item} /> })}
      </SceneTransformableView>
      <OrbitControls ref={orbitControls} enabledDamping dampingFactor={1} rotateSpeed={1}/>
    </>
  )
}
  
export default function App() {
  return (
    <>
      <Canvas camera={{ position: [-5, 2, 10], fov: 35 }}>
        <Main />
      </Canvas>
      <Controls />
    </>
  )
}