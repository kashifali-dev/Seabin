import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FlatSponsorForUnit } from "~/services/programs.server";
import { SponsorsResponse } from "~/routes/resources/sponsors";
import SponsorsDisplay, { SponsorsDisplayType } from "~/components/sponsors-display";

interface SponsorsProps {
  programId: string;
}
export default function Sponsors({ programId }: SponsorsProps) {
  const [sponsors, setSponsors] = useState<FlatSponsorForUnit[]>([]);

  const fetcher = useFetcher<SponsorsResponse>();
  useEffect(() => {
    if (fetcher.data) {
      setSponsors(fetcher.data.flatSponsors ?? []);
    }
  }, [fetcher.data]);
  useEffect(() => {
    fetcher.load(
      `/resources/sponsors?programId=${programId}`);
  }, [programId]);

  return (
    <>
      <div className="mt-[47px] ml-[30px] mr-[30px] mb-0">
        <div>
          <SponsorsDisplay
            sponsors={sponsors}
            displayType={SponsorsDisplayType.PRINCIPAL_MAJOR}></SponsorsDisplay>
        </div>
      </div>
      <div className="mt-[20px] ml-[30px] mr-[30px] mb-[30px]">
        <div>
          <SponsorsDisplay
            sponsors={sponsors}
            displayType={SponsorsDisplayType.UNIT}></SponsorsDisplay>
        </div>
      </div>
    </>
  );
}