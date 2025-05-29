import {Assets, Container, Graphics, Sprite, Text} from "pixi.js";

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
        displayObject.visible = obj.visible ?? true;
        displayObject.alpha = obj.alpha ?? true;

        displayObject.position.set(obj.position.x, obj.position.y);
        displayObject.label = obj.name;
        if (obj.isCentered) {
            displayObject.anchor.set(0.5);
        }

        // if (obj.interactive) {
        //     displayObject.eventMode = 'static';
        //     displayObject.cursor = 'pointer';
        //     displayObject.on(obj.interactive.trigger, AnimationManager.instance.actions[obj.interactive.action]());
        // }

        return displayObject;
    }
}
