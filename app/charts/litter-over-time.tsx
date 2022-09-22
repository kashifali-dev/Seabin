import * as echarts from "echarts";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { litterovertime, rainfall } from "~/services/reports-service.server";
import _ from "lodash";

interface LitterOverTimeProps {
  litterovertime: [litterovertime] | null | undefined;
  rainfall: [rainfall] | null | undefined;
}
export default function LitterOverTime({litterovertime, rainfall}: LitterOverTimeProps) {
  if (!litterovertime || !rainfall) {
    return <></>;
  }
  //loop through to make sure we get EVERY litter data type
  let litterTypes: string[] = [];
  for (var month in litterovertime) {
    var entries = Object.keys(litterovertime[month]);
    for (var entry in entries) {
      //console.log(entries[entry])
      if (!litterTypes.includes(entries[entry])) {
        litterTypes = litterTypes.concat(entries[entry]);
      }
    }
  }

  let rainfallSeriesMin = 0;
  let rainfallSeriesMax = Math.ceil(_.max(_.map(rainfall, 'avg')) ?? 0);
  let rainfallChartData = _.map(_.sortBy(rainfall, 'months'), 'avg');
  var series = createSeries(litterovertime, litterTypes, rainfallChartData);

  let option = {
    color: [
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
    ],
    grid: {
      backgroundColor: "white",
      top: "25%",
      left: "0.5%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    //color: ['#664cb5', '#3ba272', '#326ba8', '#32a89b'],
    title: {
      text: "Litter Over Time",
      subtext: "Breakdown of litter composition over months",
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
      trigger: "item",
      confine: true,
      axisPointer: {
        // Use axis to trigger tooltip
        type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
      },
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      data: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisLabel: {
        fontWeight: 'normal',
        fontFamily: 'Proxima Nova',
        fontSize: 12,
        color: '#000',
        formatter: function (value: string, index: number) {
          return value.charAt(0);
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Item count (thousands)',
        position: 'left',
        alignTicks: true,
        axisLabel: {
          formatter: '{value}'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#000000",
            width: 2
          }
        },
        nameTextStyle: {
          fontWeight: 'bold',
          fontFamily: 'Proxima Nova',
          align: 'left'
        },
      },
      {
        type: 'value',
        name: 'Rainfall',
        nameTextStyle: {
          fontWeight: 'bold',
          fontFamily: 'Proxima Nova',
          align: 'left'
        },
        position: 'right',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: "#000000",
            width: 2
          }
        },
        axisLabel: {
          formatter: function(value: number) {
            return `${Math.ceil(value)} ml`
          }
        },
        min: rainfallSeriesMin,
        max: rainfallSeriesMax
      },
    ],
    series: series,
  };
  return <ReactEChartsCore
    echarts={echarts}
    option={option}
    notMerge={true}
    lazyUpdate={true}
    theme={"theme_name"}
    style={{ height: "100%", paddingLeft: '15px', paddingTop: '15px', paddingRight: '15px' }}
  />;
}

function createSeries(litterovertime: any, litterTypes: any, rainfallData: number[]) {
  interface series {
    name: string;
    type: string;
    stack?: string;
    emphasis: {
      focus: string;
    };
    data: Array<number>;
  }
  let seriesList: series[] = [];

  for (let i = 0; i < litterTypes.length; i++) {
    if (litterTypes[i] != "months") {
      var litterTypeSumData = getLitterTypeData(litterovertime, litterTypes[i]);
      var litterTypeSeries = {
        colorBy: 'series',
        name: litterTypes[i],
        type: "bar",
        barMaxWidth: "60%",
        stack: "total",
        emphasis: {
          focus: "series",
        },
        data: litterTypeSumData,
      };
      //var litterTypeData = getTotalLitterTypeSum(litterTypes[i]){} (this should return an array of length 12 with data per month)
      seriesList.push(litterTypeSeries);
    }
  }
  var rainfallSeries = {
    colorBy: 'series',
    name: 'Rainfall',
    type: 'line',
    emphasis: {
      focus: "self",
    },
    yAxisIndex: 1,
    data: rainfallData,
    lineStyle: {
      color: "#000"
    },
    itemStyle: {
      color: "#000"
    }
    //need to sub in real data here 
  };
  seriesList.push(rainfallSeries);
  return seriesList;
}
function getLitterTypeData(litterOverTime: any, litterType: any) {
  let dataList: number[] = [];
  //for month in litterOverTime
  //datalist.push(litterOverTime[month].litterType)
  for (var month in litterOverTime) {
    dataList.push(parseInt(litterOverTime[month][litterType]));
  }
  return dataList;
  
}
