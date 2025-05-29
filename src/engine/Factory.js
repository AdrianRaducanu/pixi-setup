import {Container, Graphics, Text} from "pixi.js";

export default class Factory {
    static create(obj) {
        let displayObject;
        switch (obj.type) {
            case 'container':
                displayObject = new Container();
                break;
            case 'graphics':
                displayObject = new Graphics();
                displayObject.rect(0, 0, 300, 50);
                displayObject.fill(obj.color);
                break;
            case 'text':
                displayObject = new Text({ text: obj.text});
                break;
            default:
                console.warn("Unknown type: ", obj.type);
                break;
        }
        displayObject.position.set(obj.position.x, obj.position.y);
        displayObject.label = obj.name;

        return displayObject;
    }
}
