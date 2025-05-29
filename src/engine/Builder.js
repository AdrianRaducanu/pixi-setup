import Factory from "./Factory.js";


export default class Builder {
    static async build(data, stageObjects) {
        const root = Object.keys(data)[0];
        return await this._buildTree(data[root], stageObjects);
    }

    static async _buildTree(node, stageObjects) {

        const displayObject = await Factory.create(node);
        if (!displayObject) return null;

        if (node.name) {
            stageObjects[node.name] = displayObject;
        }

        if (Array.isArray(node.children)) {
            for (const childData of node.children) {
                const child = await this._buildTree(childData, stageObjects);
                if (child) {
                    displayObject.addChild(child);
                } else {
                    console.warn("Invalid child:", childData);
                }
            }
        }

        return displayObject;
    }
}