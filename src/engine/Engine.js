import {Application} from "pixi.js";
import Builder from "./Builder.js";

class SingletonEnforcer {}

export default class Engine {
    app;
    stageObjects = {};

    static get instance() {
        if(!SingletonEnforcer._instance) {
            SingletonEnforcer._instance = new Engine(new SingletonEnforcer());
        }
        return SingletonEnforcer._instance;
    }

    constructor(enforcer) {
        if(!enforcer || !(enforcer instanceof SingletonEnforcer)) {
            throw new Error("Use Engine.instance!");
        }
        SingletonEnforcer._instance = this;
    }

    async initialize(container) {
        this.app = new Application();

        await this.app.init({
            background: '#cbdae3',
            width: 1920,
            height: 1080,
        })
        globalThis.__PIXI_APP__ = this.app;

        container.appendChild(this.app.canvas);
        //
        // const texture = await Assets.load('/vite.svg');
        // const sprite = new Sprite(texture);
        //
        // this.app.stage.addChild(sprite);
    }

    createStage(jsonFile) {
        const pixiTree = Builder.build(jsonFile, this.stageObjects);
        this.addInStage(pixiTree);

        console.log(this.getFromStage('g1'))
    }

    addInStage(obj) {
        this.app.stage.addChild(obj);
    }

    getFromStage(label) {
        return this.stageObjects[label];
    }

}