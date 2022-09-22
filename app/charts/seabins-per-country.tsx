import * as echarts from 'echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';

export default function SeaBinsPerCountry() {
  let option = {
    title: {
      text: 'Seabins per country'
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    series: [
      {
        type: 'treemap',
        data: [
          {
            name: 'Hawaii',
            value: 10,
            children: [
              {
                name: 'Hawaii Area 3',
                value: 4
              },
              {
                name: 'Hawaii Area 1',
                value: 6
              },
              {
                name: 'Hawaii Area 2',
                value: 4
              }
            ]
          },
          {
            name: 'Australia',
            value: 15,
            children: [
              {
                name: 'NSW',
                value: 15,
                children: [
                  {
                    name: 'Sydney Area 1',
                    value: 15
                  },
                  {
                    name: 'Sydney Area 2',
                    value: 10
                  },
                  {
                    name: 'Sydney Area 3',
                    value: 5
                  }
                ]
              }
            ]
          }
        ]
      }
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