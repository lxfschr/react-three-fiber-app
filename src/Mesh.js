export default class Mesh {
  constructor(type, parameters, color="#f0f0f0") {
    this.sceneType = "MESH";
    this.type = type;
    this.parameters = parameters;
    this.color = color;
  }
}