import { io, Socket } from "socket.io-client";

const REVERB_APP_KEY = process.env.REVERB_APP_KEY || "";
const REVERB_APP_HOST = process.env.REVERB_APP_HOST || "";
const REVERB_APP_PORT = process.env.REVERB_APP_PORT || "";
const REVERB_APP_CLUSTER = process.env.REVERB_APP_CLUSTER || "";
const API_TOKEN = process.env.API_TOKEN || "";

const socket: Socket = io(`http://${REVERB_APP_HOST}:${REVERB_APP_PORT}`, {
  auth: {
    token: API_TOKEN,
  },
  query: {
    key: REVERB_APP_KEY,
    cluster: REVERB_APP_CLUSTER,
  },
  extraHeaders: {
    Authorization: `Bearer ${API_TOKEN}`,
    Accept: "application/json",
  },
});

export default socket;
