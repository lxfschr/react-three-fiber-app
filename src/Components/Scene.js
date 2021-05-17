import React, { useRef, useState } from "react"
import { useThree } from "react-three-fiber"
import { OrbitControls } from "drei"
import * as THREE from "three";
import SceneTransformable from "./SceneTransformable.js";
import NodeView from "./NodeView.js";

export default function Scene() {
  const { scene } = useThree();

  const meterMaterial = new THREE.MeshStandardMaterial( {color: 0xf0f0f0, transparent: true} );
  const tetrahedronMaterial = new THREE.MeshStandardMaterial( {color: 0xff0000} );
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMeshLeft = new THREE.Mesh(boxGeometry, meterMaterial);
  const boxMeshMid = new THREE.Mesh(boxGeometry, meterMaterial);
  const boxMeshRight = new THREE.Mesh(boxGeometry, meterMaterial);
  const tetrahedronGeometry = new THREE.TetrahedronGeometry(0.33);
  const tetrahedronMesh = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);

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
  meterObjectMid.add(tetrahedronMesh); // Shhhh it's a secret

  meterObjectRight.position.copy( new THREE.Vector3(0.8, 1.1, 0) );
  meterObjectRight.scale.copy( new THREE.Vector3(0.7, 1.8, 0.7) );

  const cylinderMaterial = new THREE.MeshStandardMaterial( {color: 0x2c3ab7, transparent: true} );
  const cylinderGeometry = new THREE.CylinderGeometry( 3, 3, 0.1, 32, 1 );
  const cylinderMesh = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
  const cylinderObject = new THREE.Object3D();
  cylinderObject.position.copy( new THREE.Vector3(0, -1, 0) );
  cylinderObject.updateMatrix();
  cylinderObject.add(cylinderMesh);
  cylinderObject.add(meterObjectLeft);
  cylinderObject.add(meterObjectMid);
  cylinderObject.add(meterObjectRight);

  for (const obj of cylinderObject.children) {
    obj.updateMatrix();
  }

  const coneMaterial = new THREE.MeshStandardMaterial( {color: 0xc800ff, transparent: true} );
  const coneGeometry = new THREE.ConeGeometry( 1, 2, 32, 32 );
  const coneMesh = new THREE.Mesh( coneGeometry, coneMaterial );
  const coneObject = new THREE.Object3D();
  const coneQuaternion = new THREE.Quaternion();
  coneQuaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI);
  coneObject.rotation.copy( new THREE.Euler( Math.PI / 2, 1, 0, 'XYZ' ) );
  coneObject.position.copy( new THREE.Vector3(0, 0, 5) );
  coneObject.updateMatrix();
  coneObject.add(coneMesh);

  const [sceneItems, setSceneItems] = useState([cylinderObject, coneObject]);

  for (const item of sceneItems) {
    scene.add(item);
  }

  const [selectedItem, setSelectedItem] = useState(); // No selection to begin with

  const onSelect = (item) => {
    setSelectedItem(item);
  }

  const onTransformableChange = (object) => {
    const newSceneItems = [];
    for (const item of sceneItems) {
      if (item.uuid === object.uuid) {
        newSceneItems.push(object);
      } else {
        newSceneItems.push(item)
      }
    }
    setSceneItems(newSceneItems);
  }

  const orbitControls = useRef(); // Pass into SceneTransformable to prevent orbiting while dragging transform controls

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, -10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      {sceneItems.map((item, i) => <NodeView key={i} node={item} onSelect={onSelect} /> )}
      {selectedItem && <SceneTransformable selectedItem={selectedItem} orbitControls={orbitControls} onChange={onTransformableChange} />}
      <OrbitControls ref={orbitControls} enabledDamping dampingFactor={1} rotateSpeed={1}/>
    </>
  )
}