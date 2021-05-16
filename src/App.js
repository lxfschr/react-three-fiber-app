import React, { useEffect, useRef, useState } from "react"
import { Canvas, useResource, useThree } from "react-three-fiber"
import { OrbitControls, TransformControls } from "drei"
import { Controls, useControl } from "react-three-gui"
import * as THREE from "three";
import rgbToHex from "./lib/rgbToHex.js";

  const MeshView = ({mesh}) => {
  const getThreeJsMeshBasedOnType = () => {
    const geo = mesh.geometry;
    const params = geo.parameters;
    switch (geo.type) {
      case "BoxGeometry": return <boxGeometry args={[params.width, params.height, params.depth]} />
      case "SphereGeometry": return <sphereGeometry args={[params.radius, params.widthSegments, params.heightSegments]} />
      case "ConeGeometry": return <coneGeometry args={[params.radius, params.height, params.radialSegments, params.heightSegments]} />
      default: throw new Error("No associated ThreeJs geometry for type ", mesh.type)
    }  
  }

  const materialColorHexStr = mesh.material && rgbToHex(mesh.material.color.r, mesh.material.color.g, mesh.material.color.b);
  
  return (
    <mesh matrix={mesh.matrix}>
      {getThreeJsMeshBasedOnType()}
      <meshStandardMaterial color={materialColorHexStr} />
    </mesh>
  );
}

const NodeView = ({node, onSelect}) => {

  const onClick= (e) => {
    if (node.children && (e.ctrlKey || e.metaKey)) {
      e.stopPropagation();
    }
    onSelect(node);
  }

  if (node.children.length === 0) {
    if (node.type === "Mesh") {
      return <MeshView mesh={node} />
    }
  }

  if (node.type === "Object3D") {
    return (
      <object3D
        position={[node.position.x, node.position.y, node.position.z]}
        rotation={[node.rotation.x, node.rotation.y, node.rotation.z]}
        scale={[node.scale.x, node.scale.y, node.scale.z]}
        onClick={onClick}>
        {node.children.map((child, i) => { return <NodeView key={i} node={child} onSelect={onSelect} /> })}
      </object3D>
    );
  }

  return (
    <group
      position={[node.position.x, node.position.y, node.position.z]}
      rotation={[node.rotation.x, node.rotation.y, node.rotation.z]}
      scale={[node.scale.x, node.scale.y, node.scale.z]}
      onClick={onClick}>
      {node.children.map((child, i) => { return <NodeView key={i} node={child} onSelect={onSelect} /> })}
    </group>
  );
}

const SceneTransformableView = ({ selectedItem, children, orbitControls, onChange }) => {
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
      controls.setMode(mode);
      const callback = (event) => (orbitControls.current.enabled = !event.value);
      controls.addEventListener("dragging-changed", callback);
      return () => controls.removeEventListener("dragging-changed", callback);
   }
 });

 useEffect(() => {
  if (transformControls.current) {
    console.log("adbg ~ file: App.js ~ line 102 ~ useEffect ~ selectedItem", selectedItem)
    const controls = transformControls.current;
    controls.attach(selectedItem);
    const callback = (event) => {
      onChange(event.target.object.position);
    };
    controls.addEventListener("objectChange", callback);
    return () => {
      // controls.detach(selectedItem)
      controls.removeEventListener("objectChange", callback);
    };
  }
}, [selectedItem, onChange]);
 
  return (
    <TransformControls 
      ref={transformControls} 
      on
      onUpdate={(self) => {console.log("update ", self);}}>
      {children}
    </TransformControls>
  );
}
  
const Main = ({sceneItems, selectedItem, onSelect, onTransformableChange}) => {
  const orbitControls = useRef();

  const { camera, gl, scene } = useThree();

  for (const item of sceneItems) {
    scene.add(item);
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, -10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      {sceneItems.map((item, i) => { console.log("item: ", item); return <NodeView key={i} node={item} onSelect={onSelect} /> })}
      {selectedItem && <SceneTransformableView selectedItem={selectedItem} orbitControls={orbitControls} onChange={onTransformableChange} >
      </SceneTransformableView>}
      <OrbitControls ref={orbitControls} enabledDamping dampingFactor={1} rotateSpeed={1}/>
    </>
  )
}
  
