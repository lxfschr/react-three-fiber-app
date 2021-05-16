export default class Node {
  constructor(children, mesh, position=[0,0,0], rotation=[0, 0, 0], scale=[1, 1, 1]) {
    this.sceneType = "NODE";
    this.children = children;
    this.mesh = mesh;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}