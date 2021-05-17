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
      case "CylinderGeometry": return <cylinderGeometry args={[params.radiusTop, params.radiusBottom, params.height, params.radialSegments, params.heightSegments]} />
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
  const onClick = (e) => {
    e.stopPropagation();
    // if (node.children && (e.ctrlKey || e.metaKey)) {
    //   e.stopPropagation();
    // }
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

const SceneTransformableView = ({ selectedItem, sceneItems, orbitControls, onChange }) => {
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

  useEffect(() => {
    if (!selectedItem) return;
    console.log("adbg ~ file: App.js ~ line 90 ~ SceneTransformableView ~ selectedItem.position", selectedItem.position)
    setXPosition(selectedItem.position.x);
    setYPosition(selectedItem.position.y);
    setZPosition(selectedItem.position.z);
  }, [selectedItem.position]);

  const onPositionChange = (val, componentName) => {
    if (val === undefined) return;
    console.log("adbg ~ file: App.js ~ line 96 ~ onPositionChange ~ val", val)
    const selectedItemPosition = selectedItem.position;
    selectedItemPosition[componentName] = val;
    selectedItem.position.copy(selectedItemPosition);
    selectedItem.updateMatrix();
    onChange(selectedItem);
  }

  const positionX = useControl('Position X', { type: 'number', state: [xPosition, setXPosition], onChange: (val) => onPositionChange(val, "x")});
  const positionY = useControl('Position Y', { type: 'number', state: [yPosition, setYPosition], onChange: (val) => onPositionChange(val, "y")});
  const positionZ = useControl('Position Z', { type: 'number', state: [zPosition, setZPosition], onChange: (val) => onPositionChange(val, "z")});

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
    const controls = transformControls.current;
    controls.attach(selectedItem);
    const callback = (event) => {
      onChange(event.target.object);
    };
    controls.addEventListener("objectChange", callback);
    return () => {
      // controls.detach(selectedItem)
      controls.removeEventListener("objectChange", callback);
    };
  }
}, [selectedItem, onChange]);
 
  return (
    <TransformControls ref={transformControls} />
  );
}
  
const Scene = () => {
  const orbitControls = useRef();
  const { scene } = useThree();

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

  meterObjectLeft.position.copy( new THREE.Vector3(-0.8, 1, 0) );
  meterObjectLeft.scale.copy( new THREE.Vector3(0.7, 2, 0.7) );

  meterObjectMid.position.copy( new THREE.Vector3(0, 1.25, 0) );
  meterObjectMid.scale.copy( new THREE.Vector3(0.7, 1.5, 0.7) );

  meterObjectRight.position.copy( new THREE.Vector3(0.8, 1.1, 0) );
  meterObjectRight.scale.copy( new THREE.Vector3(0.7, 1.8, 0.7) );

  const cylinderMaterial = new THREE.MeshBasicMaterial( {color: 0x2c3ab7} );
  const cylinderGeometry = new THREE.CylinderGeometry( 3, 3, 0.1, 32, 1 );
  const cylinderMesh = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
  const cylinderObject = new THREE.Object3D();
  cylinderObject.position.copy( new THREE.Vector3(0, -1, 0) );
  cylinderObject.add(cylinderMesh);

  cylinderObject.add(meterObjectLeft);
  cylinderObject.add(meterObjectMid);
  cylinderObject.add(meterObjectRight);

  for (const obj of cylinderObject.children) {
    obj.updateMatrix();
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
  const coneQuaternion = new THREE.Quaternion();
  coneQuaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI);
  coneObject.rotation.copy( new THREE.Euler( Math.PI / 2, 1, 0, 'XYZ' ) );
  coneObject.position.copy( new THREE.Vector3(0, 0, 5) );
  coneObject.updateMatrix();
  coneObject.add(coneMesh);

  sceneItemsArray.push(cylinderObject);
  sceneItemsArray.push(sphereObject);
  sceneItemsArray.push(coneObject);

  const [sceneItems, setSceneItems] = useState(sceneItemsArray);

  for (const item of sceneItems) {
    scene.add(item);
  }

  const [selectedItem, setSelectedItem] = useState();

  const onSelect = (item) => {
    console.log("adbg ~ file: App.js ~ line 122 ~ onSelect ~ item", item)
    setSelectedItem(item);
  }

  const onTransformableChange = (object) => {
    console.log("adbg ~ file: App.js ~ line 143 ~ onTransformableChange ~ object", object)
    const newSceneItems = [];
    for (const item of sceneItems) {
      if (item.uuid === object.uuid) {
        console.log("SAME!")
        newSceneItems.push(object);
      } else {
        newSceneItems.push(item)
      }
    }
    setSceneItems(newSceneItems);
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, -10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      {sceneItems.map((item, i) => <NodeView key={i} node={item} onSelect={onSelect} /> )}
      {selectedItem && <SceneTransformableView selectedItem={selectedItem} sceneItems={sceneItems} orbitControls={orbitControls} onChange={onTransformableChange} >
      </SceneTransformableView>}
      <OrbitControls ref={orbitControls} enabledDamping dampingFactor={1} rotateSpeed={1}/>
    </>
  )
}
  
export default function App() {
  return (
    <>
      <Canvas camera={{ position: [-20, 5, 20], fov: 35 }}>
        <Scene />
      </Canvas>
      <Controls />
    </>
  )
}