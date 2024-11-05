import React, {useEffect, useState} from 'react';
import {AppFooter, AppNavbar, BodyContents} from "src/components/body";
import {WebLoading} from "src/components/views";
import CctvMap from "src/components/map/CctvMap";
import {httpGet} from "src/service/http-api";
import {SERVER_URL} from "src/constant/app-variables";
import {getCctvImage} from "src/constant/map-data";
import {FaBus, FaCarSide, FaMotorcycle, FaTruck} from "react-icons/fa";
import DialogCctvDetails from "src/components/map/DialogCctvDetails";

function UiMonitoring() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

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
        <div className={"grid grid-cols-2 gap-6"}>
          {
            data && data?.data.map((cctv, index) => {
              return (
                <div className={"card shadow-md"} key={index}>
                  <img src={getCctvImage(cctv, data?.timestamp ?? "")} alt={cctv?.cctv?.cctv_name} className={""}
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
