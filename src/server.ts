import dotenv from "dotenv";
import app from "./app";
import http from "http";
import { initRealtime } from "./lib/realtime";

dotenv.config();

const port = Number(process.env.PORT ?? 5000);
const server = http.createServer(app);
initRealtime(server);

server.listen(port, "0.0.0.0", () => {
  console.log(`FIND-A-DECORATOR backend listening on port ${port}`);
});
