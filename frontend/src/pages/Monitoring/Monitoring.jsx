import React, {useEffect, useState} from 'react';
import {FaBus, FaCarSide, FaMotorcycle, FaTruck} from "react-icons/fa";
import toast from "react-hot-toast";
import {IntervalCheckApi} from "src/constants/config";
import {getCctvImage, getFormattedDateTime} from "src/constants/map-config";
import DialogCctvDetails from "src/pages/Home/component/DialogCctvDetails";
import {AppFooter, AppNavbar, BodyContents} from "src/components/app";
import {WebLoading} from "shared/components/base";
import {ModalDialog} from "shared/components/dialog";
import {http_cctv_latest} from "src/services/cctvAPI";
import {timestampToText} from "src/utils/utils";

function Monitoring() {
  const [confirmationModal, setConfirmationModal] = useState(null);
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
        <div className={"grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"}>
          {
            data && data?.data.map((cctv, index) => {
              return (
                <div className={"card shadow-md"} key={index}>
                  <img src={getCctvImage(cctv, data?.timestamp ?? "")} alt={cctv?.cctv_name}
                       className={"min-h-[300px] object-cover rounded-t-2xl"}
                       onClick={() =>
                         setConfirmationModal({
                           title: cctv?.no + ". " + cctv?.cctv_name,
                           content: <DialogCctvDetails cctv={cctv} timestamp={data?.timestamp ?? ""}/>,
                           confirmText: "Close",
                           styles: "w-10/12 max-w-[800px]",
                           onConfirmClick: () => setConfirmationModal(null),
                           onCancelClick: () => setConfirmationModal(null),
                         })
                       }
                  />
                  <div>
                    <div className={"text-center font-bold truncate text-lg"}>{cctv?.no}. {cctv?.cctv_name}</div>

                    <div className={"flex flex-row gap-x-6 items-center justify-center my-2"}>
                      <div className="flex flex-col items-center justify-center my-2">
                        <FaMotorcycle className={"shared-dialog-item-icon"}/>
                        <div className={"shared-dialog-item-label"}>{cctv?.motorcycle ?? 0}</div>
                        {/*<div className={"text-center"}>Motor</div>*/}
                      </div>
                      <div className="flex flex-col items-center justify-center my-2">
                        <FaCarSide className={"shared-dialog-item-icon"}/>
                        <div className={"shared-dialog-item-label"}>{cctv?.car ?? 0}</div>
                        {/*<div className={"text-center"}>Mobil</div>*/}
                      </div>
                      <div className="flex flex-col items-center justify-center my-2">
                        <FaBus className={"shared-dialog-item-icon"}/>
                        <div className={"shared-dialog-item-label"}>{cctv?.bus ?? 0}</div>
                        {/*<div className={"text-center"}>Bis</div>*/}
                      </div>
                      <div className="flex flex-col items-center justify-center my-2">
                        <FaTruck className={"shared-dialog-item-icon"}/>
                        <div className={"shared-dialog-item-label"}>{cctv?.truck ?? 0}</div>
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
      {confirmationModal && <ModalDialog modal={confirmationModal} />}
    </div>
  );
}

export default Monitoring;
