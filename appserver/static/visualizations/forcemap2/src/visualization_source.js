/*
 * Visualization source
 */
define([
            'jquery',
            'underscore',
            'vizapi/SplunkVisualizationBase',
            'vizapi/SplunkVisualizationUtils'
            // FIXME: Add required assets to this list
        ],
        function(
            $,
            _,
            SplunkVisualizationBase,
            vizUtils
            // FIXME: Add required assets to this list.  Must be in the same order as above
        ) {
  
    // Extend from SplunkVisualizationBase
    return SplunkVisualizationBase.extend({
  
        initialize: function() {
            SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
            this.$el = $(this.el);

	    // FIXME: change class name
	    this.$el.addClass( 'splunk-viztemplate' );

            this.$el.append('<h3>This is a custom visualization stand in.</h3>');
            this.$el.append('<p>Edit your custom visualization app to render something here.</p>');

            // FIXME: Initialization logic goes here
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

        },

        // Search data params
        getInitialDataParams: function() {
            return ({
	        // TODO: Do you want your data in JSON?
                outputMode: SplunkVisualizationBase.RAW_OUTPUT_MODE,
                count: 10000
            });
        },

        // Override to respond to re-sizing events
        reflow: function() {
	    // TODO: Update based on this.$el.width() and .height()
	}
    });
});
