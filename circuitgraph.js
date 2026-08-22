export const circuitGraph = {
    edges: [],
    vertices: [],
    addEdge(v1, v2) {
        this.edges.push([v1, v2]);
    },

    addVertex(pos) {
        this.vertices.push({
            pos: pos,
            type: "plain",
        });
    },
}