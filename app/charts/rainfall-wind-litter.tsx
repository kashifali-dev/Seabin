import * as echarts from 'echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';

export default function RainfallWindLitter() {
  let option = {

    title: {
      text: 'Rainfall, Wind, Litter Comparison'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Pellets', 'Foam', 'Cigarette Butts', 'Soft Plastics'],
      bottom: 'bottom'
      
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Pellets',
        type: 'line',
        color: [
            '#e62093',
          ],
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [10000, 3000, 120, 80, 8000, 80, 40]
      },
     
      {
        name: 'Cigarette Butts',
        type: 'line',
        color: [
          '#d62469',
        ],
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [8000, 1500, 201, 154, 6000, 330, 410]
      },
      {
        name: 'Soft Plastics',
        type: 'line',
        color: [
            '#8a1f17',
          ],
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: [8000, 800, 301, 334, 8000, 330, 320]
      },
    ]
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
      style={{ height: '100%' }}
    // onChartReady={this.onChartReadyCallback}
    // onEvents={EventsDict}
    // opts={ }
    />
  );
}