import Mesh from "./Mesh.js"
import Node from "./Node.js"

let _instance;

export default class AppController {
  
  constructor() {
    this.sceneItems = [];
    const meterIcon = new Node(
      [
        new Node([], new Mesh("BOX", {size: [0.7, 2, 0.7]}), [-0.8, 0, 0]),
        new Node([], new Mesh("BOX", {size: [0.7, 1.5, 0.7]}), [0, 0.25, 0]),
        new Node([], new Mesh("BOX", {size: [0.7, 1.8, 0.7]}), [0.8, 0.1, 0]),
      ]
    );
    const sphere = new Node([], new Mesh("SPHERE", {radius: 1, widthSegments: 32, heightSegments: 32}, '#2c3ab7'), [0, 3, 0]);
    const sphere2 = new Node([], new Mesh("SPHERE", {radius: 1, widthSegments: 32, heightSegments: 32}, '#c800ff'), [0, -3, 0]);
    this.sceneItems.push(meterIcon);
    this.sceneItems.push(sphere);
    this.sceneItems.push(sphere2);
    this.selectedItem = this.sceneItems[0];
  }

  static get instance() {
    if (_instance === undefined) {
      _instance = new AppController()
    }
    return _instance;
  }
}