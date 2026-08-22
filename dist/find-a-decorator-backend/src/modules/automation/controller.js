"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.automationController = automationController;
const service_1 = require("./service");
function automationController(_req, res) {
    res.json((0, service_1.getAutomationFlows)());
}
