import {SERVER_URL} from "src/constants/config";

export const DEFAULT_MAP_TILE = "opentstreetmap";
export const mapTileList = [
    {
        key: "esri-world",
        name: "Esri Satellite",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: "© Esri © OpenStreetMap Contributors",
        thumbnail: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/5/16/25"
    },
    {
        key: "opentstreetmap",
        name: "OpenStreetMap",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: "&copy; OpenStreetMap contributors",
        thumbnail: "https://c.tile.openstreetmap.org/5/25/16.png"
    },
    {
        key: "opentopomap",
        name: "OpenTopoMap",
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attribution: "&copy; OpenTopoMap contributors",
        thumbnail: "https://c.tile.opentopomap.org/5/25/16.png"
    },
    {
        key: "google-satellite",
        name: "Google Satellite",
        url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        attribution: "&copy; Google",
        thumbnail: "https://mt1.google.com/vt/lyrs=s&x=25&y=16&z=5"
    },
]

export const mapLegendTraffic = [
  {
    id: 0,
    key: "poor",
    view: "circle",
    name: "Lenggang",
    bgColor: "#00FF00",
    borderColor: "#000000",
    min: 0.25,
    size: "16px"
  },
  {
    id: 1,
    key: "fair",
    view: "circle",
    name: "Longgar",
    bgColor: "#FFFF00",
    borderColor: "#000000",
    min: 0.5,
    size: "16px"
  },
  {
    id: 2,
    key: "good",
    view: "circle",
    name: "Ramai",
    bgColor: "#FF8C00",
    borderColor: "#000000",
    min: 0.75,
    size: "16px"
  },
  {
    id: 3,
    key: "excellent",
    view: "circle",
    name: "Padat",
    bgColor: "#FF0000",
    borderColor: "#000000",
    min: 1,
    size: "16px"
  },
];


export function getMarkerColor(value) {
  if (value < 4) {
    return "#00FF00";
  } else if (value < 8) {
    return "#FFFF00";
  } else if (value < 10) {
    return "#FF8C00";
  } else {
    return "#FF0000";
  }
}

export function getCctvImage(cctv, timestamp) {
  return (SERVER_URL + "/streams/images/" + timestamp.substring(0, 10) + "/" + cctv?.no + "_" + timestamp + ".jpg");
}

export function getFormattedDateTime() {
  const now = new Date();

  // Get date components
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = now.getFullYear();

  // Get time components
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  // Format as DD/MM/YYYY HH:MM:SS
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function getTileMap(key) {
    let selected = mapTileList.find(obj => obj.key === key);
    if (selected === undefined) {
        selected = mapTileList[0];
    }
    return (selected);
}

export function getMapLegendItem(mapLegends, key) {
    let selected = mapLegends.find(obj => obj.key === key.toLowerCase());
    if (selected === undefined) {
        selected = mapLegends[0];
    }

    return (selected);
}

export function defaultMapProps() {
  return(
    {
      "initial": {
        center: [-6.899503, 107.619231],
        zoom: 13,
      },
      "wells": {
        "type": "FeatureCollection",
        "crs": {
          "type": "name",
          "properties": {
            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
          }
        },
        "projects": []
      }
    }
  )
}
