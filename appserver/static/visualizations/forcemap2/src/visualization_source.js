/*
 * Visualization source
 */
define([
            'jquery',
            'underscore',
            'vizapi/SplunkVisualizationBase',
            'vizapi/SplunkVisualizationUtils',
            // Add required assets to this list
	    'd3',
	    'd3-force'
        ],
        function(
            $,
            _,
            SplunkVisualizationBase,
            vizUtils,
            // Add required assets to this list.  Must be in the same order as above
	    d3,
	    d3_force
        ) {
  
    // Extend from SplunkVisualizationBase
    return SplunkVisualizationBase.extend({
  
        initialize: function() {
            SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
            this.$el = $(this.el);

	    this.$el.empty();
	    this.$el.addClass( 'viz-forcemap' );

	    this.width = this.$el.width();
	    this.height = this.$el.height();

	    this.$svg = $("<svg></svg>")
					.addClass("forcemap2-viz")
					.attr("width",this.width)
					.attr("height",this.height);

	    $(this.el).append(this.$svg);

            // Initialization logic goes here
        },

        // Search data params
        getInitialDataParams: function() {
            return ({
                outputMode: SplunkVisualizationBase.RAW_OUTPUT_MODE,
                count: 10000
            });
        },


	onConfigChange: function(config) { 
	    // TODO: update settings when the user options change
        },

        // Optionally implement to format data returned from search. 
        // The returned object will be passed to updateView as 'data'
        formatData: function(data) {

            // TODO: Format data if necessary

            return data;
        },

	setupView: function() { 
		this.$linkforces = d3.forcelink()
		                     .id(function(d) { return d.id; })
				     .strength(function(d){return d.weight});

		this.$forcemap = d3.forceSimulation()
		                   .force("link", this.$linkforces)
				   .force("charge", d3.forceManyBody())
				   .force("center", d3.forceCenter(this.width/2,this.height/2));
	},
  
        // Implement updateView to render a visualization.
        //  'data' will be the data object returned from formatData or from the search
        //  'config' will be the configuration property object
        updateView: function(data, config) {
	    console.log("Updating view ", JSON.stringify(data), JSON.stringify(config));

	    data.results.forEach( function(elem, idx, array ) {
	        console.log("Looking at ", JSON.stringify(elem));
		// The parent image is the link's source
		var srcId = this.$forcemap.nodes().map(
		                function(e) { 
				    return e["ParentImage"]; 
				}).indexOf(elem["ParentImage"]);
		// If we haven't seen the name before, add it
		if (srcId == -1) { 
		    srcId = this.$forcemap.nodes().
		                push({"id": elem["ParentImage"]});
		}

		// The Image is the link's target
		var tgtId = this.$forcemap.nodes().map(
		                function(e) { 
				    return e["Image"]; 
				}).indexOf(elem["Image"]);
		// If we haven't seen the name before, add it
		if (tgtId == -1) {
		    tgtId = this.$forcemap.nodes()
		                .push({"id": elem["Image"]});}

		this.$linkforces.links().push({"source": elem["ParentImage"], "target": elem["Image"], "weight": elem["count"]});
		//this.$forcemap.

		console.log( "Found link ", srcId, " -> ", tgtId);
	    }, this);
	    console.log("nodes: ", JSON.stringify(this.$forcemap.nodes()));
	    console.log("links: ", JSON.stringify(this.$linkforces.links()));
	    return;

	    var link = this.$svg.append("g")
	                   .attr("class", "links")
      		           .selectAll("line")
		           // TODO: ??? .data(graph.links)
		           .enter().append("line");

            node.append("title")
	        .text(function(d) { return d.id });

	    simulation
	        .nodes(graph.nodes)
		.on("tick", ticked);
	    simulation.force("link")
	        .links(graph.links);

            function ticked() {
	        link
		    .attr("x1", function(d) { return d.source.x; })
		    .attr("y1", function(d) { return d.source.y; })
		    .attr("x2", function(d) { return d.target.x; })
		    .attr("y2", function(d) { return d.target.y; });

		node
		    .attr("cx", function(d) { return d.x; })
		    .attr("cy", function(d) { return d.y; });
	     }

	     function dragstarted(d) {
	         if (!d3.event.active) simulation.alphaTarget(0.3).restart()
		 simulation.fix(d);
	     }

	     function dragged(d) {
	         simulatioin.fix(d, d3.event.x, d3.event.y);
	     }

	     function dragended(d) {
	         if (!d3.event.active) simulation.alphaTarget(0);
		 simulation.unfix(d);
	     }

        },

        // Override to respond to re-sizing events
        reflow: function() {
	    this.width = this.$el.width();
	    this.height = this.$el.height();
            console.log("Reflow to ",this.width, " x ", this.height);

	    this.$svg.width(this.width)
	             .height(this.height);
	}
    });
});
