// TODO: if having a fixed size doesn't work out, need to figure out sizes and pass to dagre
// also should these be global...
var node_width = 165
var node_height = 165
var div_width = 150
var div_height = 150

edit_options = ["cxn", "child", "parent"];

function renderGraph(graph) {
  // clear any existing nodes and edges
  clearNodes();
  clearEdges();

  var dagre_graph = layout(graph)

  var graph_nodes_div = document.getElementById("graph_nodes");
  dagre_graph.nodes().forEach(function(v) {
    console.log("Node " + v + ": " + JSON.stringify(dagre_graph.node(v)));
    dagre_node = dagre_graph.node(v)
    x = dagre_node.x - div_width / 2 + "px"
    y = dagre_node.y - div_height / 2 + "px"
    node_div = makeNode(x, y, graph.nodes[v]);
    graph_nodes_div.appendChild(node_div);
  });

  dagre_graph.edges().forEach(function(e) {
    console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(dagre_graph.edge(e)));
    drawLine(dagre_graph.edge(e).points);
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
    node = graph.nodes[node_id];
    g.setNode(node_id, { width: node_width, height: node_height });
  }
  for (const from_node_id of graph.edges.keys()) {
    successors = graph.edges[from_node_id];
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
  // TODO: set the graph_ids on the divs! so know what to connect w/ edges
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

function drawLine(points) {
  var svg_arrows = document.getElementById("svg_arrows");

  points_string = ""
  for(let i = 0; i < points.length; ++i) {
    points_string += points[i].x + "," + points[i].y + " "
  }

  var arrow = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  arrow.setAttributeNS(null, "points", points_string)
  svg_arrows.appendChild(arrow);
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
}

// TODO: Move onClick part into controller but keep rendering things here? don't want to trigger a full rerender for this
function nodeClicked(node) {
  console.log('click!', node);

  if (controller.edge_from_node_id != undefined &&
      node.graph_id != controller.edge_from_node_id) {
    controller.completeConnection(node);
    renderGraph(debate_graph)
  }

  var editing_div = document.createElement("div");
  editing_div.classList.add("editingDiv");
  editing_div.style.top = this.style.top;
  editing_div.style.left = this.style.left;

  var button_div = document.createElement("div");
  editing_div.appendChild(button_div);

  var add_btn = document.createElement("button");
  add_btn.innerHTML = "add"
  button_div.appendChild(add_btn);

  var select = document.createElement("select");
  button_div.appendChild(select);

  for (const option_text of edit_options) {
    let option = document.createElement("option");
    option.text = option.value = option_text;
    select.add(option);
  }

  add_btn.onclick = editNode.bind(select, node);

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
  default:
    console.log("unhandled option:", this.value);
    break;
  }

  if (dirty) {
    renderGraph(debate_graph);
  }
}
