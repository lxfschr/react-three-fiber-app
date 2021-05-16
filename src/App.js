import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useResource } from 'react-three-fiber'
import { OrbitControls, TransformControls } from 'drei'
import { Controls, useControl } from "react-three-gui"
import Mesh from "./Mesh.js"
import Node from "./Node.js"

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

const NodeView = ({node, onSelect}) => {

  const onClick= (e) => {
    if (node.children && (e.ctrlKey || e.metaKey)) {
      e.stopPropagation();
    }
    onSelect(node);
  }

  return (
    <group
      position={node.position}
      rotation={node.rotation}
      scale={node.scale}
      onClick={onClick}>
      {node.mesh && <MeshView mesh={node.mesh} />}
      {node.children.map((child, i) => { return <NodeView key={i} node={child} onSelect={onSelect} /> })}
    </group>
  )
}

const SceneTransformableView = ({ selectedItem, children, orbitControls }) => {
  const transformControls = useRef()
  const mode = useControl("mode", { type: "select", items: ["translate", "rotate", "scale"] })

  const selItem = selectedItem;

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
 
  return <TransformControls ref={transformControls} onUpdate={(self) => {console.log("update ", self);}}>{children}</TransformControls>
}
  
const Main = ({sceneItems, selectedItem, onSelect}) => {
  const orbitControls = useRef()

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, -10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      {sceneItems.filter((item) => item !== selectedItem).map((item, i) => { console.log("item: ", item); return <NodeView key={i} node={item} onSelect={onSelect} /> })}
      {selectedItem && <SceneTransformableView selectedItem={selectedItem} orbitControls={orbitControls} >
        <NodeView node={selectedItem} onSelect={onSelect} />
      </SceneTransformableView>}
      <OrbitControls ref={orbitControls} enabledDamping dampingFactor={1} rotateSpeed={1}/>
    </>
  )
}
  
export default function App() {
  const sceneItemsArray = [];

  const meterIcon = new Node(
    [
      new Node([], new Mesh("BOX", {size: [0.7, 2, 0.7]}), [-0.8, 0, 0]),
      new Node([], new Mesh("BOX", {size: [0.7, 1.5, 0.7]}), [0, 0.25, 0]),
      new Node([], new Mesh("BOX", {size: [0.7, 1.8, 0.7]}), [0.8, 0.1, 0]),
    ]
  );

  const sphere = new Node([], new Mesh("SPHERE", {radius: 1, widthSegments: 32, heightSegments: 32}, '#2c3ab7'), [0, 3, 0]);
  const sphere2 = new Node([], new Mesh("SPHERE", {radius: 1, widthSegments: 32, heightSegments: 32}, '#c800ff'), [0, -3, 0]);
  sceneItemsArray.push(meterIcon);
  sceneItemsArray.push(sphere);
  sceneItemsArray.push(sphere2);

  const [sceneItems, setSceneItems] = useState(sceneItemsArray);

  const [selectedItem, setSelectedItem] = useState();

  const onSelect = (item) => {
    console.log("adbg ~ file: App.js ~ line 122 ~ onSelect ~ item", item)
    setSelectedItem(item);
  }

  return (
    <>
      <Canvas camera={{ position: [-5, 2, 10], fov: 35 }}>
        <Main sceneItems={sceneItems} selectedItem={selectedItem} onSelect={onSelect} />
      </Canvas>
      <Controls />
    </>
  )
}