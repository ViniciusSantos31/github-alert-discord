"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEvent = formatEvent;
const core = __importStar(require("@actions/core"));
const formatters = {
    push: pushFormatter,
    pull_request: pullRequestFormatter,
    release: releaseFormatter,
};
function formatEvent(event, payload) {
    core.debug(JSON.stringify(payload, null, 2));
    let msg = "No further information";
    if (event in formatters) {
        try {
            return formatters[event](payload) || msg;
        }
        catch (e) {
            core.debug(`Failed to generate eventDetail for ${event}: ${e}\n${e.stack}`);
        }
    }
    return msg;
}
function pushFormatter(payload) {
    return `[\`${payload.head_commit.id.substring(0, 7)}\`](${payload.head_commit.url}) ${payload.head_commit.message}`;
}
function pullRequestFormatter(payload) {
    return `[\`#${payload.pull_request.number}\`](${payload.pull_request.html_url}) ${payload.pull_request.title}`;
}
function releaseFormatter(payload) {
    const { name, body } = payload.release;
    const nameText = name ? `**${name}**` : '';
    return `${nameText}${(nameText && body) ? "\n" : ""}${body || ""}`;
}
