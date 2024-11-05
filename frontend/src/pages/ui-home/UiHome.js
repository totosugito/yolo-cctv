import React, {useEffect, useState} from 'react';
import {AppFooter, AppNavbar, AppSidebar, BodyContents} from "src/components/body";
import {WebLoading} from "src/components/views";
import CctvMap from "src/components/map/CctvMap";
import {httpGet} from "src/service/http-api";
import {IntervalCheckApi, SERVER_URL} from "src/constant/app-variables";
import {getFormattedDateTime} from "src/constant/map-data";
import toast from "react-hot-toast";

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
          <AppSidebar data={data?.data ?? []} timestamp={data?.timestamp ?? ""}/>
          <div className={"flex-1"}>
            <CctvMap points={data?.data ?? []} timestamp={data?.timestamp ?? ""}/>
          </div>
        </div>
      </BodyContents>}
      <AppFooter/>
    </div>
  );
}

export default UiHome;
