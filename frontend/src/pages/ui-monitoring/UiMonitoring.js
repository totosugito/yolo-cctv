import React, {useEffect, useState} from 'react';
import {AppFooter, AppNavbar, BodyContents} from "src/components/body";
import {WebLoading} from "src/components/views";
import {httpGet} from "src/service/http-api";
import {IntervalCheckApi, SERVER_URL} from "src/constant/app-variables";
import {getCctvImage, getFormattedDateTime} from "src/constant/map-data";
import {FaBus, FaCarSide, FaMotorcycle, FaTruck} from "react-icons/fa";
import DialogCctvDetails from "src/components/map/DialogCctvDetails";
import toast from "react-hot-toast";

function UiMonitoring() {
  const [confirmationModal, setConfirmationModal] = useState(null);
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
        <div className={"grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"}>
          {
            data && data?.data.map((cctv, index) => {
              return (
                <div className={"card shadow-md"} key={index}>
                  <img src={getCctvImage(cctv, data?.timestamp ?? "")} alt={cctv?.cctv?.cctv_name}
                       className={"min-h-[300px] object-cover rounded-t-2xl"}
                       onClick={() =>
                         setConfirmationModal({
                           btn1Text: "Close",
                           cctv: cctv,
                           timestamp: data?.timestamp ?? "",
                           btn1Handler: () => setConfirmationModal(null),
                         })
                       }
                  />
                  <div>
                    <div className={"text-center font-bold truncate text-lg"}>{cctv?.cctv?.no}. {cctv?.cctv?.cctv_name}</div>

                    <div className={"flex flex-row gap-x-6 items-center justify-center my-2"}>
                      <div className="flex flex-col items-center justify-center my-2">
                        <FaMotorcycle className={"dialog-item-icon"}/>
                        <div className={"dialog-item-label"}>{cctv?.data?.count?.motorcycle ?? 0}</div>
                        {/*<div className={"text-center"}>Motor</div>*/}
                      </div>
                      <div className="flex flex-col items-center justify-center my-2">
                        <FaCarSide className={"dialog-item-icon"}/>
                        <div className={"dialog-item-label"}>{cctv?.data?.count?.car ?? 0}</div>
                        {/*<div className={"text-center"}>Mobil</div>*/}
                      </div>
                      <div className="flex flex-col items-center justify-center my-2">
                        <FaBus className={"dialog-item-icon"}/>
                        <div className={"dialog-item-label"}>{cctv?.data?.count?.bus ?? 0}</div>
                        {/*<div className={"text-center"}>Bis</div>*/}
                      </div>
                      <div className="flex flex-col items-center justify-center my-2">
                        <FaTruck className={"dialog-item-icon"}/>
                        <div className={"dialog-item-label"}>{cctv?.data?.count?.truck ?? 0}</div>
                        {/*<div className={"text-center"}>Truck</div>*/}
                      </div>
                    </div>
                  </div>

                </div>
              )
            })
          }
        </div>
      </BodyContents>}
      <AppFooter/>
      {confirmationModal && <DialogCctvDetails modalData={confirmationModal}/>}
    </div>
  );
}

export default UiMonitoring;
