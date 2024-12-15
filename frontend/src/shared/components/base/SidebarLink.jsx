import * as Icons from "react-icons/vsc"
import {useDispatch} from "react-redux"
import {NavLink, matchPath, useLocation} from "react-router-dom"
import {useState} from "react";

export default function SidebarLink({link, iconName}) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const [openSideMenu, setOpenSideMenu] = useState(true);//useSelector(state => state.sidebar)
  const {screenSize, setScreenSize} = useState(true);

  const matchRoute = (route) => {
    return matchPath({path: route}, location.pathname)
  }

  const handleClick = () => {
    if (openSideMenu && screenSize <= 640) dispatch(setOpenSideMenu(false))
  }

  return (
    <NavLink
      to={link.path}
      onClick={handleClick}
      className={`relative px-8 py-2 text-sm font-medium ${matchRoute(link.path)
        ? "bg-app-base"
        : "hover:bg-app-base opacity-50 duration-200"
      } transition-all `}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.35rem] bg-app-primary ${matchRoute(link.path) ? "opacity-100" : "opacity-0"
        }`}
      >
      </span>

      <div className="flex items-center gap-x-2">
        <Icon className="text-lg"/>
        <span className={"my-menu"}>{link.name}</span>
      </div>

    </NavLink>
  )
}