import React, {useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {FaRegMap} from "react-icons/fa";
import {BsCameraReels} from "react-icons/bs";
import logo from "../../assets/logo.png"

const AppNavbar = ({timestamp, lastCheck}) => {
  const navigate = useNavigate()
  const headerRef = useRef();

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
      <div className={"w-full"}>
        <div className={"flex flex-row items-center gap-x-2 cursor-pointer"} onClick={() => navigate("/")}>
          <img src={logo} alt={""} className={"w-[32px]"}/>
          <span className={"font-bold text-lg"}>CCTV-Tracker</span>
        </div>
        <div className="ml-[10px] p-2">
          <div className={"text-lg md:text-xl truncate text-center text-primary"}>Server Data : {timestampToText()}</div>
          <div className={"text-xs text-neutral"}>Last Check : {lastCheck}</div>
        </div>
      </div>

      <div className={"flex gap-x-4"}>
        <button className="btn btn-ghost btn-circle" onClick={() => {
          navigate("/cctv");
        }}>
          <BsCameraReels className={"text-2xl"}/>
        </button>
        <button className="btn btn-ghost btn-circle" onClick={() => {
          navigate("/");
        }}>
          <FaRegMap className={"text-2xl"}/>
        </button>
      </div>
    </div>
  );
};

export default AppNavbar;
