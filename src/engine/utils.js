export function isHoveringEdge(displayObject, pos, offset = 5) {
    //I made this because when the object is scaled, the localPosition is related to the initial width and height and
    //the edge would be messed

    const w = displayObject.width / displayObject.scale.x;
    const h = displayObject.height / displayObject.scale.y;
    const diagonalScale = Math.sqrt(displayObject.scale.x * displayObject.scale.x + displayObject.scale.y * displayObject.scale.y);
    const scaledOffset = offset / diagonalScale;

    return pos.x >= 0 && pos.x <= w &&
        pos.y >= 0 && pos.y <= h &&
        (
            pos.x <= scaledOffset ||
            pos.x >= w - scaledOffset ||
            pos.y <= scaledOffset ||
            pos.y >= h - scaledOffset
        );
}

