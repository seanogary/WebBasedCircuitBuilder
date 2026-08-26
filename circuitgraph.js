export const circuitGraph = {
    edges: [],
    vertices: [],

    addEdge(sourceVertexId, targetVertexId, receivingTerminal = null) {
        if (!receivingTerminal) return // handle if connection terminal not provided

        let sourceVertex = null;
        let targetVertex = null;

        for (const vertex of this.vertices) {
            if (vertex.id == sourceVertexId) sourceVertex = vertex;
            if (vertex.id == targetVertexId) targetVertex = vertex;
        }

        if (!sourceVertex || !targetVertex) return // handle if one vertex does not exist

        sourceVertex.terminals.output = targetVertex;
        targetVertex.terminals[receivingTerminal] = sourceVertex;

    },

    addVertex(pos, connectionObject = {left: null, right: null, output: null}) {
        this.vertices.push({
            id: crypto.randomUUID(),
            pos: pos,
            type: "nand",
            terminals: connectionObject 
        });
    },
    
    autoLayout() {},

}