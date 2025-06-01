import {isHoveringEdge} from "./utils.js";

export default class FeaturesFactory {
    static makeDraggable(obj) {
        let dragging = false;
        let offset = { x: 0, y: 0 };

        obj.cursor = "move";

        obj.on('pointerdown', (event) => {
            const pos = event.data.getLocalPosition(obj.parent);
            dragging = true;
            offset.x = pos.x - obj.x;
            offset.y = pos.y - obj.y;
        });

        obj.on('pointerup', () => dragging = false);
        obj.on('pointerupoutside', () => dragging = false);

        obj.on('pointermove', (event) => {
            if (dragging) {
                event.stopPropagation();
                const pos = event.data.getLocalPosition(obj.parent);
                obj.position.set(pos.x - offset.x, pos.y - offset.y);
            }
        });
    }

    //work for objects with pivot/anchor in the center, so the scale is made on 'diagonal'
    //a better option would have been to consider the place where the pointer is related to the object and move the
    // pivot/anchor in the opposite part - ex. Pointer is in the bottom left corner - pivot is in the top right corner
    // This way, the object would have 8 points of interest, LEFT, RIGHT, TOP, BOTTOM, and the 4 corners
    // The resize would be much more realistic
    static makeResizable(obj) {
        const edgeOffset = 10;
        let resizing = false;

        let startScale = {x: 1, y: 1};
        let startDist = 0;

        obj.interactive = true;
        obj.cursor = "default";

        obj.on('pointermove', (event) => {
            const pos = event.data.getLocalPosition(obj);

            if (!resizing) {
                if (isHoveringEdge(obj, pos, edgeOffset)) {
                    obj.cursor = "nwse-resize";
                } else {
                    obj.cursor = obj.isDraggable ? "move" : "default";
                }
            } else {
                const global = event.data.global;
                const dx = global.x - obj.getGlobalPosition().x;
                const dy = global.y - obj.getGlobalPosition().y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const scaleFactor = dist / startDist;
                obj.scale.set(startScale.x * scaleFactor, startScale.y * scaleFactor);
            }
        });

        obj.on('pointerdown', (event) => {
            const pos = event.data.getLocalPosition(obj);

            if (isHoveringEdge(obj, pos, edgeOffset)) {
                resizing = true;
                startScale = { x: obj.scale.x, y: obj.scale.y };

                const dx = event.data.global.x - obj.getGlobalPosition().x;
                const dy = event.data.global.y - obj.getGlobalPosition().y;
                startDist = Math.sqrt(dx * dx + dy * dy);
            }
        });

        obj.on('pointerup', () => {
            resizing = false;
        });

        obj.on('pointerupoutside', () => {
            resizing = false;

        });
    }

    //Thats the combination of the first 2 methods.
    //If I called them separately, the assigned callback for each triggers would work only for one feature

    // Thats because I work only with the object, I dont create some hit-area (like an invisible layer above it)
    // that will have interactivity
    static makeInteractive(obj) {
        const edgeOffset = 10;

        let dragging = false;
        let resizing = false;

        let offset = { x: 0, y: 0 };
        let startScale = { x: 1, y: 1 };
        let startDist = 0;

        obj.interactive = true;
        obj.cursor = "default";

        obj.on('pointerdown', (event) => {
            const localPos = event.data.getLocalPosition(obj);
            const global = event.data.global;

            if (isHoveringEdge(obj, localPos, edgeOffset)) {
                resizing = true;
                startScale = { x: obj.scale.x, y: obj.scale.y };

                const dx = global.x - obj.getGlobalPosition().x;
                const dy = global.y - obj.getGlobalPosition().y;
                startDist = Math.sqrt(dx * dx + dy * dy);
            } else {
                dragging = true;
                const parentPos = event.data.getLocalPosition(obj.parent);
                offset.x = parentPos.x - obj.x;
                offset.y = parentPos.y - obj.y;
            }
        });

        obj.on('pointermove', (event) => {
            const localPos = event.data.getLocalPosition(obj);
            const global = event.data.global;

            if (resizing) {
                const dx = global.x - obj.getGlobalPosition().x;
                const dy = global.y - obj.getGlobalPosition().y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const scaleFactor = dist / startDist;
                obj.scale.set(startScale.x * scaleFactor, startScale.y * scaleFactor);
            } else if (dragging) {
                event.stopPropagation();
                const parentPos = event.data.getLocalPosition(obj.parent);
                obj.position.set(parentPos.x - offset.x, parentPos.y - offset.y);
            } else {
                obj.cursor = isHoveringEdge(obj, localPos, edgeOffset)
                    ? "nwse-resize"
                    : obj.isDraggable
                        ? "move"
                        : "default";
            }
        });

        obj.on('pointerup', () => {
            dragging = false;
            resizing = false;
        });

        obj.on('pointerupoutside', () => {
            dragging = false;
            resizing = false;
        });
    }
}