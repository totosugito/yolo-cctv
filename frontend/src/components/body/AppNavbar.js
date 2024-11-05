import React, {useRef, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {FaRegMap} from "react-icons/fa";
import {BsCameraReels} from "react-icons/bs";
import logo from "../../assets/logo.png"

const AppNavbar = () => {
  const navigate = useNavigate()
  const headerRef = useRef();
  const [title, setTitle] = useState("");

  return (
    <div className="navbar flex flex-row w-full items-center justify-between shadow px-2" ref={headerRef}>
      <div className={"w-full"}>
        <div className={"flex flex-row items-center gap-x-2 cursor-pointer"} onClick={() => navigate("/")}>
          <img src={logo} alt={""} className={"w-[32px]"}/>
          <span className={"font-bold text-lg"}>CCTV-Tracker</span>
        </div>
        <div className="text-xl md:text-2xl truncate">
          {title}
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
