import PocketBase from "pocketbase";
import { API_URL } from "./constants";

const pb = new PocketBase(API_URL);

pb.beforeSend = function (url, options) {
  options.headers = Object.assign({}, options.headers, {
    "ngrok-skip-browser-warning": "true",
  });
  return { url, options };
};

export default pb;
