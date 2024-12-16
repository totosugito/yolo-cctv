import { combineReducers } from "@reduxjs/toolkit"

import {authSlice, sidebarSlice} from "shared/store"

const rootReducer = combineReducers({
  auth: authSlice,
  sidebar: sidebarSlice,
})

export default rootReducer
