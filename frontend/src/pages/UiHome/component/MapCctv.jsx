import {MapContainer, TileLayer, ScaleControl, Marker, Popup} from "react-leaflet";
import {useState} from "react";
import "src/assets/leaflet/leaflet.css";
import DialogCctvDetails from "./DialogCctvDetails";
import {MapControl, ViewCustomLegend} from "shared/map";
import {defaultMapProps, getMarkerColor, getTileMap, mapLegendTraffic} from "src/constants/map-config";
import {useTranslation} from "react-i18next";

const MapCctv = ({points, timestamp}) => {
  const {t} = useTranslation();
  const [map, setMap] = useState(null);
  const [selectedTile, setSelectedTile] = useState("default");
  const MapProps = defaultMapProps();
  const [confirmationModal, setConfirmationModal] = useState(null);

  const createCustomMarker = (point) => {
    const markerProp = {
      borderColor: "#000",
      bgColor: getMarkerColor(point?.data?.total ?? 0),
      label: point?.data?.total ?? 0,
    };
    const html = `<div
      class="flex w-[24px] h-[24px] rounded-full text-[9px] items-center
      justify-center font-bold border"
      style="background-color: ${markerProp["bgColor"]}; border-color: ${markerProp["borderColor"]};
      position: relative; left: -10px; top: -10px;
      color: black;
      -webkit-text-stroke-color: #000; -webkit-text-stroke-width: 0">
        ${markerProp["label"] ?? ""}
      </div>`;

    const icon = L.divIcon({
      iconAnchor: [0, 0],
      labelAnchor: [0, 0],
      popupAnchor: [15, 0],
      html: html
    });

    return (icon);
  };

  const createCustomPopup = (point) => {
    return (
      <div className="dynamic-popup">
        <div className={"font-bold text-sm"}>{point?.cctv?.no}. {point?.cctv?.cctv_name}</div>
        <div>Motor : {point?.data?.count?.motorcycle ?? 0}</div>
        <div>Mobil : {point?.data?.count?.car ?? 0}</div>
        <div>Bis : {point?.data?.count?.bus ?? 0}</div>
        <div>Truck : {point?.data?.count?.truck ?? 0}</div>
        <button className={"btn btn-sm btn-neutral mt-2"}
          onClick={() =>
          setConfirmationModal({
            btn1Text: "Close",
            cctv: point,
            timestamp: timestamp,
            btn1Handler: () => setConfirmationModal(null),
          })
        }>
          Details
        </button>
      </div>
    );
  }

  return (
    <div className={"h-full"}>
      <MapContainer
        className={"h-full"}
        style={{zIndex: 0}}
        center={MapProps["initial"]["center"]}
        zoom={MapProps["initial"]["zoom"]}
        ref={setMap}
        zoomControl={false}>
        <TileLayer
          attribution={getTileMap(selectedTile)["attribution"]}
          url={getTileMap(selectedTile)["url"]}
        />

        <MapControl selectedTile={selectedTile} setSelectedTile={setSelectedTile} initialLegend={true} legendMode={"legend"}>
          <ViewCustomLegend title={t("map.mapLegend")} legends={mapLegendTraffic}/>
        </MapControl>

        {points.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lng]} icon={createCustomMarker(point)}>
            <Popup>{createCustomPopup(point)}</Popup>
          </Marker>
        ))}
        <ScaleControl imperial={false}/>
      </MapContainer>
      {confirmationModal && <DialogCctvDetails modalData={confirmationModal}/>}
    </div>
  )
}

export default MapCctv
