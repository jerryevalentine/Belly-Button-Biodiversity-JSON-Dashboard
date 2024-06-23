// Function to build the metadata panel
function buildMetadata(sample) {
  // Fetch the data from the specified URL
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the metadata field from the fetched data
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const sampleMetadata = metadata.filter(obj => obj.id === parseInt(sample))[0];

    // Use d3 to select the panel with id `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata in the panel
    panel.html("");

    // Inside a loop, use d3 to append new tags for each key-value pair in the filtered metadata
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      panel.append("h5").text(`${key.toUpperCase()}: ${value}`); // Create a new heading for each key-value pair
    });
  }).catch((error) => {
    console.error("Error fetching or processing data:", error);
  });
}


// function to build both charts
// Function to build both the Bubble and Bar charts
function buildCharts(sample) {
  // Fetch data from the JSON source
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the samples field from the fetched data
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const sampleData = samples.filter(obj => obj.id === sample)[0];

    // Get the required data for the charts
    const otu_ids = sampleData.otu_ids;
    const otu_labels = sampleData.otu_labels;
    const sample_values = sampleData.sample_values;

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    const bubbleLayout = {
      title: 'OTU Bubble Chart',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Value' },
      hovermode: 'closest'
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

    // Build a Bar Chart
    const yticks = otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    const barTrace = {
      x: sample_values.slice(0, 10).reverse(), // Reverse to get descending order
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h' // Horizontal bar chart
    };

    const barLayout = {
      title: 'Top 10 OTUs Found',
      xaxis: { title: 'Sample Value' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [barTrace], barLayout);

  }).catch((error) => {
    console.error("Error fetching or processing data:", error);
  });
}


// Function to run on page load
function init() {
  // Fetch the JSON data
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the list of sample names from the fetched data
    const sampleNames = data.names;

    // Use d3 to select the dropdown with ID `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the dropdown
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  }).catch((error) => {
    console.error("Error fetching or processing data:", error);
  });
}


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);   // Update the charts with the new sample
  buildMetadata(newSample); // Update the metadata panel with the new sample
}


// Initialize the dashboard
init();