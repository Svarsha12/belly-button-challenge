const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to initialize the dashboard
function init() {
  // Select the dropdown menu
  let dropdown = d3.select("#selDataset");

  // Fetch the JSON data
  d3.json(url).then((data) => {
    let sampleIds = data.names;

    // Populate the dropdown with sample IDs
    sampleIds.forEach((id) => {
      dropdown.append("option").attr("value", id).text(id);
    });

    // Get the first sample ID
    let firstSample = sampleIds[0];

    // Build charts and metadata for the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
    // Build gauge chart for the first sample
    buildGaugeChart(firstSample);
  });
}

// Function to build metadata panel
function buildMetadata(sample) {
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    let result = resultArray[0];
    let panel = d3.select("#sample-metadata");
    panel.html("");

    // Loop through each key-value pair and append to panel with styling
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`).style("color", "#333");
    });
  });
}

// Function to build horizontal bar chart
function buildCharts(sample) {
  d3.json(url).then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter((sampleObj) => sampleObj.id == sample);
    let result = resultArray[0];

    // Slice data to get top 10 values
    let top10SampleValues = result.sample_values.slice(0, 10).reverse();
    let top10OtuIds = result.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    let top10OtuLabels = result.otu_labels.slice(0, 10).reverse();

    // Build horizontal bar chart
    let trace1 = {
      x: top10SampleValues,
      y: top10OtuIds,
      text: top10OtuLabels,
      type: "bar",
      orientation: "h"
    };

    let data1 = [trace1];

    let layout1 = {
      title: "Top 10 Bacteria Cultures Found",
     
    };

    Plotly.newPlot("bar", data1, layout1);

    // Build bubble chart
    let trace2 = {
      x: result.otu_ids,
      y: result.sample_values,
      mode: "markers",
      marker: {
        size: result.sample_values,
        color: result.otu_ids,
        colorscale: "Earth"
      },
      text: result.otu_labels
    };

    let data2 = [trace2];

    let layout2 = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      showlegend: false,
      height: 600,
      width: 1000
    };

    Plotly.newPlot("bubble", data2, layout2);
  });
}

// Function to handle change in dropdown selection
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Function to build gauge chart
function buildGaugeChart(sample) {
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    let result = resultArray[0];
    let wfreq = result.wfreq; // Get washing frequency data

    // Build gauge chart
    var data = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreq,
        title: { text: "Belly Button Washing Frequency<br>Scrubs per Week", font: { size: 16 } },
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },
          bar: { color: "#6699FF" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 1], color: "#F8F3EC" },
            { range: [1, 2], color: "#F4F1E5" },
            { range: [2, 3], color: "#E9E6CA" },
            { range: [3, 4], color: "#E4E8B4" },
            { range: [4, 5], color: "#D5E599" },
            { range: [5, 6], color: "#B7CD8F" },
            { range: [6, 7], color: "#8CBF88" },
            { range: [7, 8], color: "#8ABB8F" },
            { range: [8, 9], color: "#85B48A" }
          ],
        }
      }
    ];

    var layout = {
      width: 500,
      height: 400,
      margin: { t: 0, b: 0 }
    };

    Plotly.newPlot("gauge", data, layout);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGaugeChart(newSample); // Update the gauge chart
}


// Initialize the dashboard
init();

