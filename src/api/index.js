"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
const app_module_1 = require("../../app.module");
const server = express();
const bootstrap = async () => {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    await app.init();
};
let isBootstrapped = false;
async function handler(req, res) {
    if (!isBootstrapped) {
        await bootstrap();
        isBootstrapped = true;
    }
    return server(req, res);
}
//# sourceMappingURL=index.js.map