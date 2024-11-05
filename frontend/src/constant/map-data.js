import {SERVER_URL} from "src/constant/app-variables";

export const mapTileList = [
  {
    key: "opentstreetmap",
    name: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    thumbnail: ""
  },
  {
    key: "opentopomap",
    name: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap contributors",
    thumbnail: ""
  },
  {
    key: "default",
    name: "Default",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; DEVELOPED BY IT SUPPORT BCC",
    thumbnail: ""
  },
]

export function getTileMap(key) {
  let selected = mapTileList.find(obj => obj.key === key);
  if (selected === undefined) {
    selected = mapTileList[0];
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
  return (SERVER_URL + "/streams/images/" + cctv?.cctv?.no + "_" + timestamp + ".jpg");
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
