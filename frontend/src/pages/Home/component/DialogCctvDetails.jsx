import {FaMotorcycle, FaCarSide, FaTruck, FaBus} from "react-icons/fa";
import {getCctvImage} from "src/constants/map-config";

export default function DialogCctvDetails({cctv, timestamp}) {
  return (
    <div className="w-full">
        <div className={"flex flex-row gap-x-6 items-center justify-center my-2"}>
          <div className="flex flex-col items-center justify-center my-2">
            <FaMotorcycle className={"shared-dialog-item-icon"}/>
            <div className={"shared-dialog-item-label"}>{cctv.motorcycle ?? 0}</div>
          </div>
          <div className="flex flex-col items-center justify-center my-2">
            <FaCarSide className={"shared-dialog-item-icon"}/>
            <div className={"shared-dialog-item-label"}>{cctv?.car ?? 0}</div>
          </div>
          <div className="flex flex-col items-center justify-center my-2">
            <FaBus className={"shared-dialog-item-icon"}/>
            <div className={"shared-dialog-item-label"}>{cctv?.bus ?? 0}</div>
          </div>
          <div className="flex flex-col items-center justify-center my-2">
            <FaTruck className={"shared-dialog-item-icon"}/>
            <div className={"shared-dialog-item-label"}>{cctv?.truck ?? 0}</div>
          </div>
        </div>
        <div>
          <img src={getCctvImage(cctv, timestamp)} alt={"cctv-image"} className={"w-full"}/>
        </div>
      </div>
  )
}
