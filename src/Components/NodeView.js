
import React from "react";
import MeshView from "./MeshView.js";

export default function NodeView({node, onSelect}) {
  const onClick = (e) => {
    e.stopPropagation();
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