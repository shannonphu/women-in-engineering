// Get data

window.onload = function() { init() };

var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1b_jVLEWSQFlBWvinR03Gu67ShEGZvn2DevDbFPOnq2I/pubhtml';

function init() {
  Tabletop.init( { key: public_spreadsheet_url,
                   callback: showInfo,
                   simpleSheet: true } )
}

function showInfo(data, tabletop) {
  console.log(data);
  setupVisualizations(data);

  $(window).on('resize', function(){
  	setupVisualizations(data);
  });
}

// end getting data

var setupVisualizations = function(finalData) {
	// Interactive pie chart (d3)

	d3.select("#pie-group").remove();


	var svg = d3.select("#pie-chart")
		.append("g")
			.attr("id", "pie-group");

	svg.append("g")
		.attr("class", "slices");
	svg.append("g")
		.attr("class", "labels");
	svg.append("g")
		.attr("class", "lines");

	var width = $(window).width(),
	    height = $(window).height(),
		radius = Math.min(width, height) / 3;

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	var arc = d3.svg.arc()
		.outerRadius(radius * 0.8)
		.innerRadius(radius * 0.3);

	var outerArc = d3.svg.arc()
		.innerRadius(radius * 0.9)
		.outerRadius(radius * 0.9);

	var origin_x = width / 2;
	var origin_y = height/ 2.8;

	svg.attr("transform", "translate(" + origin_x + "," + origin_y + ")");

	// Add percentage text inside pie
	svg.append("text")
		.attr("id", "pie-percent")
		.attr("x", -40)
	    .attr("y", 15)
	    .text("")
	    	.style("font-size", "2.5em");

	// Add company name outside pie
	svg.append("text")
		.attr("id", "pie-company")
		.attr("x", -origin_x / 1.1)
		.attr("y", -height / 4.2)
	    .text("company")
	    	.style("font-size", "2em");

	var key = function(d){ return d.data.label; };

	var color = d3.scale.ordinal()
		.domain(["Female", "Male"])
		.range(["#a05d56", "#d0743c"]);

	function randomData (){
		var labels = color.domain();
		return labels.map(function(label) {
			var index = Math.floor(Math.random() * finalData.length);
			var percentage = parseFloat(finalData[index].percent_female_eng) / 100;
			return { label: label, value: percentage, company:finalData[index].company }
		});
	}

	change(randomData());
	setInterval(function() { change(randomData()); }, 1500);


	function change(data) {

		/* ------- PIE SLICES -------*/
		var slice = svg.select(".slices").selectAll("path.slice")
			.data(pie(data), key);

		slice.enter()
			.insert("path")
			.style("fill", function(d) { return color(d.data.label); })
			.attr("class", "slice");

		slice		
			.transition().duration(1000)
			.attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			});

		slice.exit()
			.remove();

		/* ------- TEXT LABELS -------*/

		var text = svg.select(".labels").selectAll("text")
			.data(pie(data), key);

		text.enter()
			.append("text")
			.attr("dy", ".35em")
			.text(function(d) {
				return d.data.label;
			})
			.style("font-size", "1.3em");
		
		function midAngle(d){
			return d.startAngle + (d.endAngle - d.startAngle) / 2;
		}

		text.transition().duration(1000)
			.attrTween("transform", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate("+ pos +")";
				};
			})
			.styleTween("text-anchor", function(d){
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start":"end";
				};
			});

		text.exit()
			.remove();

		/* ------- SLICE TO TEXT POLYLINES -------*/

		var polyline = svg.select(".lines").selectAll("polyline")
			.data(pie(data), key);
		
		polyline.enter()
			.append("polyline");

		polyline.transition().duration(1000)
			.attrTween("points", function(d){
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};			
			});
		
		polyline.exit()
			.remove();

		/* ----------- CENTER TEXT INSIDE PIE --------- */
		var femalePercent = (data[0].value * 100).toFixed(1) + "%";
	     svg.select("#pie-percent")
	         .transition()
	         .text(femalePercent);

	    /* --------- COMPANY NAME ----------- */
	    svg.select("#pie-company")
	    	.transition()
	    	.text(data[0].company);
	             
	};

	// end interactive pie chart
};

