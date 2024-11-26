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
exports.statusOptions = void 0;
exports.getInputs = getInputs;
const core = __importStar(require("@actions/core"));
exports.statusOptions = {
    success: { status: 'Success', color: 0x2ecc71 },
    failure: { status: 'Failure', color: 0xe74c3c },
    cancelled: { status: 'Cancelled', color: 0xf39c12 },
    neutral: { status: 'Neutral', color: 0x95a5a6 },
};
function getInputs() {
    const webhook = core.getInput('webhook');
    const webhooks = webhook.split('\n');
    webhooks.forEach((webhook, i) => {
        core.setSecret(webhook);
        if (webhook.endsWith('/github')) {
            core.warning(`Webhook URL ${i + 1} termina com '/github'. Isso pode causar erros!`);
        }
    });
    const inputs = {
        webhooks,
        status: core.getInput('status'),
        content: core.getInput('content'),
        description: core.getInput('description'),
        title: core.getInput('title'),
        color: exports.statusOptions[core.getInput('status')].color,
        url: core.getInput('url'),
        username: core.getInput('username'),
        avatar_url: core.getInput('avatar_url'),
    };
    if (!inputs.webhooks.length) {
        core.warning('No webhooks provided');
    }
    return inputs;
}
