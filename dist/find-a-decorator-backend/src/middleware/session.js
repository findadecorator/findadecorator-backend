"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieParser = cookieParser;
function parseCookies(cookieHeader) {
    if (!cookieHeader) {
        return {};
    }
    return cookieHeader.split(";").reduce((acc, pair) => {
        const idx = pair.indexOf("=");
        if (idx === -1) {
            return acc;
        }
        const key = pair.slice(0, idx).trim();
        const value = decodeURIComponent(pair.slice(idx + 1).trim());
        acc[key] = value;
        return acc;
    }, {});
}
function cookieParser(req, _res, next) {
    req.cookies = parseCookies(req.headers.cookie);
    next();
}
