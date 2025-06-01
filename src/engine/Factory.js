import {Assets, Container, Graphics, Sprite, Text} from "pixi.js";
import FeaturesFactory from "./FeaturesFactory.js";

export default class Factory {
    static async create(obj) {
        let displayObject;
        switch (obj.type) {
            case 'container':
                displayObject = new Container();
                break;
            case 'image':
                const texture = await Assets.load(`/${obj.resource}`);
                displayObject = new Sprite(texture);
                break;
            case 'graphics':
                displayObject = new Graphics();
                displayObject.rect(obj.dimension.x, obj.dimension.y, obj.dimension.w, obj.dimension.h);
                displayObject.fill(obj.color);
                break;
            case 'text':
                displayObject = new Text({text: obj.text});
                break;
            default:
                console.warn("Unknown type: ", obj.type);
                break;
        }
        this.addProperties(obj, displayObject);
        this.addFeatures(obj, displayObject);

        return displayObject;
    }

    static addProperties(obj, displayObject) {
        displayObject.visible = obj.visible ?? true;
        displayObject.alpha = obj.alpha ?? true;

        displayObject.position.set(obj.position.x, obj.position.y);
        displayObject.label = obj.name;
        if (obj.isCentered) {
            displayObject.pivot.set(displayObject.width/ 2, displayObject.height / 2)
        }
    }

    static addFeatures(obj, displayObject) {
        if(obj.resizeable && obj.draggable) {
            displayObject.eventMode = 'static';
            displayObject.isDraggable = true;
            displayObject.isResizable = true;
            FeaturesFactory.makeInteractive(displayObject);
        }
        else if(obj.resizeable) {
            displayObject.eventMode = 'static';
            displayObject.isResizable = true;
            FeaturesFactory.makeResizable(displayObject);
        }
        else if(obj.draggable) {
            displayObject.eventMode = 'static';
            displayObject.isDraggable = true;
            FeaturesFactory.makeDraggable(displayObject);
        }
    }
}
