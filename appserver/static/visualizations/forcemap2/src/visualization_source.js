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

	    $(this.$el).empty();
	    $(this.$el).addClass( 'viz-forcemap' );

	    this.width = $(this.$el).width();
	    this.height = $(this.$el).height();

	    svg = $("svg")
		.addClass("forcemap2-viz")
		.attr("width",this.width)
		.attr("height",this.height);

	    this.$svg = $(this.el).append(svg);

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
		this.$nodes = [];
		this.$links = [];
		this.$linkforces = d3.forceLink()
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
		var srcId = this.$nodes.map(
		                function(e) { 
				    return e["ParentImage"]; 
				}).indexOf(elem["ParentImage"]);
		// If we haven't seen the name before, add it
		if (srcId == -1) { 
		    srcId = this.$nodes
		                .push({"id": elem["ParentImage"]});
		}

		// The Image is the link's target
		var tgtId = this.$nodes.map(
		                function(e) { 
				    return e["Image"]; 
				}).indexOf(elem["Image"]);
		// If we haven't seen the name before, add it
		if (tgtId == -1) {
		    tgtId = this.$nodes
		                .push({"id": elem["Image"]});}

		this.$links.push({
		     "source": elem["ParentImage"], 
		     "target": elem["Image"], 
		     "weight": elem["count"]});

	    }, this);

	    this.$linkforces.links(this.$links);
	    this.$forcemap.nodes(this.$nodes)
	                  .force("link", this.$linkforces)
			  .restart();

	    //var l = this.$svg.append("g")
	             //.attr("class", "links")
		     //.selectAll("line")
		     //.data(this.$linkforces.links())
		     //.enter().append("line");

	    //var n = this.$svg.append("g")
	             //.attr("class", "nodes")
		     //.selectAll("circle")
		     //.data(this.$forcemap.nodes())
		     //.enter().append("circle")
		                     //.attr("r", "2.5")
				     //.call(d3.drag()
				             //.on("start", dragstarted)
					     //.on("drag",  dragged)
					     //.on("end",   dragended));
	    return;

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

	    this.$svg.width(this.width)
	             .height(this.height);
            console.log("Reflow to ",this.width, " x ", this.height);
	}
    });
});
