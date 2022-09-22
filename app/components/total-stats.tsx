import { Unit } from "@prisma/client";

import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { UnitsResponse } from '~/routes/resources/units';

interface TotalProgramStatsProps {
  programId: string;
}
export default function TotalProgramStats({ programId }: TotalProgramStatsProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [totalWeightInGrams, setTotalWeightInGrams] = useState<number>(0);
  const [totalVolumeFiltered, setTotalVolumeFiltered] = useState<number>(0);

  const fetcher = useFetcher<UnitsResponse>();
  useEffect(() => {
    if (fetcher.data) {
      setUnits(fetcher.data.units ?? []);
      setTotalVolumeFiltered(fetcher.data.totalVolumeFiltered ?? 0);
      setTotalWeightInGrams(fetcher.data.totalWeightInGrams ?? 0);
    }
  }, [fetcher.data]);
  useEffect(() => {
    fetcher.load(
      `/resources/units?programId=${programId}&includesStats=true`);
  }, [programId]);

  return (
    <div className="mx-[30px] flex justify-between">
      <div className="flex flex-col content-center items-center">
        <p className="text-[20px] font-[800] text-seabin-dark-blue">
          {units.length}
        </p>
        <p className="text-[12px] font-[700] text-seabin-dark-blue line-clamp-2">
          units deployed
        </p>
      </div>
      <div className="flex flex-col content-center items-center">
        <p className="text-[20px] font-[800] text-seabin-dark-blue">
          {totalWeightInGrams / 1000} kg
        </p>
        <p className="text-[12px] font-[700] text-seabin-dark-blue">
          litter captured
        </p>
      </div>
      <div className="flex flex-col content-center items-center">
        <p className="text-[20px] font-[800] text-seabin-dark-blue">
          {totalVolumeFiltered / 1_000_000} ML
        </p>
        <p className="text-[12px] font-[700] text-seabin-dark-blue">
          water filtered
        </p>
      </div>
    </div>
  );
}