export default function App() {
  const sceneItemsArray = [];

  const meterMaterial = new THREE.MeshBasicMaterial( {color: 0xf0f0f0} );
  const boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
  const boxMeshLeft = new THREE.Mesh( boxGeometry, meterMaterial );
  const boxMeshMid = new THREE.Mesh( boxGeometry, meterMaterial );
  const boxMeshRight = new THREE.Mesh( boxGeometry, meterMaterial );

  const meterObjectLeft = new THREE.Object3D();
  const meterObjectMid = new THREE.Object3D();
  const meterObjectRight = new THREE.Object3D();
  meterObjectLeft.add(boxMeshLeft);
  meterObjectMid.add(boxMeshMid);
  meterObjectRight.add(boxMeshRight);

  meterObjectLeft.position.copy( new THREE.Vector3(-0.8, 0, 0) );
  meterObjectLeft.scale.copy( new THREE.Vector3(0.7, 2, 0.7) );

  meterObjectMid.position.copy( new THREE.Vector3(0, 0.25, 0) );
  meterObjectMid.scale.copy( new THREE.Vector3(0.7, 1.5, 0.7) );

  meterObjectRight.position.copy( new THREE.Vector3(0.8, 0.1, 0) );
  meterObjectRight.scale.copy( new THREE.Vector3(0.7, 1.8, 0.7) );

  const meterLogoGroup = new THREE.Group();
  meterLogoGroup.add( meterObjectLeft );
  meterLogoGroup.add( meterObjectMid );
  meterLogoGroup.add( meterObjectRight );

  for (const obj of meterLogoGroup.children) {
    meterObjectLeft.updateMatrix();
  }

  const sphereMaterial = new THREE.MeshBasicMaterial( {color: 0x2c3ab7} );
  const sphereGeometry = new THREE.SphereGeometry( 1, 32, 32 );
  const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
  const sphereObject = new THREE.Object3D();
  sphereObject.position.copy( new THREE.Vector3(0, 3, 0) );
  sphereObject.updateMatrix();
  sphereObject.add(sphereMesh);

  const coneMaterial = new THREE.MeshBasicMaterial( {color: 0xc800ff} );
  const coneGeometry = new THREE.ConeGeometry( 1, 2, 32, 32 );
  const coneMesh = new THREE.Mesh( coneGeometry, coneMaterial );
  const coneObject = new THREE.Object3D();
  coneObject.position.copy( new THREE.Vector3(0, -3, 0) );
  coneObject.updateMatrix();
  coneObject.add(coneMesh);

  sceneItemsArray.push(meterLogoGroup);
  sceneItemsArray.push(sphereObject);
  sceneItemsArray.push(coneObject);

  const [sceneItems, setSceneItems] = useState(sceneItemsArray);

  const [selectedItem, setSelectedItem] = useState();

  const onSelect = (item) => {
    console.log("adbg ~ file: App.js ~ line 122 ~ onSelect ~ item", item)
    setSelectedItem(item);
  }

  const onTransformableChange = (position) => {
    console.log("adbg ~ file: App.js ~ line 143 ~ onTransformableChange ~ position", position)
    const newItem = selectedItem;
    console.log("adbg ~ file: App.js ~ line 145 ~ onTransformableChange ~ selectedItem", selectedItem)
    // newItem.position = position;
    console.log("adbg ~ file: App.js ~ line 147 ~ onTransformableChange ~ newItem", newItem)
    setSceneItems([...sceneItems.filter((item) => item !== selectedItem), newItem]);
  }



  return (
    <>
      <Canvas camera={{ position: [-5, 2, 10], fov: 35 }}>
        <Main sceneItems={sceneItems} selectedItem={selectedItem} onSelect={onSelect} onTransformableChange={onTransformableChange} />
      </Canvas>
      <Controls />
    </>
  )
}