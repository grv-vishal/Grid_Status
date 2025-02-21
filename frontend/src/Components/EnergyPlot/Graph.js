import React from 'react';
import {useContext} from 'react';
import Plot from 'react-plotly.js';
import { AppContext } from '../Authentication/authProvider';

export const PvGraph = () => {

  const{pvActual,pvForecast}=useContext(AppContext);

  if (!pvActual || !pvForecast) {
  console.log(pvActual)
  console.log(pvForecast)
    return <p>Loading data...</p>;
  }

  // Extract data points
  const times = pvActual.map((dataPoint) => dataPoint.time);
  const actualValues = pvActual.map((dataPoint) => dataPoint.actualValue);
  const forecastValues = pvForecast.map((dataPoint) => dataPoint.forecastedValue);


  const maxValue = Math.max(...actualValues.concat(forecastValues));
  const yRange = [-10, Math.max(200, maxValue + 100)];  // Y-axis range with -100 to larger max value
 

  return (
    <Plot
      data={[
        {
            x: times,  // X-axis (Time) for both datasets
            y: actualValues,  // Y-axis (Actual values)
            type: 'scattergl',
            mode: 'lines+markers',
            name: 'Actual',  // Name for legend
            marker: { color: 'blue' },
            line: { shape: 'linear' },
        },
        {
            x: times,  // Same X-axis (Time)
            y: forecastValues,  // Y-axis (Forecast values)
            type: 'scattergl',
            mode: 'lines+markers',
            name: 'Forecast',  // Name for legend
            marker: { color: 'red' },
            line: { dash: 'dot', shape: 'linear' },  // Different line style
        },
      ]}
      layout={{
        autosize: true,
        title: 'Solar Power Generation',
        xaxis: {
          title: 'No. of hours',
          type: 'category',  // Use category for time representation
        },
        yaxis: {
          title: 'power (KW)',
          range: yRange,  // Dynamic Y-axis range based on both datasets
          fixedrange: true
        },
        dragmode: 'pan',  // Enable panning\
        legend: {
          x: 0.4,         // right on the X-axis
          y: 1,        // Slightly above the plot
          xanchor: 'right',
          yanchor: 'top',
        },  
      }}
      useResizeHandler
      config={{
        scrollZoom: true,  // Enable scroll to zoom
        responsive: true,  // Ensure responsive behavior
      }}

      style={{ width: '100%', height: '100%' }}
    />
  );
};


export const WindGraph = () => {

  const{windActual,windForecast}=useContext(AppContext);

  if (!windActual || !windForecast) {
  console.log(windActual)
  console.log(windForecast)
  return <p>Loading data...</p>;
  }

  // Extract data points
  const times = windActual.map((dataPoint) => dataPoint.time);
  const actualValues = windActual.map((dataPoint) => dataPoint.actualValue);
  const forecastValues = windForecast.map((dataPoint) => dataPoint.forecastedValue);


  const maxValue = Math.max(...actualValues.concat(forecastValues));
  const yRange = [-5, Math.max(10, maxValue + 5)];  // Y-axis range with -100 to larger max value

  return (
    <Plot
     data={[
      {
          x: times,  // X-axis (Time) for both datasets
          y: actualValues,  // Y-axis (Actual values)
          type: 'scattergl',
          mode: 'lines+markers',
          name: 'Actual',  // Name for legend
          marker: { color: 'blue' },
          line: { shape: 'linear' },
      },
      {
          x: times,  // Same X-axis (Time)
          y: forecastValues,  // Y-axis (Forecast values)
          type: 'scattergl',
          mode: 'lines+markers',
          name: 'Forecast',  // Name for legend
          marker: { color: 'red' },
          line: { dash: 'dot', shape: 'linear' },  // Different line style
      },
     ]}
     layout={{
      autosize: true,
      title: 'Wind Power Generation',
      xaxis: {
        title: 'No. of hours',
        type: 'category',  // Use category for time representation
      },
      yaxis: {
        title: 'Power (KW)',
        range: yRange,  // Dynamic Y-axis range based on both datasets
        fixedrange: true
      },
      dragmode: 'pan',  // Enable panning
      legend: {
        x: 0.4,         // right on the X-axis
        y: 1,        // Slightly above the plot
        xanchor: 'right',
        yanchor: 'top',
      },
     }}
     useResizeHandler
     config={{
      scrollZoom: true,  // Enable scroll to zoom
      responsive: true,  // Ensure responsive behavior
     }}

     style={{ width: '100%', height: '100%' }}
    />
  );
};



