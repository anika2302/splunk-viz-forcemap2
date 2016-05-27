/*
 * Visualization source
 */
define([
            'jquery',
            'underscore',
            'vizapi/SplunkVisualizationBase',
            'vizapi/SplunkVisualizationUtils',
            // Add required assets to this list
	    'd3'
        ],
        function(
            $,
            _,
            SplunkVisualizationBase,
            vizUtils,
            // Add required assets to this list.  Must be in the same order as above
	    d3
        ) {
  
    // Extend from SplunkVisualizationBase
    return SplunkVisualizationBase.extend({
  
        initialize: function() {
            SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
            this.$el = $(this.el);

	    $(this.el).empty();
	    $(this.el).addClass( 'viz-forcemap' );

	    this.$svg = $(this.el).append("svg");

            // Initialization logic goes here

	    this.width = this.$el.width();
	    this.height = this.$el.height();


	    this.forcelayout = d3.layout.force()
		    .size([this.width, this.height])
		    .charge(-120)
                    .linkDistance(30)
		    .start();

        },

        // Optionally implement to format data returned from search. 
        // The returned object will be passed to updateView as 'data'
        formatData: function(data) {

            // TODO: Format data if necessary

            return data;
        },
  
        // Implement updateView to render a visualization.
        //  'data' will be the data object returned from formatData or from the search
        //  'config' will be the configuration property object
        updateView: function(data, config) {
            // FIXME: your code here
	    
	    // Your configuration options (see formatter.html) 
	    // myoption = config['display.visualizations.custom.splunk-viztemplate.working'];

            // Draw something here
	    //this.forcelayout.

        },

        // Search data params
        getInitialDataParams: function() {
            return ({
                outputMode: SplunkVisualizationBase.RAW_OUTPUT_MODE,
                count: 10000
            });
        },

        // Override to respond to re-sizing events
        reflow: function() {
	    this.width = this.$el.width();
	    this.height = this.$el.height();
            console.log("Reflow to ",this.width, " x ", this.height);
	    console.log("svg is ", JSON.stringify(this.$svg));

            this.$svg.width(this.width);
            this.$svg.height(this.height);

//	    this.forcelayout.size([ this.width, this.height])
//                            .start();
	}
    });
});
