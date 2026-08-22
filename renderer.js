import { viewport } from '/viewport.js';

export const renderer = {
    worldUnit: 100,
    camera: {
        x: 0,
        y: 0,
    },
    zoom: 1,

    worldToScreen(coords) {
        return {
            x: coords.x * this.zoom * this.worldUnit - this.camera.x,
            y: coords.y * this.zoom * this.worldUnit - this.camera.y,
        }
    }, 

    drawVertex(vertex) {
        const { x, y } = this.worldToScreen(vertex.pos);
        const ctx = viewport.canvasContext;
        const sideLength = 50;
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
    }
}