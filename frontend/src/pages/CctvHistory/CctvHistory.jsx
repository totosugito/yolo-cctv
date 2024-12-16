import {AppNavbar, BodyContents} from "src/components/app";
import {WebLoading} from "shared/components/base";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {http_cctv_history} from "src/services/cctvAPI";
import {getFormattedDateTime} from "src/constants/map-config";
import toast from "react-hot-toast";
import TableHistory from "src/pages/CctvHistory/component/TableHistory";
import ChartLinesView from "src/components/app/ChartLinesView";
import {COLORS_LIST} from "shared/config/config";
import {createCctvHistorySummary} from "src/utils/utils";
import {useTranslation} from "react-i18next";

const CctvHistory = () => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [lastCheck, setLastCheck] = useState("");
  const {no} = useParams();

  const get_data = async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }

    await http_cctv_history(no).then(response => {
      const summary = createCctvHistorySummary(response);
      setData(summary);
    })

    setLastCheck(getFormattedDateTime());
    toast.success("Data Updated ...");

    if (showLoading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    get_data(true).then(r => {
    });
  }, []);
  return (
    <div className={"h-screen flex flex-col"}>
      <AppNavbar title={
        <div className="ml-[100px] p-2 truncate">
          <div className={"text-lg md:text-xl truncate text-center text-primary"}>{data?.cctv?.no}. {data?.cctv?.cctv_name}</div>
        </div>
      }/>
      {loading ? <WebLoading/> : <BodyContents>
        {data && <div className={"flex flex-col gap-3"}>
          <ChartLinesView values={data?.data ?? []}
                          height={"450px"}
                          title={"Total Kendaraan"}
                          xLabel={"Date"} yLabel={"Total"} keyX="dt"
                          color1={COLORS_LIST[0]} keyY1={"total"} label1={"Total"} cubicInterpolationMode1={""}
                          color2={COLORS_LIST[1]} keyY2={"sma1"} label2={t("label.sma3h")} cubicInterpolationMode2={""}
                          color3={COLORS_LIST[2]} keyY3={"sma2"} label3={t("label.sma6h")} cubicInterpolationMode3={""}
          />
          <TableHistory title={`${data?.cctv?.no}. ${data?.cctv?.cctv_name}`} values={data}/>
        </div>}
      </BodyContents>}
    </div>
  )
}
export default CctvHistory
