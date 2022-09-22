import * as echarts from "echarts";
import ReactEChartsCore from "echarts-for-react/lib/core";
import _ from "lodash";
import React from "react";

export default function LitterCaptured(this: any, littercomp: any) {
  if (!littercomp || !littercomp['littercomp']) {
    return <></>;
  }

  littercomp = littercomp.littercomp[0];
  const litterCompTotal = _.sum(_.values(littercomp));
  littercomp = _.mapValues(littercomp, function (o) { return o / litterCompTotal * 100; });

  interface dataPoint {
    name?: string,
    value: number, 
    itemStyle: {
      color: string
    }
  }
  
  let dataPoints: dataPoint[] = [];
  // These arrays are used to keep the colours between litter composition and litter over time consistent
  let colorsArray = [
    "#283B8B",
    "#E5740B",
    "#871A1C",
    "#B9B9B9",

    "#1F7446",
    "#3579B9",
    "#F4B241",
    "#B22B2E",

    "#A92181",
    "#1FB57D",
    "#0090B0",
    "#FFEB38",

    "#D91C60",
    "#AA1EEC",
    "#A9E824",
    "#444444",

    "#6bc77f",
    "#3171ad",
    "#9c2442",
    "#ffa8d5", 
  ];
  var i = 0
  for (const key in littercomp) {
    
    littercomp[key] = Math.round(littercomp[key]);
    var dataPoint = {
      value: littercomp[key], 
      itemStyle: {
        color: colorsArray[i],
      }
    }
    i += 1;
    //console.log(dataPoint)
    dataPoints.push(dataPoint)
    
  }


  let option = {
    color: colorsArray,
    grid: {
      top: "25%",
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    title: {
      text: "Litter Composition",
      subtext: "Breakdown of litter composition across all seabins",
      subtextStyle: {
        color: "rgb(117, 188, 230)",
        fontFamily: 'Proxima Nova',
        fontSize: 12
      },
      textStyle: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontFamily: 'Proxima Nova',
      },
      itemGap: 5
    },
    tooltip: {
      valueFormatter: (value: any) =>  value.toFixed(2) + "%",
      trigger: "item",
      axisPointer: {
        type: "shadow",
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      axisLabel: {
        fontWeight: 'normal',
        fontFamily: 'Proxima Nova',
        fontSize: 12,
        color: '#000',
        formatter: function (value: string, index: number) {
          return `${value}%`;
        }
      },
      max: "dataMax",
      alignTicks: true
    },
    yAxis: {
      splitNumber: 3,
      type: "category",
      data: Object.keys(littercomp),
      inverse: true,
      max: 16,
      name: "Percent (%) of total litter",
      nameGap: 5,
      nameLocation: 'start',
      nameTextStyle: {
        fontWeight: 'bold',
        fontFamily: 'Proxima Nova',
        align: 'left',
        color: '#000'
      },
      axisLabel: {
        interval: 0, //If the label names are too long you can manage this by rotating the label.
        rotate: 0,
        fontWeight: 'normal',
        fontFamily: 'Proxima Nova',
        fontSize: 12,
        color: '#000',
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#000000",
          width: 2
        }
      },
    },
    series: [
      {
        //colorBy: 'data',
        label: {
          // show: true,
          position: "right",
          valueAnimation: true,
        },
        realtimeSort: true,
        type: "bar",
        data: dataPoints,
        emphasis: {
          focus: "self",
          blurScope: "coordinateSystem",
        },
      },
    ],
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
      style={{ height: "100%", paddingLeft: '15px', paddingTop: '15px', paddingRight: '15px' }}
    />
  );
}
