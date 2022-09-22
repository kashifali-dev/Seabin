import * as echarts from "echarts";
import ReactEChartsCore from "echarts-for-react/lib/core";

export default function EstimatedMicroPlasticsCount(emc: any) {
  if (!emc || !emc['emc']) {
    return <></>;
  }

  let microplasticpelletsthousands: number[] = [];
  let microfibersthousands: number[] = [];
  for (let i = 0; i < emc["emc"].length; i++) {
    microplasticpelletsthousands = microplasticpelletsthousands.concat(
      parseInt(emc["emc"][i]["Microplastic pellets"]) / 1000
    );
    microfibersthousands = microfibersthousands.concat(
      parseInt(emc["emc"][i]["Microfibers"]) / 1000
    );
  }

  let option = {
    color: [
      "#3579B9",
      "#E5740B",
      "#871A1C",
      "#B9B9B9",
    ],
    title: {
      text: "Estimated Microplastics Count",
      subtext: "Estimation of microplastics (based on pellets and fibers)",
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
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    tooltip: {
      valueFormatter: (value: any) =>  value.toFixed(2) + "k",
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      top: "25%",
      left: "0.75%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
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
          formatter: function(value: string, index: number) {
            return value.charAt(0);
          }
        },
        axisTick: {
          show: false
        }
      },
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: "{value}k",
          fontWeight: 'normal',
          fontFamily: 'Proxima Nova',
          fontSize: 12,
          color: '#000',
        },
        splitNumber: 3,
        type: "value",
        name: "Item count (thousands)",
        nameGap: 5,
        nameTextStyle: {
          fontWeight: 'bold',
          fontFamily: 'Proxima Nova',
          align: 'left',
          color: '#000'
        },
      },
    ],
    series: [
      {
        name: "Microplastic Pellets",
        type: "bar",
        stack: "EMC",
        emphasis: {
          focus: "series",
        },
        data: microplasticpelletsthousands,
      },
      {
        name: "Microfibers",
        barMaxWidth: "60%",
        color: "",
        type: "bar",
        stack: "EMC",
        emphasis: {
          focus: "series",
        },
        data: microfibersthousands,
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
      // onChartReady={this.onChartReadyCallback}
      // onEvents={EventsDict}
      // opts={ }
    />
  );
}
