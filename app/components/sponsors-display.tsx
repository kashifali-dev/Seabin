import { SponsorshipTier } from "@prisma/client";
import _ from "lodash";
import { FlatSponsorForUnit } from "~/services/programs.server";

export const SponsorsDisplayType = {
  PRINCIPAL_MAJOR: 'PRINCIPAL_MAJOR',
  UNIT: 'UNIT',
};
export type SponsorsDisplayType = (typeof SponsorsDisplayType)[keyof typeof SponsorsDisplayType]

interface SponsorGridDisplayPropType {
  sponsors: { name: string; tier: SponsorshipTier; imageLink: string; }[];
  header: string;
}

function SponsorGridDisplay({ sponsors, header }: SponsorGridDisplayPropType) {
  return (
    <div>
      <p className="text-[12px] font-[700] pb-[7px]">{header}</p>
      <div className="grid grid-cols-2 gap-px w-full">
        {sponsors.map(sponsor => (
          <div className="flex items-center justify-center w-full h-[40px] bg-seabin-white" key={sponsor.name}>
            <img className="h-[20px]" src={sponsor.imageLink} alt={sponsor.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface SponsorsDisplayPropType {
  sponsors: FlatSponsorForUnit[];
  displayType: SponsorsDisplayType;
}

export default function SponsorsDisplay({ sponsors, displayType }: SponsorsDisplayPropType) {
  let principalSponsors = [..._.uniqWith(
    sponsors
      .filter(s => s.tier == 'PRINCIPAL')
      .map(s => { return { name: s.name, tier: s.tier, imageLink: s.imageLink }; }), _.isEqual)];
  let majorSponsors = [..._.uniqWith(
    sponsors
      .filter(s => s.tier == 'MAJOR')
      .map(s => { return { name: s.name, tier: s.tier, imageLink: s.imageLink }; }), _.isEqual)];
  const unitSponsors = [..._.uniqWith(
    sponsors
      .filter(s => s.tier == 'UNIT')
      .map(s => { return { name: s.name, tier: s.tier, imageLink: s.imageLink }; }), _.isEqual)];
  if (displayType == SponsorsDisplayType.PRINCIPAL_MAJOR) {
    if (principalSponsors.length > 0 && majorSponsors.length > 0) {
      return (
        <div className="flex flex-row space-x-px">
          <div className="w-1/2">
            <p className="text-[12px] font-[700] pb-[7px]">Principal sponsors</p>
            <div className="grid grid-flow-row gap-px">
              {principalSponsors.map(sponsor => (
                <div className="flex items-center justify-center w-full h-[40px] bg-seabin-white" key={sponsor.name}>
                  <img className="h-[20px]" src={sponsor.imageLink} alt={sponsor.name} />
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2">
            <p className="text-[12px] font-[700] pb-[7px]">Major sponsors</p>
            <div className="grid grid-flow-row gap-px">
              {majorSponsors.map(sponsor => (
                <div className="flex items-center justify-center w-full h-[40px] bg-seabin-white" key={sponsor.name}>
                  <img className="h-[20px]" src={sponsor.imageLink} alt={sponsor.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      // single sponsor on the stage
      const sponsors = principalSponsors.length > 0 ? principalSponsors : majorSponsors;
      const sponsorTierText = principalSponsors.length > 0 ? 'Principal sponsors' : 'Major sponsors';
      return (
        <SponsorGridDisplay sponsors={sponsors} header={sponsorTierText}></SponsorGridDisplay>
      );      
    }
  } else if (displayType == SponsorsDisplayType.UNIT) {
    const sponsors = unitSponsors;
    const sponsorTierText = 'Unit sponsors';
    return (
      <SponsorGridDisplay sponsors={sponsors} header={sponsorTierText}></SponsorGridDisplay>
    ); 
  } else {
    // unknown case
    return <div>No sponsors can be displayed.</div>
  }
}