"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterpriseController = enterpriseController;
const service_1 = require("./service");
function enterpriseController(_req, res) {
    res.json((0, service_1.getEnterprisePlan)());
}
