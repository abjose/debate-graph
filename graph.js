class GraphNode {
  constructor(graph_id, text) {
    this.graph_id = graph_id
    this.text = text
  }
}

class Graph {
  constructor() {
    this.next_id = 0;  // TODO: switch to uuids?
    this.nodes = new Map();  // node id -> node object
    this.edges = new Map();  // node id -> set of successor node ids
  }

  getNode(node_id) {
    return this.nodes.get(Number(node_id));
  }

  getSuccessors(node_id) {
    return this.edges.get(Number(node_id));
  }

  addNode() {
    var node_id = ++this.next_id;
    this.nodes.set(node_id, new GraphNode(node_id, "Node " + node_id));
    return node_id;
  }

  addEdge(from_node_id, to_node_id) {
    if (!this.edges.has(from_node_id)) {
      this.edges.set(from_node_id, new Set());
    }
    this.edges.get(from_node_id).add(to_node_id);
  }

  removeNode(node_id) {
    this.nodes.delete(node_id);
    this.edges.delete(node_id);
    this.edges.forEach(function(e) {
      e.delete(node_id);
    });
  }

  removeEdge(from_id, to_id) {
    if (this.edges.has(from_id)) {
      this.edges.get(from_id).delete(to_id);
    }
  }

  serialize() {
    // TODO
    // should ignore undefined nodes
    // maybe should have actual ids
  }
}
