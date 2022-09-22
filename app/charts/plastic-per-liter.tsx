import * as echarts from "echarts";
import ReactEChartsCore from "echarts-for-react/lib/core";
export default function PlasticPerLiter(ppl: any) {
  if (!ppl || !ppl['ppl']) {
    return <></>;
  }

  let pplSums: number[] = [];

  for (let i = 0; i < ppl["ppl"].length; i++) {
    pplSums = pplSums.concat(
      (25000 * parseInt(ppl["ppl"][i]["hoursinoperation"])) /
        (parseInt(ppl["ppl"][i]["Soft plastic wrappers"]) +
          parseInt(ppl["ppl"][i]["Plastic lids"]) +
          parseInt(ppl["ppl"][i]["Plastic straws"]) +
          parseInt(ppl["ppl"][i]["Plastic bags"]) +
          parseInt(ppl["ppl"][i]["Plastic bottles"]) +
          parseInt(ppl["ppl"][i]["Plastic utensils"]) +
          parseInt(ppl["ppl"][i]["Lollipop sticks"]) +
          parseInt(ppl["ppl"][i]["Unidentified soft plastics"]) +
          parseInt(ppl["ppl"][i]["Unidentified hard plastics"])) /
        1000
    );
    
    // microplasticpelletsthousands = microplasticpelletsthousands.concat(parseInt(emc['emc'][i]['microplasticpelletsthousands'])/1000)
    // microfibersthousands = microfibersthousands.concat(parseInt(emc['emc'][i]['microfibersthousands'])/1000)
  }
  //console.log(pplSums)
  let option = {
    color: [
      "#186928",
      "#4097a1",
      "#d99a43",
      "#3d3d39",
      "#782610",
      "#b04325",
      "#ffa8d5",
      "#b0b0b0",
      "#9c2442",
      "#ffef3b",
      "#edbd4c",
    ],
    title: {
      text: "Plastic Per Liter",
      subtext: "Estimation of litres filtered to encounter plastic",
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
        label: {
          precision: 2,
        },
      },
    },

    grid: {
      top: "25%",
      left: "1%",
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
          formatter: function (value: string, index: number) {
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
        name: "Total Plastic Count",
        barMaxWidth: "60%",
        type: "bar",
        emphasis: {
          focus: "series",
        },
        data: pplSums,
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
