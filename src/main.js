import './style.css'
import Engine from "./engine/Engine.js";
import AnimationManager from "./engine/AnimationManager.js";

const canvasContainer = document.getElementById('app');

const response = await fetch('./stage.json');
const jsonFile = await response.json();

await Engine.instance.initialize(canvasContainer);
await Engine.instance.createStage(jsonFile);

await AnimationManager.instance.create();

//Btn triggers
document.getElementById('btn1').addEventListener('click', () => {
    console.log('Play');
    AnimationManager.instance.actions['play']();
});

document.getElementById('btn2').addEventListener('click', () => {
    console.log('Pause');
    AnimationManager.instance.actions['pause']();
});

