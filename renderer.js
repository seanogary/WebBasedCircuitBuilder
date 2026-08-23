import { viewport } from '/viewport.js';

export const renderer = {
    worldUnit: 100,

    worldToScreen(coords) {
        const newCoords = {
            x: (
                coords.x * viewport.zoomTransform.scale * this.worldUnit
                + viewport.camera.x + viewport.zoomTransform.translation.x
            ),
            y: (
                coords.y * viewport.zoomTransform.scale * this.worldUnit 
                + viewport.camera.y + viewport.zoomTransform.translation.y
            ),
        }
        console.log(newCoords);
        return newCoords;
    }, 

    drawVertex(vertex) {
        const { x, y } = this.worldToScreen(vertex.pos);
        const ctx = viewport.canvasContext;
        const sideLength = 50 * viewport.zoomTransform.scale;
        ctx.beginPath();
        ctx.rect(x - sideLength / 2, y - sideLength / 2, sideLength, sideLength);
        ctx.fill();
    },

    drawEdge(vertex1, vertex2) {
        const { x: x1, y: y1} = this.worldToScreen(vertex1);
        const { x: x2, y: y2 } = this.worldToScreen(vertex2);
        const ctx = viewport.canvasContext;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    },

    renderGraph(graph) {
        viewport.canvasContext.clearRect(0, 0, viewport.width, viewport.height);
        for (let el of graph.vertices) {
            this.drawVertex(el);
        }
        for (let el of graph.edges) {
            this.drawEdge(el[0], el[1]);
        }
    },

}