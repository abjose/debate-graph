/* TODO
- get switching to textarea + buttons when (double?)click
- update graph text if text changes
- render to html when blur (shouldn't have to re-layout because fixed size)
*/

function run() {
  var debate_graph = new Graph();

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
