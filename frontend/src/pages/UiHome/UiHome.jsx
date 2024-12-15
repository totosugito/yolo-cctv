import React, {useEffect, useState} from 'react';
import {AppFooter, AppNavbar, BodyContents} from "src/components/app";
import {IntervalCheckApi, SERVER_URL} from "src/constants/config";
import toast from "react-hot-toast";
import {WebLoading} from "shared/components/base";
import {httpGet} from "shared/service/http-api";
import MapCctv from "./component/MapCctv";
import SidebarCctvList from "./component/SidebarCctvList";
import {getFormattedDateTime} from "src/constants/map-config";
function UiHome() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [lastCheck, setLastCheck] = useState("");

  const get_data = async (showLoading=false) => {
    if(showLoading) {
      setLoading(true);
    }
    await httpGet(SERVER_URL + "/cctv-latest", {}).then(response => {
      if (response.isError) {
        console.log(response);
      } else {
        if(data?.timestamp !== response?.timestamp) {
          setData(response);
        }
      }
    });
    setLastCheck(getFormattedDateTime());
    toast.success("Data Updated ...");

    if(showLoading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    get_data(true).then(r => {
    });

    // Set interval to fetch data every 1 minute
    const intervalId = setInterval(get_data, IntervalCheckApi);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={"h-screen flex flex-col"}>
      <AppNavbar timestamp={data?.timestamp ?? ""} lastCheck={lastCheck}/>
      {loading ? <WebLoading/> : <BodyContents>
        <div className={"flex flex-row h-full"}>
          <SidebarCctvList data={data?.data ?? []} timestamp={data?.timestamp ?? ""}/>
          <div className={"flex-1"}>
            <MapCctv points={data?.data ?? []} timestamp={data?.timestamp ?? ""}/>
          </div>
        </div>
      </BodyContents>}
      <AppFooter/>
    </div>
  );
}

export default UiHome;
