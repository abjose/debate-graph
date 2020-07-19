// could be abuse of "controller" term
// todo
// - move node text updating into here?
// -
class Controller {
  constructor() {
    this.edge_from_node_id = undefined
  }

  initConnection(node) {
    controller.edge_from_node_id = node.node_id;
  }

  completeConnection(node) {
    debate_graph.addEdge(this.edge_from_node_id, node.node_id);
    this.edge_from_node_id = undefined;
  }

  addChild(node) {
    var child_id = debate_graph.addNode();
    debate_graph.addEdge(node.node_id, child_id)
  }

  addParent(node) {
    var parent_id = debate_graph.addNode();
    debate_graph.addEdge(parent_id, node.node_id)
  }

  removeNode(node) {
    debate_graph.removeNode(Number(node.node_id));
  }

  removeEdge(from_id, to_id) {
    debate_graph.removeEdge(Number(from_id), Number(to_id));
  }
}

module.exports = Controller;
