// could be abuse of "controller" term
// todo
// - move node text updating into here?
// -
class Controller {
  constructor() {
    self.edge_from_node_id = undefined
  }

  initConnection(node) {
    controller.edge_from_node_id = node.graph_id
  }

  completeConnection(node) {
    debate_graph.addEdge(this.edge_from_node_id, node.graph_id);
    this.edge_from_node_id = undefined;
  }

  addChild(node) {
    var child_id = debate_graph.addNode();
    debate_graph.addEdge(node.graph_id, child_id)
  }

  addParent(node) {
    var parent_id = debate_graph.addNode();
    debate_graph.addEdge(parent_id, node.graph_id)
  }
}