//Load Energy 
export const LoadGraph = () => {

  const{loadValue}=useContext(AppContext);

  if (!loadValue) {
    return <p>Loading data...</p>;
  }

  // Extract data points
  const hour = loadValue.map((dataPoint) => dataPoint.hour);
  const totalLoad = loadValue.map((dataPoint) => dataPoint.total_Load);
  const critical = loadValue.map((dataPoint) => dataPoint.critical);
  const non_Critical = loadValue.map((dataPoint) => dataPoint.non_Critical);


  const maxValue = Math.max(...totalLoad);
  const yRange = [0, Math.max(10, maxValue + 50)];  // Y-axis range with -100 to larger max value

  return (
    <Plot
     data={[
      {
          x: hour,  // X-axis (Time) for both datasets
          y: totalLoad,  // Y-axis (Actual values)
          type: 'scattergl',
          mode: 'lines+markers',
          name: 'Total Load',  // Name for legend
          marker: { color: 'blue' },
          line: { shape: 'linear' },
      },
      {
          x: hour,  // Same X-axis (Time)
          y: critical,  // Y-axis (Forecast values)
          type: 'scattergl',
          mode: 'lines+markers',
          name: 'Critical Load',  // Name for legend
          marker: { color: 'red' },
          line: { dash: 'dot', shape: 'linear' },  // Different line style
      },
      {
        x: hour,  // Same X-axis (Time)
        y: non_Critical,  // Y-axis (Forecast values)
        type: 'scattergl',
        mode: 'lines+markers',
        name: 'Non Critical Load',  // Name for legend
        marker: { color: 'green' },
        line: { dash: 'dot', shape: 'linear' },  // Different line style
      },
     ]}
     layout={{
      autosize: true,
      title: 'Total Load Power',
      xaxis: {
        title: 'Time',
        type: 'category',  // Use category for time representation
        fixedrange: true,
      },
      yaxis: {
        title: 'Load Power (KW)',
        range: yRange,  // Dynamic Y-axis range based on both datasets
        fixedrange: true
      },
      dragmode: 'pan',  // Enable panning
      legend: {
        x: 0.4,         // right on the X-axis
        y: 1,        // Slightly above the plot
        xanchor: 'right',
        yanchor: 'top',
      },
     }}
     useResizeHandler
     config={{
      scrollZoom: true,  // Enable scroll to zoom
      responsive: true,  // Ensure responsive behavior
     }}

     style={{ width: '100%', height: '100%' }}
    />
  );
};


//Total Generation and Load

