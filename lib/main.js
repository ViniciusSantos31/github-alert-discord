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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayload = getPayload;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const format_1 = require("./format");
const inputs_1 = require("./inputs");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.info('Getting inputs...');
            const inputs = (0, inputs_1.getInputs)();
            core.info('Gerando payload...');
            const payload = getPayload(inputs);
        }
        catch (error) {
            core.error(error);
        }
    });
}
function getPayload(inputs) {
    const ctx = github.context;
    const { owner, repo } = ctx.repo;
    const { eventName, ref, workflow, actor, payload, serverUrl, runId } = ctx;
    const repoUrl = `${serverUrl}/${owner}/${repo}`;
    const workflowUrl = `${repoUrl}/actions/runs/${runId}`;
    core.debug(JSON.stringify(payload));
    const eventFieldTitle = `Evento - ${eventName}`;
    const eventDetail = (0, format_1.formatEvent)(eventName, payload);
    let embed = {
        color: inputs_1.statusOptions[inputs.status].color,
        timestamp: new Date().toISOString(),
        title: inputs.title,
        url: inputs.url,
        fields: [
            {
                name: 'Repositório',
                value: `[${repo}](${repoUrl})`,
                inline: true
            },
            {
                name: 'Branch',
                value: ref,
                inline: true
            },
            {
                name: 'Workflow',
                value: `[${workflow}](${workflowUrl})`,
                inline: true
            },
            {
                name: 'Status',
                value: inputs_1.statusOptions[inputs.status].status,
                inline: true
            },
            {
                name: 'Autor',
                value: actor,
                inline: true
            },
            {
                name: eventFieldTitle,
                value: eventDetail,
                inline: false
            }
        ]
    };
    let discord_payload = {
        content: inputs.content,
        username: inputs.username,
        avatar_url: inputs.avatar_url,
        embeds: [embed],
    };
    return discord_payload;
}
run();
