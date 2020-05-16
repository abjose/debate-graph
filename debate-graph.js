// dagre wiki: https://github.com/dagrejs/dagre/wiki

// Create a new directed graph 
var g = new dagre.graphlib.Graph();

// Set an object for the graph label
g.setGraph({});

// Default to assigning a new object as a label for each new edge.
g.setDefaultEdgeLabel(function() { return {}; });

// Add nodes to the graph. The first argument is the node id. The second is
// metadata about the node. In this case we're going to add labels to each of
// our nodes.
width = 50
height = 50
div_width = 35
div_height = 35

g.setNode("kspacey",    { label: "Kevin Spacey",  width: width, height: height });
g.setNode("swilliams",  { label: "Saul Williams", width: width, height: height });
g.setNode("bpitt",      { label: "Brad Pitt",     width: width, height: height });
g.setNode("hford",      { label: "Harrison Ford", width: width, height: height });
g.setNode("lwilson",    { label: "Luke Wilson",   width: width, height: height });
g.setNode("kbacon",     { label: "Kevin Bacon",   width: width, height: height });

// Add edges to the graph.
// g.setEdge("kspacey",   "swilliams");
// g.setEdge("swilliams", "kbacon");
g.setEdge("bpitt",     "kbacon");
g.setEdge("hford",     "lwilson");
g.setEdge("lwilson",   "kbacon");

// lay out the graph
dagre.layout(g);


g.nodes().forEach(function(v) {
  console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
  x = g.node(v).x
  y = g.node(v).y
  var div = document.createElement("div");
  div.classList.add("myDiv");
  div.style.width = div_width + "px";
  div.style.height = div_height + "px";
  div.style.top = y - div_height / 2 + "px";
  div.style.left = x - div_width / 2 + "px";
  div.innerHTML = "Hi";
  document.body.appendChild(div);
});
g.edges().forEach(function(e) {
  console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
  drawLine(g.edge(e).points)
});

// so actually need to draw all the nodes, figure out how big they are, then position them

function clearLines(points) {
  var svg_arrows = document.getElementById("svg_arrows");
  // remove children
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

// TODO: markdown -> html conversion
// ok i think also you need to be editing a graph datastructure

function nodeClicked() {
    var divHtml = $(this).html();
    var editableText = $("<textarea />");
    editableText.val(divHtml);
    $(this).replaceWith(editableText);
    editableText.focus();
    // setup the blur event for this new textarea
    editableText.blur(editableTextBlurred);
}

function nodeBlurred() {
    var html = $(this).val();
    var viewableText = $("<div>");
    viewableText.html(html);
    $(this).replaceWith(viewableText);
    // setup the click event for this new div
    viewableText.click(divClicked);
}

$(document).ready(function () {
    $("div").click(divClicked);
});

function renderGraph(graph) {
  // layout and render a graph
  // make sure to set the graph_ids on the divs!
}