export const TotalGenerationGraph = () => {
  const { pvActual, windActual, loadValue } = useContext(AppContext);

  if (!loadValue || !pvActual || !windActual) {
    return <p>Loading data...</p>;
  }


  // Extract the first 24 datapoints for PV and Wind Actual and Load values
  const times = loadValue.map((dataPoint) => dataPoint.hour);
  const pvValues = pvActual.slice(-24).map((dataPoint) => dataPoint.actualValue);
  const windValues = windActual.slice(-24).map((dataPoint) => dataPoint.actualValue);
  const loadValues = loadValue.map((dataPoint) => dataPoint.total_Load);

  // Calculate total generation (PV + Wind) for each time point
  const totalGeneration = pvValues.map((pv, index) => pv + windValues[index]);

  const maxValue = Math.max(...totalGeneration.concat(loadValues));
  const yRange = [0, Math.max(10, maxValue + 5)];

  return (
    <Plot
      data={[
        {
          x: times,
          y: totalGeneration,
          type: 'scattergl',
          mode: 'lines+markers',
          name: 'Total Generation',
          marker: { color: 'purple' },
          line: { shape: 'linear' },
        },
        {
          x: times,
          y: loadValues,
          type: 'scattergl',
          mode: 'lines+markers',
          name: 'Total Load',
          marker: { color: 'orange' },
          line: { shape: 'linear' },
        },
      ]}
      layout={{
        autosize: true,
        title: 'Total Generation and Load Power',
        xaxis: {
          title: 'Time',
          type: 'category',
          fixedrange: true,
        },
        yaxis: {
          title: 'Power (KW)',
          range: yRange,
          fixedrange: true,
        },
        dragmode: 'pan',
        legend: {
          x: 0.4,
          y: 1,
          xanchor: 'right',
          yanchor: 'top',
        },
      }}
      useResizeHandler
      config={{
        scrollZoom: true,
        responsive: true,
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};


//Difference of Generation and Load
export const DifferenceGraph = () => {
  const { pvActual, windActual, loadValue } = useContext(AppContext);

  if (!loadValue || !pvActual || !windActual) {
    return <p>Loading data...</p>;
  }

  // Extract the first 24 datapoints for PV and Wind Actual and Load values
  const times = loadValue.map((dataPoint) => dataPoint.hour);
  const pvValues = pvActual.slice(-24).map((dataPoint) => dataPoint.actualValue);
  const windValues = windActual.slice(-24).map((dataPoint) => dataPoint.actualValue);
  const loadValues = loadValue.map((dataPoint) => dataPoint.total_Load);

  // Calculate total generation (PV + Wind) for each time point
  const totalGeneration = pvValues.map((pv, index) => pv + windValues[index]);
  const difference = totalGeneration.map((gen,index) => gen - loadValues[index]);

  const maxValue = Math.max(...difference);
  const yRange = [-200, Math.max(10, maxValue + 100)];

  return (
    <Plot
      data={[
        {
          x: times,
          y: difference,
          type: 'scattergl',
          mode: 'lines+markers',
          name: 'difference',
          marker: { color: 'blue' },
          line: { shape: 'linear' },
        },
      ]}
      layout={{
        autosize: true,
        title: 'Difference of Generation and Load Power',
        xaxis: {
          title: 'Time',
          type: 'category',
          fixedrange: true,
        },
        yaxis: {
          title: 'Power (KW)',
          range: yRange,
          fixedrange: true,
        },
        dragmode: 'pan',
        legend: {
          x: 0.4,
          y: 1,
          xanchor: 'right',
          yanchor: 'top',
        },
      }}
      useResizeHandler
      config={{
        scrollZoom: true,
        responsive: true,
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};


//Battery SOC
export const SocGraph = () => {
  const { pvActual, windActual, loadValue,batteryPower,times}= useContext(AppContext);

  if (!loadValue || !pvActual || !windActual) {
    return <p>Loading data...</p>;
  }

  const maxValue = Math.max(...batteryPower);
  const yRange = [0, Math.max(10, maxValue+20)];

  return (
    <Plot
      data={[
        {
          x: times,
          y: batteryPower,
          type: 'scattergl',
          mode: 'lines+markers',
          name: 'difference',
          marker: { color: 'blue' },
          line: { shape: 'linear' },
        },
      ]}
      layout={{
        autosize: true,
        title: 'Battery State of Charge',
        xaxis: {
          title: 'Time',
          type: 'category',
          fixedrange: true,
        },
        yaxis: {
          title: 'Battery SOC (%)',
          range: yRange,
          fixedrange: true,
        },
        dragmode: 'pan',
        legend: {
          x: 0.4,
          y: 1,
          xanchor: 'right',
          yanchor: 'top',
        },
      }}
      useResizeHandler
      config={{
        scrollZoom: true,
        responsive: true,
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};



//Critical DR 
export const CriticalDRGraph = () => {

  const{loadValue,criticalDR,times}=useContext(AppContext);

  if (!loadValue) {
    return <p>Loading data...</p>;
  }

  const maxValue = Math.max(...criticalDR);
  const yRange = [-0.2, Math.max(1, maxValue+0.2)];

  return (
    <Plot
      data={[
        {
          x: times,
          y: criticalDR,
          type: 'scattergl',
          mode: 'lines+markers',
          name: 'difference',
          marker: { color: 'blue' },
          line: { shape: 'linear' },
        },
      ]}
      layout={{
        autosize: true,
        title: 'Critical Demand Response ',
        xaxis: {
          title: 'Time',
          type: 'category',
          fixedrange: true,
        },
        yaxis: {
          title: 'Status Of Critical DR',
          range: yRange,
          fixedrange: true,
        },
        dragmode: 'pan',
        legend: {
          x: 0.4,
          y: 1,
          xanchor: 'right',
          yanchor: 'top',
        },
      }}
      useResizeHandler
      config={{
        scrollZoom: true,
        responsive: true,
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
