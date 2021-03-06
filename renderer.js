// TODO: if having a fixed size doesn't work out, need to figure out sizes and pass to dagre
// also should these be global...
var node_width = 165
var node_height = 165
var div_width = 150
var div_height = 150

edit_options = ["cxn", "child", "parent", "delete"];

function renderGraph(graph) {
  // clear any existing nodes and edges
  clearNodes();
  clearEdges();

  var dagre_graph = layout(graph)

  // Resize svg so it all renders.
  svg = document.getElementById("svg_base");
  svg.style.width = dagre_graph.graph().width + "px";
  svg.style.height = dagre_graph.graph().height + "px";

  var graph_nodes_div = document.getElementById("graph_nodes");
  dagre_graph.nodes().forEach(function(v) {
    console.log("Node " + v + ": " + JSON.stringify(dagre_graph.node(v)));
    dagre_node = dagre_graph.node(v);
    x = dagre_node.x - div_width / 2 + "px";
    y = dagre_node.y - div_height / 2 + "px";
    node_div = makeNode(x, y, graph.getNode(v));
    graph_nodes_div.appendChild(node_div);
  });

  dagre_graph.edges().forEach(function(e) {
    console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(dagre_graph.edge(e)));
    drawEdge(e.v, e.w, dagre_graph.edge(e).points);
  });
}

// TODO: make some of  these functions private or something

// use dagre for layout
function layout(graph) {
  // Create a new directed graph
  var g = new dagre.graphlib.Graph();

  // Set an object for the graph label
  g.setGraph({});

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function() { return {}; });

  for (const node_id of graph.nodes.keys()) {
    g.setNode(node_id, { width: node_width, height: node_height });
  }
  for (const from_node_id of graph.edges.keys()) {
    successors = graph.getSuccessors(from_node_id);
    if (successors != undefined) {
      for (const to_node_id of successors) {
        g.setEdge(from_node_id, to_node_id);
      }
    }
  }

  dagre.layout(g);
  return g;
}

function makeNode(x, y, node) {
  // TODO: set the node_ids on the divs! so know what to connect w/ edges
  var div = document.createElement("div");
  div.classList.add("myDiv");
  div.style.width = div_width + "px";
  div.style.height = div_height + "px";
  div.style.left = x
  div.style.top = y
  div.innerHTML = marked(node.text);
  div.onclick = nodeClicked.bind(div, node);
  return div;
}

function drawEdge(from_id, to_id, points) {
  var svg_arrows = document.getElementById("svg_arrows");

  points_string = ""
  for(let i = 0; i < points.length; ++i) {
    points_string += points[i].x + "," + points[i].y + " "
  }

  var arrow = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  arrow.setAttributeNS(null, "points", points_string)
  arrow.from_node_id = from_id;
  arrow.to_node_id = to_id;
  arrow.onclick = edgeClicked.bind(arrow);
  svg_arrows.appendChild(arrow);

  // Add a second larger line behind the first to make clicking easier
  var arrow2 = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  arrow2.setAttributeNS(null, "points", points_string)
  arrow2.from_node_id = from_id;
  arrow2.to_node_id = to_id;
  arrow2.onclick = edgeClicked.bind(arrow2);
  svg_arrows_background.appendChild(arrow2);
}

function edgeClicked() {
  if (confirm("Remove this edge?")) {
    controller.removeEdge(this.from_node_id, this.to_node_id);
    renderGraph(debate_graph);
  }
}

function clearNodes() {
  var graph_nodes = document.getElementById("graph_nodes");
  while (graph_nodes.hasChildNodes()) {
    graph_nodes.removeChild(graph_nodes.lastChild);
  }
}

function clearEdges(points) {
  var svg_arrows = document.getElementById("svg_arrows");
  while (svg_arrows.hasChildNodes()) {
    svg_arrows.removeChild(svg_arrows.lastChild);
  }
  var svg_arrows = document.getElementById("svg_arrows_background");
  while (svg_arrows.hasChildNodes()) {
    svg_arrows.removeChild(svg_arrows.lastChild);
  }
}

// TODO: Move onClick part into controller but keep rendering things here? don't want to trigger a full rerender for this
function nodeClicked(node) {
  console.log('click!', node);

  if (controller.edge_from_node_id != undefined &&
      node.node_id != controller.edge_from_node_id) {
    controller.completeConnection(node);
    renderGraph(debate_graph)
  }

  var editing_div = document.createElement("div");
  editing_div.classList.add("editingDiv");
  editing_div.style.top = this.style.top;
  editing_div.style.left = this.style.left;

  var button_div = document.createElement("div");
  editing_div.appendChild(button_div);

  var action_btn = document.createElement("button");
  action_btn.innerHTML = "do";
  button_div.appendChild(action_btn);

  var select = document.createElement("select");
  button_div.appendChild(select);

  for (const option_text of edit_options) {
    let option = document.createElement("option");
    option.text = option.value = option_text;
    select.add(option);
  }

  action_btn.onclick = editNode.bind(select, node);

  var save_btn = document.createElement("button");
  save_btn.innerHTML = "save"
  button_div.appendChild(save_btn);

  var textarea = document.createElement("textarea");
  textarea.classList.add("myText");
  textarea.value = node.text
  textarea.style.width = div_width-4 + "px";  // WHY DIFFERENT SIZES???
  textarea.style.height = div_height-4 + "px";
  editing_div.appendChild(textarea)

  this.replaceWith(editing_div);
  textarea.focus();

  save_btn.onclick = saveNode.bind(textarea, node);
}

function saveNode(node) {
  console.log('save!', node, this.value)
  node.text = this.value;

  node_div = makeNode(this.parentNode.style.left, this.parentNode.style.top, node)
  this.parentNode.replaceWith(node_div);
}

function removeNode(node) {
  if (confirm("Remove this node?")) {
    controller.removeNode(node);
  }
}

function editNode(node) {
  dirty = false;
  switch (this.value) {
  case edit_options[0]:  // connect
    controller.initConnection(node);
    break;
  case edit_options[1]:  // add child
    controller.addChild(node)
    dirty = true;
    break;
  case edit_options[2]:  // add parent
    controller.addParent(node)
    dirty = true;
    break;
  case edit_options[3]:  // delete
    removeNode(node);
    dirty = true;
    break;
  default:
    console.log("unhandled option:", this.value);
    break;
  }

  if (dirty) {
    renderGraph(debate_graph);
  }
}
