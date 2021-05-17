import React from "react"
import { Canvas } from "react-three-fiber"
import { Controls } from "react-three-gui"
import Scene from "./Components/Scene.js";
  
export default function App() {
  return (
    <>
      <Canvas camera={{ position: [-20, 5, 20], fov: 35 }}>
        <Scene />
      </Canvas>
      <Controls width={800} />
    </>
  )
}