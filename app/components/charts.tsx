import EstimatedMicroPlasticsCount from "~/charts/estimated-microplastics";
import LitterCaptured from "~/charts/litter-compositon";
import LitterOverTime from "~/charts/litter-over-time";
import PlasticPerLiter from "~/charts/plastic-per-liter";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
import { ReportDataType } from "~/routes/resources/reports";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

import { emc, ppl, littercomp, litterovertime, rainfall } from '~/services/reports-service.server';

import logo from "~/assets/watermarks/seabin_logo.png";

interface ChartsProps {
  startDate: Date;
  endDate: Date;
  programId: string;
  hideWatermarks: boolean;
};

export function Charts({ programId, startDate, endDate, hideWatermarks: hideWatermarks }: ChartsProps) {

  const breakpoints = {
    // tailwind default breakpoints
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    // react-grid-layout suggested breakpoints
    xs: 480,
    xxs: 0,
  };
  const layouts = {
    xl: [
      { i: "00", x: 0, y: 0, w: 1, h: 8, minH: 4 },
      { i: "10", x: 1, y: 0, w: 1, h: 8, minH: 4 },
      { i: "20", x: 0, y: 1, w: 2, h: 4, minH: 4 },
      { i: "30", x: 0, y: 2, w: 1, h: 12, minH: 4 },
      { i: "40", x: 1, y: 3, w: 1, h: 12, minH: 4 },
      { i: "50", x: 2, y: 3, w: 1, h: 10, minH: 4 },
    ],
  };

  const reportsDataFetcher = useFetcher<ReportDataType>();
  useEffect(() => {
    reportsDataFetcher.load(
      `/resources/reports?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&programId=${programId}`);
  }, [startDate, endDate, programId]);

  const [emcData, setEmcData] = useState<[emc]>();
  const [pplData, setPplData] = useState<[ppl]>();
  const [litterCompData, setlitterCompData] = useState<[littercomp]>();
  const [litterOverTimeData, setlitterOverTimeData] = useState<[litterovertime]>();
  const [rainfallData, setRainfallData] = useState<[rainfall]>();

  useEffect(() => {
    if (reportsDataFetcher.data) {
      setEmcData(reportsDataFetcher.data.emc)
      setPplData(reportsDataFetcher.data.ppl)
      setlitterCompData(reportsDataFetcher.data.littercomp)
      setlitterOverTimeData(reportsDataFetcher.data.litterovertime)
      setRainfallData(reportsDataFetcher.data.rainfall)
    }
  }, [reportsDataFetcher.data]);

  return (
    <div>
      <p className="text-[20px] font-[700]">Totals</p>
      <ResponsiveGridLayout
        style={{marginLeft: '-10px'}}
        layouts={layouts}
        breakpoints={breakpoints}
        cols={{ xl: 2, lg: 2, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={30}
        width={1280}
        onBreakpointChange={onBreakpointChange}
        isResizable={true}
      >
        <div key="00" className="bg-seabin-white">
          <EstimatedMicroPlasticsCount
            emc={emcData}
          ></EstimatedMicroPlasticsCount>
          {hideWatermarks ? <></> : <img src={logo} className="watermark" />}
        </div>
        <div key="10" className="bg-seabin-white">
          <PlasticPerLiter ppl={pplData}></PlasticPerLiter>
          {hideWatermarks ? <></> : <img src={logo} className="watermark"/>}
        </div>

      </ResponsiveGridLayout>
      <p className="text-[20px] font-[700]">Litter breakdown</p>
      <ResponsiveGridLayout
        style={{ marginLeft: '-10px' }}
        layouts={layouts}
        breakpoints={breakpoints}
        cols={{ xl: 2, lg: 2, md: 2, sm: 1, xs: 1, xxs: 1 }}
        rowHeight={20}
        width={1280}
        onBreakpointChange={onBreakpointChange}
        isResizable={true}
      >
        <div key="30" className="bg-seabin-white">
          <LitterCaptured littercomp={litterCompData}></LitterCaptured>
          {hideWatermarks ? <></> : <img src={logo} className="watermark" />}
        </div>
        <div key="40" className="bg-seabin-white">
          <LitterOverTime litterovertime={litterOverTimeData} rainfall={rainfallData}></LitterOverTime>
          {hideWatermarks ? <></> : <img src={logo} className="watermark" />}
        </div>

      </ResponsiveGridLayout>
    </div>
  );
}

function onBreakpointChange(newBreakpoint: string, newCols: number) {
  // console.log(`current breapoint: ${newBreakpoint}, cols: ${newCols}`);
}
