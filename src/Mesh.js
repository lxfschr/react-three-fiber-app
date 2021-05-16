export default class Mesh {
  constructor(type, parameters, color="black") {
    this.sceneType = "MESH";
    this.type = type;
    this.parameters = parameters;
    this.color = color;
  }
}