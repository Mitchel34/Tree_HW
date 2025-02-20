function renderTree(data,color) {
    console.log(data);

    const tree = d3.tree().size([width - margin * 2, height - margin * 2]);
    const treeLink = d3.linkVertical().x(d => d.x).y(d => d.y);

    const root = tree(d3.hierarchy(data));

    const link = gTree.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", treeLink);

    const node = gTree.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("circle")
        .attr("fill", color)
        .attr("r", 5);

    const text = node.append('g')
        .attr('transform', 'rotate(30)');

    text.append("text")
        .attr('font-size', '120%')
        .attr("dx", -10)
        .attr('text-anchor', 'end')
        .attr("alignment-baseline", 'middle')
        .attr('fill',color)
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