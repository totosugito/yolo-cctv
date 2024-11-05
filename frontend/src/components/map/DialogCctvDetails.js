import {getCctvImage} from "src/constant/map-data";
import {FaMotorcycle, FaCarSide, FaTruck, FaBus} from "react-icons/fa";

export default function DialogCctvDetails({modalData}) {
  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto backdrop-blur-sm">
      <div className="w-10/12 max-w-[800px] rounded-lg border border-app-border p-3 bg-base-100">
        <div className="dialog-title">
          {modalData?.cctv?.cctv?.no}. {modalData?.cctv?.cctv?.cctv_name}
        </div>

        <div className={"flex flex-row gap-x-6 items-center justify-center my-2"}>
          <div className="flex flex-col items-center justify-center my-2">
            <FaMotorcycle className={"dialog-item-icon"}/>
            <div className={"dialog-item-label"}>{modalData?.cctv?.data?.count?.motorcycle ?? 0}</div>
            {/*<div className={"text-center"}>Motor</div>*/}
          </div>
          <div className="flex flex-col items-center justify-center my-2">
            <FaCarSide className={"dialog-item-icon"}/>
            <div className={"dialog-item-label"}>{modalData?.cctv?.data?.count?.car ?? 0}</div>
            {/*<div className={"text-center"}>Mobil</div>*/}
          </div>
          <div className="flex flex-col items-center justify-center my-2">
            <FaBus className={"dialog-item-icon"}/>
            <div className={"dialog-item-label"}>{modalData?.cctv?.data?.count?.bus ?? 0}</div>
            {/*<div className={"text-center"}>Bis</div>*/}
          </div>
          <div className="flex flex-col items-center justify-center my-2">
            <FaTruck className={"dialog-item-icon"}/>
            <div className={"dialog-item-label"}>{modalData?.cctv?.data?.count?.truck ?? 0}</div>
            {/*<div className={"text-center"}>Truck</div>*/}
          </div>
        </div>
        <div>
          <img src={getCctvImage(modalData?.cctv, modalData?.timestamp)} alt={"cctv-image"} className={"w-full"}/>
        </div>

        <div className="flex items-center justify-center my-2">
          <button className="btn btn-sm btn-error" onClick={modalData?.btn1Handler}>{modalData?.btn1Text}</button>
        </div>

      </div>
    </div>
  )
}
