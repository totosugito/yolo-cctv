import {FaMotorcycle, FaCarSide, FaTruck, FaBus} from "react-icons/fa";
import {useState} from "react";
import DialogCctvDetails from "./DialogCctvDetails";
import {getMarkerColor} from "src/constants/map-config";
import {ModalDialog} from "shared/components/dialog";

const SidebarCctvList = ({timestamp, data}) => {
  const [confirmationModal, setConfirmationModal] = useState(null);

  return (
    <div className={"flex flex-col min-w-[270px] p-3 overflow-auto"} style={{height: `calc(100vh - 80px)`}} data-theme="dark">
      <div className={"font-bold text-lg my-2"}>List CCTV</div>
      <hr/>

      {data.map((item, index) => {
        return (
          <div key={index} className={"flex flex-col gap-2 mb-1"}>
            <div className={"flex flex-row gap-2 items-center"}>
              <div className={"avatar w-[32px] h-[32px] rounded-full justify-center items-center text-xs shadow-md cursor-pointer text-neutral font-bold"}
                   style={{backgroundColor: getMarkerColor(item?.total ?? 0)}}
                   onClick={() =>
                     setConfirmationModal({
                       title: item?.no + ". " + item?.cctv_name,
                       content: <DialogCctvDetails cctv={item} timestamp={timestamp}/>,
                       confirmText: "Close",
                       styles: "w-10/12 max-w-[800px]",
                       onConfirmClick: () => setConfirmationModal(null),
                       onCancelClick: () => setConfirmationModal(null),
                     })
                   }
              >
                {item?.total ?? 0}
              </div>
              <div className={"flex flex-col gap-1"}>
                <div className={"truncate"}>
                  {item?.no}. {item?.cctv_name}
                </div>
                <div className={"flex flex-row gap-x-4"}>
                  <div className={"flex flex-row gap-x-1"}>
                    <FaMotorcycle className={"text-xl"}/>
                    <div>{item?.motorcycle ?? 0}</div>
                  </div>
                  <div className={"flex flex-row gap-x-1"}>
                    <FaCarSide className={"text-xl"}/>
                    <div>{item?.data?.car ?? 0}</div>
                  </div>
                  <div className={"flex flex-row gap-x-1"}>
                    <FaBus className={"text-xl"}/>
                    <div>{item?.bus ?? 0}</div>
                  </div>
                  <div className={"flex flex-row gap-x-1"}>
                    <FaTruck className={"text-xl"}/>
                    <div>{item?.truck ?? 0}</div>
                  </div>
                </div>
              </div>
            </div>
            <hr/>
          </div>
        );
      })}

      {confirmationModal && <ModalDialog modal={confirmationModal} />}
    </div>
  )
}
export default SidebarCctvList
