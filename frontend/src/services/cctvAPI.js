import {httpGet} from "shared/service/http-api";
import {SERVER_URL} from "src/constants/config";
import toast from "react-hot-toast";

export const http_cctv_latest = async () => {
  let result = null;
  try {
    await httpGet(SERVER_URL + "/cctv-latest", {}).then(response => {
      if (response.isError) {
        console.log(response);
      } else {
        result = response;
      }
    })
  } catch (error) {
    toast.error(error.message)
  }
  return result;
}

export const http_cctv_history = async (no) => {
  let result = null;
  try {
    await httpGet(`${SERVER_URL}/cctv-history/${no}`, {}).then(response => {
      if (response.isError) {
        console.log(response);
      } else {
        result = response;
      }
    })
  } catch (error) {
    toast.error(error.message)
  }
  return result;
}
