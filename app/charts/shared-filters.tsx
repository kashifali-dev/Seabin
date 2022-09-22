import { useLoaderData } from "@remix-run/react";
import * as echarts from "echarts";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { emc } from "~/routes/reroute";

// import { db } from "~/utils/db.server";

export default function SharedFilters() {
 //console.log(emc)
 let option = {
    legend: {
        // Try 'horizontal'
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
 }

  return (
    <div>
    <h1>Litter Breakdown</h1>
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
    </div>
  );
}
  
