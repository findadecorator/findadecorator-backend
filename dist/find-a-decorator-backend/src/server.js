"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const realtime_1 = require("./lib/realtime");
dotenv_1.default.config();
const port = Number(process.env.PORT ?? 5000);
const server = http_1.default.createServer(app_1.default);
(0, realtime_1.initRealtime)(server);
server.listen(port, "0.0.0.0", () => {
    console.log(`FIND-A-DECORATOR backend listening on port ${port}`);
});
