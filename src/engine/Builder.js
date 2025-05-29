import Factory from "./Factory.js";


export default class Builder {
    static build(data, stageObjects) {
        const root = Object.keys(data)[0];
        return this._buildTree(data[root], stageObjects);
    }

    static _buildTree(node, stageObjects) {

        const displayObject = Factory.create(node);
        if (!displayObject) return null;

        if (node.name) {
            stageObjects[node.name] = displayObject;
        }

        if (Array.isArray(node.children)) {
            node.children.forEach(childData => {
                const child = this._buildTree(childData, stageObjects);
                if (child) {
                    displayObject.addChild(child);
                } else {
                    console.warn("Invalid child:", childData);
                }
            });
        }

        return displayObject;
    }
}