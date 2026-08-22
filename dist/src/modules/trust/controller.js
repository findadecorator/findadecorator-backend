"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const moduleFactory_1 = require("../../shared/moduleFactory");
const service_1 = require("./service");
const schema_1 = require("./schema");
exports.controller = (0, moduleFactory_1.buildModuleController)(service_1.service, schema_1.createSchema, schema_1.updateSchema);
