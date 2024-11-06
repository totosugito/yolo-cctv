import {FaMotorcycle, FaCarSide, FaTruck, FaBus} from "react-icons/fa";
import {getMarkerColor} from "src/constant/map-data";
import {useState} from "react";
import DialogCctvDetails from "src/components/map/DialogCctvDetails";

const AppSidebar = ({timestamp, data}) => {
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
                   style={{backgroundColor: getMarkerColor(item?.data?.total ?? 0)}}
                   onClick={() =>
                     setConfirmationModal({
                       btn1Text: "Close",
                       cctv: item,
                       timestamp: timestamp,
                       btn1Handler: () => setConfirmationModal(null),
                     })
                   }
              >
                {item?.data?.total ?? 0}
              </div>
              <div className={"flex flex-col gap-1"}>
                <div className={"truncate"}>
                  {item?.cctv?.no}. {item?.cctv?.cctv_name}
                </div>
                <div className={"flex flex-row gap-x-4"}>
                  <div className={"flex flex-row gap-x-1"}>
                    <FaMotorcycle className={"text-xl"}/>
                    <div>{item?.data?.count?.motorcycle ?? 0}</div>
                  </div>
                  <div className={"flex flex-row gap-x-1"}>
                    <FaCarSide className={"text-xl"}/>
                    <div>{item?.data?.count?.car ?? 0}</div>
                  </div>
                  <div className={"flex flex-row gap-x-1"}>
                    <FaBus className={"text-xl"}/>
                    <div>{item?.data?.count?.bus ?? 0}</div>
                  </div>
                  <div className={"flex flex-row gap-x-1"}>
                    <FaTruck className={"text-xl"}/>
                    <div>{item?.data?.count?.truck ?? 0}</div>
                  </div>
                </div>
              </div>
            </div>
            <hr/>
          </div>
        );
      })}

      {confirmationModal && <DialogCctvDetails modalData={confirmationModal}/>}
    </div>
  )
}
export default AppSidebar
