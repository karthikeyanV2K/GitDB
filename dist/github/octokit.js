"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOctokit = getOctokit;
const rest_1 = require("@octokit/rest");
function getOctokit(token) {
    return new rest_1.Octokit({ auth: token });
}
//# sourceMappingURL=octokit.js.map