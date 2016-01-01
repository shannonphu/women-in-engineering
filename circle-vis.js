// CIRCLE-VIS COLORS
var MALE_BACKGROUND = "lightblue",
	FEMALE_BACKGROUND = "pink",
	MALE_ACCENT = "blue",
	FEMALE_ACCENT = "red"
	CIRCLE_LOADING_COLOR = "lavender";
// end colors

var radius, textOffsetY;
var drawRowsOfCircles = function(numRows) {
		var width = $(window).width();
		if (width > 760) 
			width = $(window).width() * 0.95 / 2;
		var height = $(window).height() - $(".header").height();

		d3.select("#circle-vis-group").remove();
		var svg = d3.select("#circle-vis")
		    .attr("width", width)
		    .attr("height", height)
		    .append("g")
		    	.attr("id", "circle-vis-group");

		var numberOfButtons = 10;
		radius = width / numberOfButtons / 3;
		textOffsetY = radius / 2;
		var textMade = circlesMade = 0;

	    function drawRow(spacing) {
	    	var x = d3.scale.linear()
	    	    .domain([0,numberOfButtons+1])
	    	    .range([0,width]);

	    	var buttons = d3.range(numberOfButtons).map(function(d,i) {
	    	    return { id: i+1, x: x(i+1), y: radius * 2 + spacing }
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
	    	    .attr("fill", MALE_BACKGROUND)
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
        .attr("y", textOffsetY * 1.5)
        .attr("font-size", radius * 2);
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
        .attr("font-size", radius * 1.4);
}; 

function updateCircles(women) {
		var numWomen = Math.floor(parseFloat(women));
		d3.select("#circle-vis").selectAll("text")
			.transition()
			.duration(500)
			.attr("fill", MALE_ACCENT);
		d3.select("#circle-vis").selectAll("circle")
			.transition()
			.duration(500)
			.attr("fill", MALE_BACKGROUND);
		for (var i = 99; i > 99 - numWomen; i--) {
			d3.select("#circle" + i)
				.transition()
			    .duration(500)
			    .attr("fill", FEMALE_BACKGROUND);
			d3.select("#text" + i)
				.transition()
			    .duration(500)
			    .attr("fill", FEMALE_ACCENT);
		};
}