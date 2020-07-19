var mongoose = require('mongoose');

class GraphNode {
  constructor(node_id, text) {
    this.node_id = node_id;
    this.text = text;
  }
}

class Graph {
  constructor() {
    this.graph_id = undefined;
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

    // test
    this.save();
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

  // TODO: use mongoose graph as actual graph
  load(mongoose_graph) {
    this.graph_id = mongoose_graph._id;
    // todo
  }
  
  // TODO: use mongoose graph as actual graph
  save() {
    var id = this.graph_id;
    if (!id) {
      id = new mongoose.Types.ObjectId();
    }
    
    var nodes = new Map();
    this.nodes.forEach((node, key) => {
      nodes.set(String(key), new MongooseGraphNode({
        node_id: String(key),
        text: node.text,
      }));
    });
        
    var edges = new Map();
    this.edges.forEach((successors, key) => {
      var stringy_edges = [];
      successors.forEach((successor_node_id) => {
        stringy_edges.push(String(successor_node_id));
      });
      edges.set(String(key), stringy_edges);
    });

    var mongoose_graph = new MongooseGraph({
      _id: id,
      nodes: nodes,
      edges: edges,
      last_updated: Date.now(),
    });

    mongoose_graph.save(function(err) {
      if (err) throw err;
      console.log('Graph saved successfully');
    });
  }
}


var nodeSchema = mongoose.Schema({
  node_id: String,
  text: String,
});


var graphSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nodes: {
    type: Map,
    of: nodeSchema,
  },
  
  edges: {
    type: Map,
    of: [String],
  },
  
  created: { 
    type: Date,
    default: Date.now
  },
  
  last_updated: { 
    type: Date,
    default: Date.now
  },
});

// TODO: use this as "the" graph.
var MongooseGraphNode = mongoose.model('MongooseGraphNode', nodeSchema);
var MongooseGraph = mongoose.model('MongooseGraph', graphSchema);

module.exports = MongooseGraphNode;
module.exports = MongooseGraph;
module.exports = Graph;
