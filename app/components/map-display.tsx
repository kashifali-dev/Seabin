import { Unit } from "@prisma/client";
import Map, { Marker } from 'react-map-gl';
import maplibregl from 'maplibre-gl';

import mapLibreStyles from 'maplibre-gl/dist/maplibre-gl.css';
import { LinksFunction } from "@remix-run/node";
import { getCenterOfBounds } from "geolib";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { UnitsResponse } from '~/routes/resources/units';

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: mapLibreStyles }
  ];
};

interface MapDisplayProps {
  programId: string;
}
export default function MapDisplay({ programId }: MapDisplayProps) {
  const [unitsLocation, setUnitsLocation] = useState<{ latitude: number, longitude: number; }[]>([]);

  const fetcher = useFetcher<UnitsResponse>();
  useEffect(() => {
    if (fetcher.data && fetcher.data.units.length > 0) {
      // fetcher just completed a fetch
      setUnitsLocation(fetcher.data.units
        .filter(u => u.lat != null && u.lng != null)
        .map(u => {
          return {
            latitude: u.lat ?? 0,
            longitude: u.lng ?? 0
          };
        }));
    } else {
      setUnitsLocation([]);
    }
  }, [fetcher.data]);
  useEffect(() => {
    fetcher.load(
      `/resources/units?programId=${programId}`);
  }, [programId]);

  return (
    <div>
      {unitsLocation.length > 0 &&
        <Map
          mapLib={maplibregl}
          // TODO: Bound this to around the markers
          initialViewState={{
            longitude: getCenterOfBounds(unitsLocation).longitude,
            latitude: getCenterOfBounds(unitsLocation).latitude,
            zoom: 9.8
          }}
          style={{ width: 340, height: 190 }}
          mapStyle="osm-map-style.json"
          interactive={true}
        >
          {unitsLocation
            .map(u => (
              <Marker longitude={u.longitude} latitude={u.latitude} key={`${u.latitude}-${u.longitude}`}></Marker>
            ))}
        </Map>
      }
    </div>
  );
}