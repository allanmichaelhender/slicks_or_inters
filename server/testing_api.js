import axios from "axios";

const options = {
  method: "GET",
  url: "https://api.tomorrow.io/v4/weather/forecast?location=-37.1,144.1&timestamps=daily&units=metric&apikey=iGWNWGAus1qI5KH1CGYJKQBToslmTYom",
  headers: {
    accept: "application/json",
    "accept-encoding": "deflate, gzip, br",
  },
};

axios
  .request(options)
  .then((res) => console.log(res.data.timelines.daily))
  .catch((err) => console.error(err));
