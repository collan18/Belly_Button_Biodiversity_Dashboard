// Write a function that will build the metadata for a single sample. It should do the following:
// - loop over the samples.json file with d3.json().then()
// - extract the metadata from the json
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;

        // - filter the metadata for the sample id

        var resultList = metadata.filter(sampleObj => sampleObj.id == sample);
        var output = resultList[0];
    
        // - update the metadata html elements
        var panel = d3.select("#sample-metadata");
    
        // - clear any existing metadata in the metadata html elements
        panel.html("");

        // - append hew header tags for each key-value pair in the filtered metadata

        Object.entries(output).forEach(([key, value]) => {
            var line = panel.append("h6");
            line.text(`${key.toUpperCase()}: ${value}`);
        });


    buildGauge(result.wfreq);
    });
}        

// Write a function that will build the charts for a single sample. It should do the following:
function buildCharts(sample) {
    // - loop over the samples.json file with d3.json().then()
    d3.json("samples.json").then((data) => {

        // - extract the samples from the json
        var sampleData = data.sampleData;
        // - filter the samples for the sample id
        var resultList = sampleData.filter(sampleObj => sampleObj.id == sample);
        // - extract the ids, labels, and values from the filtered result
        var output = resultList[0];
        var otu_ids = output.otu_ids;
        var sample_values = output.sample_values;
        var otu_labels = output.otu_labels;
        
        // - build a bubble chart with Plotly.newPlot()

        // Bubble Data
        var bubbleData = [
            {
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
              }
            }
        ];
        var bubbleLayout = {
            title: `<b>Biodiversity of Sample Data ${sample}</b>`,
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Value", range: [0, Math.max(data["sample_values"])]}
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // Build a Pie Chart
        var dataArray = [];
        for (var i=0; i<data.otu_ids.length; i++) {
            dataArray.push({
                "sample_values": data.sample_values[i],
                "otu_ids": data.otu_ids[i],
                "otu_labels": data.otu_labels[i]
            })
        }

        // Sort array of objects by sample values
        var dataArraySorted = dataArray.sort((a, b) =>
            parseFloat(b.sample_values) - parseFloat(a.sample_values)
        );

        // Prepare data for plot
        var pieData = [{
            labels: dataArraySorted.map(d => d["otu_ids"]).slice(0,10),
            values: dataArraySorted.map(d => d["sample_values"]).slice(0,10),
            text: dataArraySorted.map(d => d["otu_labels"]).slice(0,10), 
            type: "pie",
            name: dataArraySorted.map(d => d["otu_ids"]).slice(0,10),
            "textinfo": "percent",
        }];
        var pieLayout = {
            title: `<b>Top 10 OTU of sample ${sample}</b>`,
        };
        var pie = document.getElementById("pie");
        Plotly.newPlot(pie, pieData, pieLayout);
        

        // - build a bar chart and plot with Plotly.newPlot()
        // Write a function that will build the charts for a single sample.
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
            {
                y: yticks,
                x: sampleValues.slice(0, 10).reverse(),
                text: otuLabels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "v",
            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found in OTU Sample",
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
}


// Write a function called init() that will populate the charts/metadata and elements on the page. It should do the following:

function init() {
    // - select the dropdown element in the page
    var selector = d3.select("#selDataset");
    // - loop over the samples.json data to append the .name attribute into the value of an option HTML tag (lookup HTML documentation on dropdown menus)
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
          selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
        
        // - extract the first sample from the data
        // - call your two functions to build the metadata and build the charts on the first sample, so that new visitors see some data/charts before they select something from the dropdown
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

// Write a function called optionChanged() that takes a new sample as an argument. It should do the following:
function optionChanged(newSample) {
    // - call your two functions to build the metadata and build the charts on the new sample
    buildCharts(newSample);
    buildMetadata(newSample);
}
    // Look at line 30 of index.html: that is the event listener that will call this function when someone selects something on the dropdown

// Initialize the dashboard by calling your init() function
init();

