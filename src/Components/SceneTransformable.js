
import React, { useRef, useEffect, useState } from "react";
import { useControl } from "react-three-gui";
import { TransformControls } from "drei"

export default function SceneTransformable({ selectedItem, orbitControls, onChange }) {
    const transformControls = useRef();
  
    const selItem = selectedItem;
  
    const [xPosition, setXPosition] = useState(selItem && selItem.position[0]);
    const [yPosition, setYPosition] = useState(selItem && selItem.position[1]);
    const [zPosition, setZPosition] = useState(selItem && selItem.position[2]);
  
    const [xRotation, setXRotation] = useState(selItem && selItem.rotation[0]);
    const [yRotation, setYRotation] = useState(selItem && selItem.rotation[1]);
    const [zRotation, setZRotation] = useState(selItem && selItem.rotation[2]);
  
    const [opacity, setOpacity] = useState(1);
  
    // Update selected item's transform based on inputs and call back to scene to update scene items
    const onTransformInputChange = (val, transformPropertyName, componentName) => {
      if (val === undefined) return;
      const transform = selectedItem[transformPropertyName];
      transform[componentName] = val;
      selectedItem[transformPropertyName].copy(transform);
      selectedItem.updateMatrix();
      onChange(selectedItem);
    }
  
    // Update selected item's opacity based on inputs and call back to scene to update scene items
    const onOpacityChange = (val) => {
      if (val === undefined) return;
      if (!selectedItem.children || selectedItem.children[0].type !== "Mesh") return;
      if (!selectedItem.children[0].material || !selectedItem.children[0].material.transparent) return;
      selectedItem.children[0].material.opacity = val;
      onChange(selectedItem);
    }
  
    // Add controls from react-three-gui
    const mode = useControl("Transform Mode", { type: "select", items: ["Translate", "Rotate"] });

    useControl("Position X", { type: "number", state: [xPosition, setXPosition], value: xPosition, scrub: true, onChange: (val) => onTransformInputChange(val, "position", "x")});
    useControl("Position Y", { type: "number", state: [yPosition, setYPosition], value: yPosition, scrub: true, onChange: (val) => onTransformInputChange(val, "position", "y")});
    useControl("Position Z", { type: "number", state: [zPosition, setZPosition], value: zPosition, scrub: true, onChange: (val) => onTransformInputChange(val, "position", "z")});
  
    useControl("Rotation X", { type: "number", state: [xRotation, setXRotation], value: xRotation, scrub: true, onChange: (val) => onTransformInputChange(val, "rotation", "x")});
    useControl("Rotation Y", { type: "number", state: [yRotation, setYRotation], value: yRotation, scrub: true, onChange: (val) => onTransformInputChange(val, "rotation", "y")});
    useControl("Rotation Z", { type: "number", state: [zRotation, setZRotation], value: zRotation, scrub: true, onChange: (val) => onTransformInputChange(val, "rotation", "z")});
    
    useControl("Opacity", { type: "number", state: [opacity, setOpacity], value: opacity, min: 0, max: 1, onChange: onOpacityChange});
  
    // Update the position values when the selected item's position changes
    useEffect(() => {
      setXPosition(selectedItem.position.x);
      setYPosition(selectedItem.position.y);
      setZPosition(selectedItem.position.z);
    });
    
    // Update the rotation values when the selected item's rotation changes
    useEffect(() => {
      setXRotation(selectedItem.rotation.x);
      setYRotation(selectedItem.rotation.y);
      setZRotation(selectedItem.rotation.z);
    });
    
    // Update the opacity value when the selected item's opacity changes
    useEffect(() => {
      if (selectedItem && selectedItem.children && selectedItem.children[0].type === "Mesh") {
        setOpacity(selectedItem.children[0].material.opacity);
      }
    });

    // Disable orbit controls when dragging on transform controls
    useEffect(() => {
      if (transformControls.current) {
        const controls = transformControls.current;
        controls.setMode(mode.toLowerCase());
        const callback = (event) => (orbitControls.current.enabled = !event.value);
        controls.addEventListener("dragging-changed", callback);
        return () => controls.removeEventListener("dragging-changed", callback);
      }
    });
  
    // Update selectedItem when the object attached to the transform control changes
    useEffect(() => {
      if (transformControls.current) {
        const controls = transformControls.current;
        controls.attach(selectedItem);
        const callback = (event) => {
          onChange(event.target.object);
        };
        controls.addEventListener("objectChange", callback);
        return () => controls.removeEventListener("objectChange", callback);
      }
    }, [onChange]);
   
    return (
      <TransformControls ref={transformControls} />
    );
  }