"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = require("express");
const body_parser_1 = require("body-parser");
const index_js_1 = require("./api/index.js");
async function startServer(port = 7896, host = '0.0.0.0') {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    (0, index_js_1.registerApiRoutes)(app);
    return new Promise((resolve) => {
        app.listen(port, host, () => {
            console.log(`🚀 GitDB Server running on ${host}:${port}`);
            console.log(`📡 API available at http://${host}:${port}/api/v1`);
            console.log('Press Ctrl+C to stop the server');
            resolve();
        });
    });
}
//# sourceMappingURL=server.js.map