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
    buildCharts(firstSample);
    buildMetadata(firstSample);
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
// ****************************  deliverable 1 ***********************************************
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then(
    (data) => {
    // 3. Create a variable that holds the samples array. 
    var sampledata = data.samples;
    console.log(sampledata);
    var metadata = data.metadata;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = sampledata.filter(sampleObj => sampleObj.id == sample); 
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    var samplesresult = samplesArray[0];
    var result = resultArray[0];
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = samplesresult.otu_ids;
    var otuLabels = samplesresult.otu_labels;
    var otuValues = samplesresult.sample_values;
    var wfreqValue = result.wfreq;
    console.log(wfreqValue);

    // 7. Create the yticks for the bar chart. Hint: Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0,10).map(value => "OTU " + value).reverse();
    console.log(yticks)
    // 8. Create the trace for the bar chart. 
    var barData = [{x:otuValues.slice(0,10).reverse(),y:yticks,text: otuLabels.slice(0,10).reverse(),type: "bar",orientation: "h"}];
    // 9. Create the layout for the bar chart. 
    var barLayout = {title: "Top 10 Bacteria Cultures Found"};
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);   

// ****************************  deliverable 2 ***********************************************  
    // Plotly.newPlot(); 

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: otuValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuIds,
        colorscale: 'Earth',
        size: otuValues
      }
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: '<b>Bacteria Cultures per Sample</b>', 
      margin: {t:0},
      hovermode: 'closest',
      xaxis:  {
        title: '<b>OTU ID</b>'
      },
      margin: {t:30},
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 


    // ****************************  deliverable 3 *********************************************** 
    var gaugeData = [
      {
        domain: { x: [0,1], y: [0,1] },
        gauge: {
          axis: {range: [null,10]},
          bar: {color: 'black'},
          steps: [{range: [0,2], color: 'red'},
          {range: [2,4], color: 'orange'},
          {range: [4,6], color: 'yellow'}, 
          {range: [6,8], color: 'yellowgreen'},
          {range: [8,10], color: 'green'}
        ]
        },
        value: wfreqValue,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number"
      }
    ];
    
    var gaugelayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', gaugeData, gaugelayout);
  
  }





  );

}
