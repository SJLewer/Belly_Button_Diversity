function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = result.otu_ids;
    var otuLabels = result.otu_labels.slice(0, 10).reverse();
    var sValues = result.sample_values.slice(0, 10).reverse();
    var bubbleValues = result.sample_values;

    //BAR CHART
    // 7. Create the yticks for the bar chart.
    // Hint: Get the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(sampleObj => "OTU" + sampleObj + " ").slice(0, 10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sValues,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: otuLabels
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found<b>",
      height: 400
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    //BUBBLE CHART
    //1. Create the trace for the bubble chart.

    var bubbleData = [{
      x: result.otu_ids,
      y: bubbleValues,
      type: 'scatter',
      text: result.otu_labels,
      mode: 'markers',
      marker: {
        color: otuIds,
        size: bubbleValues,
        colorscale: 'Jet'
      }

    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures per Sample<b>',
      xaxis: { title: 'OTU ID' }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    //GUAGE CHART
    //Create variable to filter metadata array
    var metadata = data.metadata;
    
    // Filter the data for the object with the desired sample number
    var gaugeResultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var gaugeResult = gaugeResultArray[0];
   
    //Variable to convert washing frequency to floating point
    var gValue = parseFloat(gaugeResult.wfreq);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week" },
      value: gValue,
      gauge: {
        axis: { range: [null, 10], dtick: 2 },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" }
        ],
      }
    }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      height:400,
      automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
