import {movingAverage} from "shared/utils/smoothing";

export const timestampToText = (timestamp) => {
  if(timestamp === "") {
    return ("-");
  }
  const [datePart, timePart] = timestamp.split('_');
  const [year, month, day] = datePart.split('-');
  const [hour, minute, second] = timePart.split('-');

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}

export const createCctvHistorySummary = (data) => {

  let total_ = []
  let history = data?.data ?? [];
  for (let i = 0; i < history.length; i++) {
    total_.push(history[i].total);
  }

  const sma_1 = movingAverage(total_, 3);
  const sma_2 = movingAverage(total_, 6);

  // fill the data
  for (let i = 0; i < history.length; i++) {
    let row = history[i];
    row["sma1"] = sma_1[i];  // actual oil SMA7
    row["sma2"] = sma_2[i];  // actual oil SMA30
  }

  data.data = history;
  return data;
}
