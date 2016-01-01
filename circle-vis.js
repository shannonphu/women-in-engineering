var radius, textOffsetY;
var drawRowsOfCircles = function(numRows) {
		var width = $(window).width() * 0.97,
		    height = $(window).height();

		var svg = d3.select("#circle-vis")
		    .attr("width", width)
		    .attr("height", height);

	    svg.select("g").remove();

		var numberOfButtons = 20;
		radius = width / numberOfButtons / 3;
		textOffsetY = radius / 2;
		var textMade = circlesMade = 0;

	    function drawRow(origin_y) {
	    	var x = d3.scale.linear()
	    	    .domain([0,numberOfButtons+1])
	    	    .range([0,width]);

	    	var buttons = d3.range(numberOfButtons).map(function(d,i) {
	    	    return { id: i+1, x: x(i+1), y: height - numRows * radius * 2.75 + origin_y }
	    	});

	    	var buttonGroup = svg
	    		.append("g")
	    		.attr("class", "circle-row")
	    		.selectAll("g")
	    	    .data(buttons)
	    	  	.enter().append("g")
	    	    .attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; });

	    	buttonGroup.append("circle")
	    	    .attr("r", radius)
	    	    .attr("fill", 'lightblue')
	    	    .attr("cursor", "pointer")
	    	    .attr("id", function(d) { return "circle" + circlesMade++; })
	    	    .on("mouseover", enlargeCircle)
	    	    .on("mouseout", resetCircle)
	    	    .style("visibility", "hidden");

	    	buttonGroup.append('text')
	    			    .attr('font-family', 'Icons')
	    			    .attr('font-size', radius * 1.4)
	    			    .attr("text-anchor", "middle")
	    			    .attr("y", textOffsetY).
	    			    attr("id", function(d) { return "text" + textMade++;})
	    			    .text(function(d) { return '\uf183' })
	    			    .style("visibility", "hidden")
	    			    .attr("pointer-events", "none"); 
	    }
	    
	    for (var i = 0; i < numRows; i++) {
	    	drawRow(radius * 2.5 * i);
	    };
};

function enlargeCircle(d,i) {
	var index = d3.select(this).attr("id").replace("circle", "");
    d3.select(this).transition()
        .ease("elastic")
        .duration("500")
        .attr("r", radius * 1.5);
    d3.select("#text"+index).transition()
        .ease("cubic-out")
        .duration("200")
        .attr("y", textOffsetY)
        .attr("font-size", radius * 2)
        .attr("fill", "white");
};

function resetCircle(d,i) {
	var index = d3.select(this).attr("id").replace("circle", "");
    d3.select(this).transition()
        .ease("quad")
        .delay("100")
        .duration("200")
        .attr("r", radius);
    d3.select("#text"+index).transition()
        .ease("cubic-out")
        .duration("400")
        .delay("100")
        .attr("y", textOffsetY)
        .attr("font-size", radius * 1.4)
        .attr("fill", "blue");
}; 

$(document).ready(function() {
	drawRowsOfCircles(5);

	d3.selectAll("circle").each(function(d,i) { 
		var index = d3.select(this).attr("id").replace("circle", "");
		d3.select("#text" + index).transition().delay(i * 25).style("visibility", "visible");
		d3.select(this).transition()
		    .ease("elastic")
		    .duration("500")
		    .attr("r", radius * 1.5)
		    .style("visibility", "visible")
		    .delay(i * 25)
		    .each("end", resetCircle);

	});
});