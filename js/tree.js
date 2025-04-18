

function drawTree(){
    const data = buildTreeData();

    const svg = d3.select("svg");
    const width = window.innerWidth, height = window.innerHeight;
    const g = svg.append("g");
    const zoom = d3.zoom()
        .scaleExtent([0.1, 3])
        .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoom);
    const linkLabelDistance = 30;

    const treeLayout = d3.tree()
    .size([width * 0.4, height * 0.5])
    .separation((a, b) => {
        const lengthScale = 400;
        const textSizeA = a.data.name.length * lengthScale;
        const textSizeB = b.data.name.length * lengthScale;

        if (a.parent === root && b.parent === root) {
            const maxChildWidthA = a.children ? Math.max(...a.children.map(c => c.data.name.length * lengthScale)) : 0;
            const maxChildWidthB = b.children ? Math.max(...b.children.map(c => c.data.name.length * lengthScale)) : 0;
            
            return ((textSizeA + textSizeB) / 80) + (maxChildWidthA + maxChildWidthB) / 80;
        }

        return a.parent === b.parent ? (textSizeA + textSizeB) / 80 : 3;
    });

    const root = d3.hierarchy(data);

    treeLayout(root);

    const link = g.selectAll(".link")
        .data(root.links())
        .enter().append("line")
        .attr("class", "link")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
        .attr("stroke", d => d.target.data.color || "#ccc");

        const node = g.selectAll(".node")
    .data(root.descendants())
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .call(d3.drag()
        .on("drag", function (event, d) {
            d.x = event.x;
            d.y = event.y;
            d3.select(this).attr("transform", `translate(${d.x},${d.y})`);
            updateLinks();
        })
    );

    const nodeBackground = getComputedStyle(document.documentElement).getPropertyValue('--dark-grey-1').trim();

    node.each(function(d) {
        const group = d3.select(this);

        const text = group.append("text")
            .attr("dy", 5)
            .attr("fill", "#ddd")
            .attr("text-anchor", "middle")
            .text(d => d.data.name);

        setTimeout(() => {
            const bbox = text.node().getBBox();
            const padding = 10;

            group.insert("rect", "text")
                .attr("x", bbox.x - padding / 2)
                .attr("y", bbox.y - padding / 2)
                .attr("width", bbox.width + padding)
                .attr("height", bbox.height + padding)
                .attr("fill", nodeBackground)
                .attr("rx", 5)
                .attr("ry", 5); 
        }, 10);
    });

    const linkLabels = g.selectAll(".link-label")
        .data(root.links())
        .enter().append("text")
        .attr("class", "link-label")
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "#ddd")
        .text(d => d.target.data.label || "");

    function updateLinks() {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .attr("stroke", d => d.target.data.color || "#ccc");

        linkLabels.attr("x", d => {
                const midX = (d.source.x + d.target.x) / 2;
                const midY = (d.source.y + d.target.y) / 2;
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const offsetX = (-dy / length) * linkLabelDistance;
                return midX + offsetX;
            })
            .attr("y", d => {
                const midX = (d.source.x + d.target.x) / 2;
                const midY = (d.source.y + d.target.y) / 2;
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const offsetY = (dx / length) * linkLabelDistance;
                return midY + offsetY;
            });
    }


    const initScale = 1.25;
    const bounds = g.node().getBBox();
    const initialX = 3*((width - bounds.width) / initScale) / 4;
    const initialY = ((height - bounds.height) / initScale) / 2;
    const initialTransform = d3.zoomIdentity.translate(initialX, initialY).scale(initScale);

    svg.call(zoom.transform, initialTransform);

    updateLinks();

}



function buildTreeData(){
    data = {};
    data.name = `Total (${document.querySelectorAll('.object').length})`;
    if(eventsList.length > 0){
        data.children = []
        for(let i = 0; i < eventsList.length; i++){
            child = {}
            child.name = document.getElementById(`${eventsList[i]}-label`).innerText;
            child.label = document.querySelectorAll(`.object.${eventsList[i]}-object`).length.toString();
            child.color = getComputedStyle(document.documentElement).getPropertyValue(`--${eventsList[i]}-color`).trim();
            child.children = []
            for(let j = 0; j < evidenceList.length; j++){
                grandchild = {}
                grandchild.name = document.getElementById(`${evidenceList[j]}-label`).innerText;
                grandchild.label = document.querySelectorAll(`.object.${eventsList[i]}-object.${evidenceList[j]}-object`).length.toString();
                grandchild.color = getComputedStyle(document.documentElement).getPropertyValue(`--${evidenceList[j]}-color`).trim();
                child.children.push(grandchild);
            }
            data.children.push(child);
        }
    }
    return data;
}


function removeTree(){
    const svg = d3.select("svg");
    svg.selectAll("*").remove();
    svg.on(".zoom", null);
}