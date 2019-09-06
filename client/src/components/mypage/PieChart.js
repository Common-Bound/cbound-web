import React, { Component } from "react";
import CanvasJSReact from "../../assets/canvasjs.react";
import InspectionPage from "../inspectionPage/InspectionPage";
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PieChart extends Component {
  render() {
    const options = {
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: "생성 대비 검수 개수"
      },
      data: [
        {
          type: "pie",
          startAngle: 75,
          toolTipContent: "<b>{label}</b>: {y}",
          showInLegend: "true",
          legendText: "{label}",
          indexLabelFontSize: 16,
          indexLabel: "{label} - {y} 개",
          dataPoints: [
            { y: 8, label: "Direct" },
            { y: 12, label: "Organic Search" }
          ]
        }
      ]
    };

    return (
      <div>
        <h1>React Pie Chart</h1>
        <CanvasJSChart
          options={options}
          /* onRef={ref => this.chart = ref} */
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </div>
    );
  }
}

export default PieChart;
