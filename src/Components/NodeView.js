
import React from "react";
import MeshView from "./MeshView.js";

export default function NodeView({node, onSelect}) {
  const onClick = (e) => {
    e.stopPropagation(); // Stop event from triggering on parent items so you can direct select children
    onSelect(node); // Callback to Scene to update sceneItems
  }

  // Recursive component end condition. Assume only Meshes for now.
  if (node.children.length === 0) {
    if (node.type === "Mesh") {
      return <MeshView mesh={node} />
    }
  }

  // Assume only Meshes and Object3Ds are in the scene.
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