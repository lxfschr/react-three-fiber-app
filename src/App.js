import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useResource } from 'react-three-fiber'
import { OrbitControls, TransformControls } from 'drei'
import { Controls, useControl } from "react-three-gui"
import "./AppController"
import AppController from './AppController'


const MeshView = ({mesh}) => {
  const getThreeJsMeshBasedOnType = () => {
    switch (mesh.type) {
      case "BOX": return <boxGeometry args={mesh.parameters.size} />
      case "SPHERE": return <sphereGeometry args={[mesh.parameters.radius, mesh.parameters.widthSegments, mesh.parameters.heightSegments]} />
      default: throw new Error("No associated ThreeJs geometry for type ", mesh.type)
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

  const onClick= (e) => {
    if (node.children && (e.ctrlKey || e.metaKey)) {
      e.stopPropagation();
    }
    AppController.instance.selectedItem = node;
    setActive(!active)
  }

  return (
    <group
      position={node.position}
      rotation={node.rotation}
      scale={node.scale}
      onClick={onClick}>
      {node.mesh && <MeshView mesh={node.mesh} />}
      {node.children.map((child, i) => { return <NodeView key={i} node={child} /> })}
    </group>
  )
}

const SceneTransformableView = ({ active, children, orbitControls }) => {
  const transformControls = useRef()
  const mode = useControl("mode", { type: "select", items: ["translate", "rotate", "scale"] })

  
  const selItem = AppController.instance.selectedItem;

  const [xPosition, setXPosition] = useState(selItem && selItem.position[0]);
  const [yPosition, setYPosition] = useState(selItem && selItem.position[1]);
  const [zPosition, setZPosition] = useState(selItem && selItem.position[2]);

  const [xRotation, setXRotation] = useState(selItem && selItem.rotation[0]);
  const [yRotation, setYRotation] = useState(selItem && selItem.rotation[0]);
  const [zRotation, setZRotation] = useState(selItem && selItem.rotation[0]);

  const [xScale, setXScale] = useState(selItem && selItem.scale[0]);
  const [yScale, setYScale] = useState(selItem && selItem.scale[0]);
  const [zScale, setZScale] = useState(selItem && selItem.scale[0]);

  const rotationX = useControl('Position X', { type: 'number', state: [xPosition, setXPosition], });


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

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, -10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      {AppController.instance.sceneItems.filter((item) => item !== AppController.instance.selectedItem).map((item, i) => { console.log("item: ", item); return <NodeView key={i} node={item} /> })}
      {AppController.instance.selectedItem && <SceneTransformableView active={true} orbitControls={orbitControls} >
        <NodeView node={AppController.instance.selectedItem} />
      </SceneTransformableView>}
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