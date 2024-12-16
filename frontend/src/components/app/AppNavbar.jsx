import React, {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaRegMap} from "react-icons/fa";
import {BsCameraReels} from "react-icons/bs";
import logo from "../../assets/logo.png"
import {IoPersonOutline} from "react-icons/io5";
import {ModalDialog} from "shared/components/dialog";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {setUserLogin} from "shared/store/authSlice";
import {AppRoutes} from "src/routers/router";
import { PiTelegramLogoFill } from "react-icons/pi";
import {BOT_URL} from "src/constants/config";

const AppNavbar = ({title}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const {openSideMenu} = useSelector((state) => state.sidebar);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate = useNavigate()
  const headerRef = useRef();

  const logout = () => {
    dispatch(setUserLogin({token: "", email: ""}));
    navigate(AppRoutes.login.to);
  }

  const openBotUrl = () => {
    window.open(BOT_URL, "_blank");
  }

  return (
    <div className="navbar flex flex-row w-full items-center justify-between shadow px-2" ref={headerRef}>
      <div className={"flex w-full gap-x-[20px]"}>
        <div className={"flex flex-row items-center gap-x-2 cursor-pointer"} onClick={() => navigate("/")}>
          <img src={logo} alt={""} className={"w-[32px]"}/>
          <div className={"flex flex-col"}>
            <span className={"font-bold text-lg"}>CCTV-Tracker</span>
            <span className={"text-xs font bold text-blue-800"}>by WAVIV</span>
          </div>
        </div>
        {title}
      </div>

      <div className={"flex gap-x-4"}>
        <div className="btn btn-ghost  w-[80px]" onClick={() => {
          navigate(AppRoutes.dashboard.to);
        }}>
          <div className={"flex flex-col items-center gap-y-1"}>
            <div><FaRegMap className={"text-xl"}/></div>
            <div className={"text-xs font-normal"}>Map</div>
          </div>
        </div>

        <div className="btn btn-ghost  w-[80px]" onClick={() => {
          navigate(AppRoutes.monitoring.to);
        }}>
          <div className={"flex flex-col items-center gap-y-1"}>
            <div><BsCameraReels className={"text-xl"}/></div>
            <div className={"text-xs font-normal"}>Monitoring</div>
          </div>
        </div>

        <div className="btn btn-ghost  w-[80px]" onClick={() => {
          openBotUrl();
        }}>
          <div className={"flex flex-col items-center gap-y-1"}>
            <div><PiTelegramLogoFill className={"text-xl"}/></div>
            <div className={"text-xs font-normal"}>Notification</div>
          </div>
        </div>

        <button className="btn btn-ghost btn-circle" onClick={() => {
          setConfirmationModal({
            title: t("dialog.logOutTitle"),
            content: <div>{t("dialog.logOutDesc")}</div>,
            confirmText: "Logout",
            cancelText: "Cancel",
            onConfirmClick: () => logout(),
            onCancelClick: () => setConfirmationModal(null),
          })
        }}>
          <IoPersonOutline className={"text-2xl"}/>
        </button>
      </div>
      {confirmationModal && <ModalDialog modal={confirmationModal}/>}
    </div>
  );
};

export default AppNavbar;
