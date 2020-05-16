// TODO: if having a fixed size doesn't work out, need to figure out sizes and pass to dagre
// also should these be global...
var node_width = 165
var node_height = 165
var div_width = 150
var div_height = 150


function renderGraph(graph) {
  var dagre_graph = layout(graph)

  dagre_graph.nodes().forEach(function(v) {
    console.log("Node " + v + ": " + JSON.stringify(dagre_graph.node(v)));
    dagre_node = dagre_graph.node(v)
    x = dagre_node.x - div_width / 2 + "px"
    y = dagre_node.y - div_height / 2 + "px"
    node_div = makeNode(x, y, graph.nodes[v]);
    document.body.appendChild(node_div);
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

function clearNodes() {
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

function clearLines(points) {
  var svg_arrows = document.getElementById("svg_arrows");
  // remove children
}

function nodeClicked(node) {
  console.log('click!', node);

  var textarea = document.createElement("textarea");
  textarea.classList.add("myText");
  textarea.value = node.text
  textarea.style.width = div_width-4 + "px";  // WHY DIFFERENT SIZES???
  textarea.style.height = div_height-4 + "px";
  // textarea.style.maxHeight = this.style.height;
  textarea.style.top = this.style.top;
  textarea.style.left = this.style.left;
  this.replaceWith(textarea);
  textarea.focus();
  textarea.onblur = nodeBlurred.bind(textarea, node);
}

function nodeBlurred(node) {
  console.log('blur!', node)
  node.text = this.value;

  node_div = makeNode(this.style.left, this.style.top, node)
  this.replaceWith(node_div);
}
