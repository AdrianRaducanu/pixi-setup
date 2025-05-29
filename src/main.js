import './style.css'
import {Application, Assets, Sprite} from "pixi.js";


const app = new Application();

await app.init({
    background: '#cbdae3',
    width: 1920,
    height: 1080,
})
globalThis.__PIXI_APP__ = app;

const canvasEl = document.getElementById('app');
canvasEl.appendChild(app.canvas);

const texture = await Assets.load('./public/vite.svg');
const sprite = new Sprite(texture);

app.stage.addChild(sprite);