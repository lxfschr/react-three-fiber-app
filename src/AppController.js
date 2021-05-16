import Mesh from "./Mesh.js"
import Node from "./Node.js"

let _instance;

export default class AppController {
  
  constructor() {
    this.sceneItems = [];
    const meterIcon = new Node(
      [
        new Node([], new Mesh("BOX", {size: [1, 2, 1]}), [-1.2, 0, 0]),
        new Node([], new Mesh("BOX", {size: [1, 1.5, 1]}), [0, 0.25, 0]),
        new Node([], new Mesh("BOX", {size: [1, 1.75, 1]}), [1.2, 0.125, 0]),
      ]
    )
    this.sceneItems.push(meterIcon);
  }

  static get instance() {
    if (_instance === undefined) {
      _instance = new AppController();
    }
    return _instance;
  }
}