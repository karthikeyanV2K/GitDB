"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidId = exports.generateShortId = exports.generateId = void 0;
const uuid_1 = require("uuid");
const generateId = () => {
    return (0, uuid_1.v4)();
};
exports.generateId = generateId;
const generateShortId = () => {
    return (0, uuid_1.v4)().replace(/-/g, '').substring(0, 8);
};
exports.generateShortId = generateShortId;
const isValidId = (id) => {
    // Basic validation for UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};
exports.isValidId = isValidId;
//# sourceMappingURL=id.js.map