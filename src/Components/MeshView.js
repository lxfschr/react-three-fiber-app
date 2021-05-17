import React from "react";
import rgbToHex from "../lib/rgbToHex.js";

export default function MeshView({mesh}) {
  const getGeometryView = () => {
    const geo = mesh.geometry;
    const params = geo.parameters;
    switch (geo.type) {
      case "BoxGeometry": return <boxGeometry args={[params.width, params.height, params.depth]} />
      case "SphereGeometry": return <sphereGeometry args={[params.radius, params.widthSegments, params.heightSegments]} />
      case "ConeGeometry": return <coneGeometry args={[params.radius, params.height, params.radialSegments, params.heightSegments]} />
      case "CylinderGeometry": return <cylinderGeometry args={[params.radiusTop, params.radiusBottom, params.height, params.radialSegments, params.heightSegments]} />
      case "TetrahedronGeometry": return <tetrahedronGeometry args={[params.radius]} />
      default: throw new Error("No associated ThreeJs geometry for type ", mesh.type)
    }  
  }

  const materialColorHexStr = mesh.material && rgbToHex(mesh.material.color.r, mesh.material.color.g, mesh.material.color.b);
  
  return (
    <mesh matrix={mesh.matrix}>
      {getGeometryView()}
      <meshStandardMaterial color={materialColorHexStr} opacity={mesh.material.opacity} transparent={mesh.material.transparent} />
    </mesh>
  );
}