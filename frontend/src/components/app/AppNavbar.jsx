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

const AppNavbar = ({timestamp, lastCheck}) => {
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

  const timestampToText = () => {
    if(timestamp === "") {
      return ("-");
    }
    const [datePart, timePart] = timestamp.split('_');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split('-');

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
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
        <div className="ml-[10px] p-2">
          <div className={"text-lg md:text-xl truncate text-center text-primary"}>Server Data : {timestampToText()}</div>
          <div className={"text-xs text-neutral"}>Last Check : {lastCheck}</div>
        </div>
      </div>

      <div className={"flex gap-x-4"}>
        <button className="btn btn-ghost btn-circle" onClick={() => {
          navigate(AppRoutes.dashboard.to);
        }}>
          <FaRegMap className={"text-2xl"}/>
        </button>

        <button className="btn btn-ghost btn-circle" onClick={() => {
          navigate(AppRoutes.monitoring.to);
        }}>
          <BsCameraReels className={"text-2xl"}/>
        </button>

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
