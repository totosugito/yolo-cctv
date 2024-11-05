import { combineReducers } from "@reduxjs/toolkit"
import sidebarSlice from "src/store/slices/sidebarSlice";

const rootReducer = combineReducers({
  sidebar: sidebarSlice,
})
export default rootReducer
