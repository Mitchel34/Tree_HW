const sentenceColors = [
  "blue",
  "orange",
  "green",
  "red",
  "purple"
];

const margin = 60,
  width = 800,
  height = 800;


function renderTree(data, color) {
  console.log(data);
  d3.select("#tree-container").select("svg").remove();

  // Create a new SVG container for the tree
  const svg = d3.select("#tree-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create a group element with margins applied (gTree)
  const gTree = svg.append("g")
    .attr("transform", `translate(${margin},${margin})`);

  // Define the tree layout and vertical link generator
  const tree = d3.tree().size([width - margin * 2, height - margin * 2]);
  const treeLink = d3.linkVertical().x(d => d.x).y(d => d.y);

  // Compute the hierarchy and layout
  const root = tree(d3.hierarchy(data));

  // Render the links
  const link = gTree.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", treeLink);

  // Render the nodes
  const node = gTree.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

  // Draw circles for each node
  node.append("circle")
    .attr("fill", color)
    .attr("r", 5);

  // Append a rotated group for text labels
  const text = node.append('g')
    .attr('transform', 'rotate(30)');

  text.append("text")
    .attr('font-size', '120%')
    .attr("dx", -10)
    .attr('text-anchor', 'end')
    .attr("alignment-baseline", 'middle')
    .attr('fill', color)
    .text(d => d.data.name);

  text.append('text')
    .attr('font-size', '80%')
    .attr("dx", 10)
    .attr('dy', -3)
    .attr('opacity', 0.5)
    .text(d => d.data.attributes.relation);

  text.append('text')
    .attr('font-size', '80%')
    .attr("dx", 10)
    .attr('dy', 3)
    .attr('opacity', 0.5)
    .attr("alignment-baseline", 'hanging')
    .text(d => d.data.attributes.upos);
}

// Main init function that creates SVG buttons and loads JSON data
function initTrees() {
  // Create an SVG container for the buttons (inserted above #tree-container)
  const buttonSvgWidth = 800,
    buttonSvgHeight = 60;
  const buttonSvg = d3.select("body")
    .insert("svg", "#tree-container")
    .attr("id", "button-svg")
    .attr("width", buttonSvgWidth)
    .attr("height", buttonSvgHeight);

  // Fetch the keys from the server API
  fetch('/api/keys')
    .then(response => response.json())
    .then(keys => {
      // Create button data with keys and corresponding colors
      const buttonsData = keys.map((key, index) => ({
        id: key,
        color: sentenceColors[index % sentenceColors.length]
      }));

      const buttonWidth = 60,
        buttonHeight = 40,
        spacing = 10;

      // Create button groups (rectangles with labels)
      const buttons = buttonSvg.selectAll("g.button")
        .data(buttonsData)
        .enter()
        .append("g")
        .attr("class", "button")
        .attr("transform", (d, i) => `translate(${i * (buttonWidth + spacing) + spacing}, 10)`);

      // Draw rectangles for buttons
      buttons.append("rect")
        .attr("width", buttonWidth)
        .attr("height", buttonHeight)
        .attr("fill", d => d.color)
        .attr("stroke", "#333")
        .style("cursor", "pointer");

      // Add text labels (sentence IDs) centered in the rectangles
      buttons.append("text")
        .attr("x", buttonWidth / 2)
        .attr("y", buttonHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .text(d => d.id);

      // Attach click handlers to buttons
      buttons.on("click", (event, d) => {
        // Fetch tree data from the server API when button is clicked
        fetch(`/api/tree/${d.id}`)
          .then(response => response.json())
          .then(treeData => {
            renderTree(treeData, d.color);
          })
          .catch(error => {
            console.error("Error loading tree data:", error);
          });
      });

      // Load and render the first tree by default
      if (keys.length > 0) {
        fetch(`/api/tree/${keys[0]}`)
          .then(response => response.json())
          .then(treeData => {
            renderTree(treeData, buttonsData[0].color);
          })
          .catch(error => {
            console.error("Error loading initial tree data:", error);
          });
      }
    })
    .catch(error => {
      console.error("Error loading keys from server:", error);
    });
}
