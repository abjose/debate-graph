class GraphNode {
  constructor(graph_id, text) {
    this.graph_id = graph_id
    this.text = text
  }
}

class Graph {
  constructor() {
    this.nodes = [];  // node id == index
    this.edges = [];  // node id -> set of successor node ids
  }

  addNode() {
    var node_id = this.nodes.length;
    this.nodes.push(new GraphNode(node_id, "Add text"));
    return node_id;
  }

  addEdge(from_node_id, to_node_id) {
    if (this.edges[from_node_id] == undefined) {
      this.edges[from_node_id] = new Set();
    }
    this.edges[from_node_id].add(to_node_id);
  }

  serialize() {
    // TODO
  }
}
