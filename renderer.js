function renderGraph(graph) {
  var dagre_graph = layout(graph)
  
  dagre_graph.nodes().forEach(function(v) {
    console.log("Node " + v + ": " + JSON.stringify(dagre_graph.node(v)));
    drawNode(dagre_graph.node(v));
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

  // TODO: if having a fixed size doesn't work out, need to figure out sizes and pass to dagre
  width = 50
  height = 50
  div_width = 35
  div_height = 35

  for (const node_id of graph.nodes.keys()) {
    node = graph.nodes[node_id];
    g.setNode(node_id, { width: width, height: height });
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

function drawNode(node) {
  // TODO: set the graph_ids on the divs! so know what to connect w/ edges
  x = node.x
  y = node.y
  var div = document.createElement("div");
  div.classList.add("myDiv");
  div.style.width = div_width + "px";
  div.style.height = div_height + "px";
  div.style.top = y - div_height / 2 + "px";
  div.style.left = x - div_width / 2 + "px";
  div.innerHTML = "Hi";
  document.body.appendChild(div);
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

// TODO: markdown -> html conversion
// ok i think also you need to be editing a graph datastructure

// function nodeClicked() {
//   var divHtml = $(this).html();
//   var editableText = $("<textarea />");
//   editableText.val(divHtml);
//   $(this).replaceWith(editableText);
//   editableText.focus();
//   // setup the blur event for this new textarea
//   editableText.blur(editableTextBlurred);
// }

// function nodeBlurred() {
//   var html = $(this).val();
//   var viewableText = $("<div>");
//   viewableText.html(html);
//   $(this).replaceWith(viewableText);
//   // setup the click event for this new div
//   viewableText.click(divClicked);
// }

// $(document).ready(function () {
//   $("div").click(divClicked);
// });
