import React, {useEffect, useState} from 'react';
import {AppFooter, AppNavbar, BodyContents} from "src/components/app";
import {IntervalCheckApi} from "src/constants/config";
import toast from "react-hot-toast";
import {WebLoading} from "shared/components/base";
import MapCctv from "./component/MapCctv";
import SidebarCctvList from "./component/SidebarCctvList";
import {getFormattedDateTime} from "src/constants/map-config";
import {http_cctv_latest} from "src/services/cctvAPI";
import {timestampToText} from "src/utils/utils";
function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [lastCheck, setLastCheck] = useState("");

  const get_data = async (showLoading=false) => {
    if(showLoading) {
      setLoading(true);
    }

    await http_cctv_latest().then(response => {
      if (data?.timestamp !== response?.timestamp) {
        setData(response);
      }
    })
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
      <AppNavbar title={
        <div className="ml-[200px] p-2">
          <div className={"text-lg md:text-xl truncate text-center text-primary"}>Server Data : {timestampToText(data?.timestamp ?? "")}</div>
          <div className={"text-xs text-neutral"}>Last Check : {lastCheck}</div>
        </div>
      }/>
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

export default Home;
