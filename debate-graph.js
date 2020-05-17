/* TODO
- CLEAN STUFF UP - so that not mixing calls to renderer and stuff
- Make a controller so can keep some state for creating edges
- turn renderer into a class
- and renderer then takes both graph and controller? how does that work?
- Also can just set what's being edited in there and have view update accordingly?
- put action buttons into a dropdown next to an "add" button?
- put all the flowchart in its own div - make sure arrows don't stick when scroll everything
*/

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

  renderGraph(debate_graph)
}

run()
