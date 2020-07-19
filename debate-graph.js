/* TODO
- figure out how to make arrowhead clickable
- make escape also save
- CLEAN STUFF UP - so that not mixing calls to renderer and stuff
  i think renderer should own state on if something is in editing mode, etc.
  so controller will update graph and renderer with stuff based on user actions
  then when rerender will show updated info - new graph stuff (stored in graph), editing state (stored in renderer), etc.
- change node.node_id to node.graph_node_id?
- turn renderer into a class
- and renderer then takes both graph and controller? how does that work?
- how to trigger redraws? just mark as dirty and redraw within 10ms or something?
- Also can just set what's being edited in there and have view update accordingly?
- put action buttons into a dropdown next to an "add" button

bugs
- if execute "connect", then delete that node, still execute a connection on the next node you click but wrong
*/

const Controller = require('./controller.js');
const Graph = require('./graph.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose_basics', function (err) {
  run();
});

// TODO: don't be global
var controller = new Controller();
var debate_graph = new Graph();

function run() {
  var id1 = debate_graph.addNode();
  var id2 = debate_graph.addNode();
  var id3 = debate_graph.addNode();
  var id4 = debate_graph.addNode();
  var id5 = debate_graph.addNode();
  var id6 = debate_graph.addNode();

  debate_graph.addEdge(id1, id2);
  debate_graph.addEdge(id3, id2);
  debate_graph.addEdge(id5, id6);
  debate_graph.addEdge(id3, id5);
  debate_graph.addEdge(id1, id4);

  // long bit
  var ida1 = debate_graph.addNode();
  var ida2 = debate_graph.addNode();
  var ida3 = debate_graph.addNode();
  var ida4 = debate_graph.addNode();
  var ida5 = debate_graph.addNode();
  var ida6 = debate_graph.addNode();
  debate_graph.addEdge(id6, ida1);
  debate_graph.addEdge(ida1, ida2);
  debate_graph.addEdge(ida2, ida3);
  debate_graph.addEdge(ida3, ida4);
  debate_graph.addEdge(ida4, ida5);
  debate_graph.addEdge(ida5, ida6);

  renderGraph(debate_graph);
}

// run();
