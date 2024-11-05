import React, {useEffect, useState} from 'react';
import {AppFooter, AppNavbar, AppSidebar, BodyContents} from "src/components/body";
import {WebLoading} from "src/components/views";
import CctvMap from "src/components/map/CctvMap";
import {httpGet} from "src/service/http-api";
import {SERVER_URL} from "src/constant/app-variables";

function UiHome() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const get_data = async (body) => {
    await httpGet(SERVER_URL + "/cctv-latest", body).then(response => {
      if (response.isError) {
        console.log(response);
      } else {
        setData(response);
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    get_data({}).then(r => {
    });
    setLoading(false);
  }, []);

  return (
    <div className={"h-screen flex flex-col"}>
      <AppNavbar/>
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
