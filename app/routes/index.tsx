import { Tabs, TabList, TabPanels, TabPanel } from "@reach/tabs";
import VisuallyHidden from "@reach/visually-hidden";

import { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node";
import React, { useState } from "react";
import StyledTab from "~/components/styled-tab";

import reachTabsStyles from "@reach/tabs/styles.css";
import reachListBoxStyles from "@reach/listbox/styles.css";
import { authenticator } from "~/services/auth.server";

import { db } from "~/utils/db.server";
import User from "~/services/User";
import { useLoaderData } from "@remix-run/react";

import reactDateRangeMainStyles from 'react-date-range/dist/styles.css';
import reactDateRangeDefaultTheme from 'react-date-range/dist/theme/default.css';
import { getCityPrograms } from "~/services/programs.server";

import MapDisplay from "~/components/map-display";
import mapLibreStyles from 'maplibre-gl/dist/maplibre-gl.css';
import overrideProgramListBoxStyles from '~/css/program-listbox.css';
import { ProgramSelector } from "~/components/program-selector";
import { DateRangeSelector } from "~/components/date-range-selector";
import { subMonths } from "date-fns";

import { Charts } from '~/components/charts';
import TotalProgramStats from "~/components/total-stats";
import Sponsors from "~/components/sponsors";

export type LoaderData = {
  cityPrograms: { id: string; name: string; }[];
  user: User | null;
  hideWatermarks: boolean;
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: reachTabsStyles },
    { rel: "stylesheet", href: reachListBoxStyles },
    { rel: "stylesheet", href: reactDateRangeMainStyles },
    { rel: "stylesheet", href: reactDateRangeDefaultTheme },
    { rel: "stylesheet", href: mapLibreStyles },
    { rel: "stylesheet", href: overrideProgramListBoxStyles },
  ];
};

export let action: ActionFunction = async ({ request }) => {
  return await authenticator.authenticate("ibm-appid", request, {
    successRedirect: "/reports",
    failureRedirect: "/login",
  });
};

// Unauthenticated users should only see the login screen (previously they saw watermarked charts) √
// callback URL is hardocded to localhost and we need to modify this for CE 

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate("ibm-appid", request, {
    failureRedirect: "/reroute",
  });
  const user = await authenticator.isAuthenticated(request);
  const cityPrograms = await getCityPrograms(db);
  return {
    user: user,
    cityPrograms: cityPrograms,
    hideWatermarks: user != null
  };
};

export default function Index() {
  const loaderData = useLoaderData<LoaderData>();

  const [dataCategoryIndex, setDataCategoryIndex] = React.useState(0);
  const handleDataCategoryTabsChange = (
    index: React.SetStateAction<number>
  ) => {
    setDataCategoryIndex(index);
  };

  const [programId, setProgramId] = React.useState(loaderData.cityPrograms[0].id);
  const updateProgramId = (id: string): void => {
    setProgramId(id);
  };

  const [startDate, setStartDate] = useState(new Date(2021, 0, 1));
  const [endDate, setEndDate] = useState(new Date(2022, 0, 1));
  const updateStartDate = (date: Date): void => {
    setStartDate(date);
  };
  const updateEndDate = (date: Date): void => {
    setEndDate(date);
  };

  return (
    <div>
      <nav className="w-full top-0 h-[110px] flex items-center justify-center">
        <div
          id="nav-header"
          className="w-full pl-[30px] bg-seabin-white items-center flex"
        >
          <img
            src="ohp-logo.png"
            alt="Ocean Health Platform logo"
            className="h-[50px] pr-[15px]"
          />
          <div>
            <a
              href="#"
              className="text-black no-underline hover:no-underline font-extrabold text-4xl text-[2.25rem]"
            >
              OCEAN HEALTH PLATFORM
            </a>
            <div className="flex items-baseline w-full">
              <p className="pr-[16px] text-xs">
                Monitoring the health of our ocean
              </p>
              <p className="text-xs font-bold">by Seabin Project</p>
            </div>
          </div>
        </div>
        <div className="pr-[30px]">
          {
            loaderData.user ? (
              <>
                <form action="/logout" method="get">
                  <button type="submit" className="bg-seabin-red w-[170px] h-[40px] text-seabin-white text-[16px] font-bold">
                    Logout
                  </button>
                </form>
              </>) : (
              <>
                <form action="/login" method="get">
                    <button type="submit" className="bg-seabin-blue w-[170px] h-[40px] text-seabin-white text-[16px] font-bold">
                    Login
                  </button>
                </form>
              </>
            )
          }
        </div>
      </nav>
      <div id="content" className="flex">
        {/* Filters */}
        <div
          id="filters"
          className="bg-seabin-blue bg-opacity-10 w-[26rem] min-w-[410px] mr-2"
        >
          <div className="mt-[60px] ml-[30px] mr-[30px] mb-0">
            <p className="text-xs font-bold pb-[6px]">
              Show me the data about Seabins under...
            </p>
            <div id="program-location-selector">
              <Tabs
                index={dataCategoryIndex}
                onChange={handleDataCategoryTabsChange}
              >
                <TabList className="h-[30px]">
                  <StyledTab index={0} className="w-3/6 h-full">
                    Program
                  </StyledTab>
                  <StyledTab index={1} className="w-3/6 h-full">
                    Location
                  </StyledTab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div
                      id="program-selector-container"
                      className="h-[78px] w-full"
                    >
                      <VisuallyHidden id="program-selector">
                        Choose a smart city program
                      </VisuallyHidden>
                      <ProgramSelector programs={loaderData.cityPrograms} onProgramIdChanged={updateProgramId}></ProgramSelector>
                    </div>
                  </TabPanel>
                  <TabPanel>Location selected</TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </div>
          <div className="mt-[30px] ml-[30px] mr-[30px] mb-0">
            <p className="text-xs font-bold pb-[6px]">
              over the following period...
            </p>
            <div id="time-period-sector" className="pb-[11px] min-h-[30px]">
              <DateRangeSelector
                initialStartDate={startDate} initialEndDate={endDate}
                selectedTabIndex={3}
                onStartDateChanged={updateStartDate} onEndDateChanged={updateEndDate}></DateRangeSelector>
            </div>
          </div>
          <div className="mt-[45px] ml-[30px] mr-[30px] mb-0">
            <MapDisplay programId={programId}></MapDisplay>
          </div>
          <div className="mt-[15px] ml-[30px] mr-[30px] mb-0">
            <TotalProgramStats programId={programId}></TotalProgramStats>
          </div>
          <Sponsors programId={programId}></Sponsors>
        </div>
        {/* Charts */}
        <div
          className="bg-seabin-light-blue bg-opacity-10 w-screen"
        >
          <div className="ml-[30px] mt-[45px] mr-[30px] mb-[70px] text-[20px] flex justify-between">
            <div>
              <p>Explore the health of our oceans under the <span className="font-bold">City of Sydney program</span></p>
            </div>
          </div>
          <div id="charts" className="ml-[30px] mr-[30px]">
            <Charts startDate={startDate} endDate={endDate} programId={programId} hideWatermarks={loaderData.hideWatermarks}></Charts>
          </div>
        </div>
      </div>
    </div>
  );
}
