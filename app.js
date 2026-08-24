import { viewport, initResize } from './viewport.js';
import { circuitGraph } from './circuitgraph.js';
import { renderer } from './renderer.js';
import { init } from './init.js';

await init(); // temporary, to avoid rendering before init

viewport.resizeNow();

let vertex1 = {
    x: 5 - 2,
    y: 5,
}

circuitGraph.addVertex(vertex1);

let vertex2 = {
    x: 5,
    y: 5,
}
circuitGraph.addVertex(vertex2);

circuitGraph.addEdge(vertex1, vertex2);

window.addEventListener('viewportchange', () => {
    renderer.renderGraph(circuitGraph);
});

renderer.renderGraph(circuitGraph);