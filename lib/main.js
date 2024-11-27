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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayload = getPayload;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const axios_1 = __importDefault(require("axios"));
const inputs_1 = require("./inputs");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.info('Getting inputs...');
            const inputs = (0, inputs_1.getInputs)();
            core.info('Gerando payload...');
            const payload = getPayload(inputs);
            const payloadStr = JSON.stringify(payload, null, 2);
            core.debug(JSON.stringify(payload));
            yield Promise.all(inputs.webhooks.map(webhook => wrapWebhook(webhook.trim(), payload)));
            core.setOutput('payload', payloadStr);
        }
        catch (error) {
            core.error(error);
        }
    });
}
function wrapWebhook(webhook, payload) {
    return function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(webhook, payload);
            }
            catch (e) {
                if (e.response) {
                    core.error(`Webhook response: 
          ${e.response.status}: ${JSON.stringify(e.response.data)}`);
                }
                else {
                    core.error(e);
                }
            }
        });
    }();
}
function getPayload(inputs) {
    var _a, _b, _c, _d, _e, _f, _g;
    const ctx = github.context;
    const { owner, repo } = ctx.repo;
    const { eventName, payload, serverUrl } = ctx;
    const repoUrl = `${serverUrl}/${owner}/${repo}`;
    // const workflowUrl = `${repoUrl}/actions/runs/${runId}`;
    // const eventFieldTitle = `Evento - ${eventName}`;
    // const eventDetail = formatEvent(eventName, payload);
    const request_reviewers = (_a = payload.pull_request) === null || _a === void 0 ? void 0 : _a.requested_reviewers;
    let embed = {
        color: 5814783,
        timestamp: new Date().toISOString(),
        title: ((_b = inputs_1.actionOption[eventName]) === null || _b === void 0 ? void 0 : _b.title) || eventName,
        url: (_c = payload.pull_request) === null || _c === void 0 ? void 0 : _c.html_url,
        fields: [
            {
                name: "Repository",
                value: `[${repo}](${repoUrl})`,
            },
            {
                name: "PR Description",
                value: ((_d = payload.pull_request) === null || _d === void 0 ? void 0 : _d.body) || "No description",
            },
            {
                name: "Reviewers",
                value: request_reviewers
                    .map(reviewer => `[${reviewer.login}](${reviewer.avatar_url})`)
                    .join(", "),
                inline: true
            },
            {
                name: "Link to PR",
                value: `[${(_f = (_e = payload.pull_request) === null || _e === void 0 ? void 0 : _e.title) !== null && _f !== void 0 ? _f : "Pull request link"}](${(_g = payload.pull_request) === null || _g === void 0 ? void 0 : _g.html_url})`,
                inline: true
            }
        ]
    };
    let discord_payload = {
        content: "Content",
        username: inputs.username,
        avatar_url: inputs.avatar_url,
        embeds: [embed],
    };
    return discord_payload;
}
run();
