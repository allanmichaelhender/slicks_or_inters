import axios from "axios";
import pool from "./src/config/db.js";

const getLatituideLongitude = async (race_name) => {
  const text =
    "SELECT latitude, longitude FROM races_data WHERE race_name = $1";
  const values = [race_name];

  const { rows } = await pool.query(text, values);
  return rows[0];
};

const { latitude, longitude } = await getLatituideLongitude(
  "Australian Grand Prix"
);

const options = {
  method: "GET",
  url: `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&timestamps=daily&units=metric&apikey=iGWNWGAus1qI5KH1CGYJKQBToslmTYom`,
  headers: {
    accept: "application/json",
    "accept-encoding": "deflate, gzip, br",
  },
};

axios
  .request(options)
  .then((res) => console.log(res.data.timelines.daily))
  .catch((err) => console.error(err));
