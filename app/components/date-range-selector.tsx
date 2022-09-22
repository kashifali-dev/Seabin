import { Tabs, TabList, TabPanels, TabPanel } from "@reach/tabs";
import subMonths from "date-fns/subMonths";
import { useState } from 'react';
import { format, getYear, subYears } from "date-fns";
import { DateRange, RangeKeyDict } from "react-date-range";
import invariant from "tiny-invariant";
import StyledTimePeriodTab from "./styled-tab";

interface DateRangeSelector {
  initialStartDate: Date;
  initialEndDate: Date;
  onStartDateChanged: (newDate: Date) => void;
  onEndDateChanged: (newDate: Date) => void;
  selectedTabIndex: number;
};

export function DateRangeSelector({ initialStartDate, initialEndDate, onStartDateChanged, onEndDateChanged, selectedTabIndex }: DateRangeSelector) {
  // Default start date is on the first time periods tab of 3 months selection
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const updateStartDate = (date: Date): void => {
    setStartDate(date);
    onStartDateChanged(date);
  }

  const updateEndDate = (date: Date): void => {
    setEndDate(date);
    onEndDateChanged(date);
  }

  const [dateRange, setDateRange] = useState([{
    startDate: startDate,
    endDate: endDate,
    key: 'selection'
  }]);
  const handleDateRangePicked = (item: RangeKeyDict) => {
    invariant(item.selection.startDate != null);
    invariant(item.selection.endDate != null);
    setDateRange([{
      startDate: item.selection.startDate,
      endDate: item.selection.endDate,
      key: 'selection'
    }]);
    updateStartDate(item.selection.startDate);
    updateEndDate(item.selection.endDate);
  };

  let timePeriods = [
    { label: "3 months", key: "3months" },
    { label: "YTD", key: "ytd" },
    { label: "12 months", key: "12months" },
    { label: "Custom", key: "custom" },
  ];
  const [timePeriodIndex, setTimePeriodIndex] = useState(selectedTabIndex);
  const handleTimePeriodIndexTabsChange = (
    index: React.SetStateAction<number>
  ) => {
    let tabIndex = +index;

    let now = new Date();
    updateEndDate(now);
    switch (timePeriods[tabIndex].key) {
      case '3months':
        updateStartDate(subMonths(new Date(), 3));
        break;
      case 'ytd':
        updateStartDate(new Date(getYear(now), 0, 1));
        break;
      case '12months':
        updateStartDate(subYears(new Date(), 1));
        break;
      case 'custom':
      // custom set, fall through to break
      default:
        break;
    }
    setTimePeriodIndex(index);
  };

  return (
    <Tabs
      index={timePeriodIndex}
      onChange={handleTimePeriodIndexTabsChange}
    >
      <TabList className="h-[30px] mb-[15px]">
        {timePeriods.map((timePeriod, timePeriodIndex) => (
          <StyledTimePeriodTab index={timePeriodIndex} className="w-1/4 h-full" key={timePeriod.key}>
            {timePeriod.label}
          </StyledTimePeriodTab>
        ))}
      </TabList>
      <TabPanels>
        {timePeriods.map((timePeriod, timePeriodIndex) => {
          if (timePeriod.key != 'custom') {
            return (
              <TabPanel key={timePeriod.key}>
                <p className="text-xs font-bold pb-[6px]">
                  {format(startDate, 'd MMM y')} – {format(endDate, 'd MMM y')}
                </p>
              </TabPanel>
            );
          } else {
            return (
              <TabPanel key={timePeriod.key}>
                <p className="text-xs font-bold pb-[6px]">
                  {format(startDate, 'd MMM y')} – {format(endDate, 'd MMM y')}
                </p>
                <DateRange
                  editableDateInputs={true}
                  onChange={handleDateRangePicked}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                />
              </TabPanel>
            );
          }
        })}
      </TabPanels>
    </Tabs>
  );
}