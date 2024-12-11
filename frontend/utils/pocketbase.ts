import PocketBase, { AsyncAuthStore } from "pocketbase";
import { API_URL } from "./constants";
import * as AsyncStorage from "expo-secure-store";

const store = new AsyncAuthStore({
  save: async (serializedAuthData) =>
    AsyncStorage.setItemAsync("pb_auth", serializedAuthData),
  initial: AsyncStorage.getItemAsync("pb_auth"),
});

const pb = new PocketBase(API_URL, store);

pb.beforeSend = function (url, options) {
  options.headers = Object.assign({}, options.headers, {
    "ngrok-skip-browser-warning": "true",
  });
  return { url, options };
};

export default pb;
