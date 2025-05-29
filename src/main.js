import './style.css'
import Engine from "./engine/Engine.js";

const canvasContainer = document.getElementById('app');

const response = await fetch('./stage.json');
const jsonFile = await response.json();

await Engine.instance.initialize(canvasContainer);
await Engine.instance.createStage(jsonFile);

