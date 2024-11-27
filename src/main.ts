import * as core from '@actions/core';
import * as github from '@actions/github';

import axios from 'axios';
import { getInputs, Inputs } from "./inputs";
import { getPullRequestFormat } from './pull_request_format';

async function run() {
  try {
    core.info('Getting inputs...');
    const inputs = getInputs();

    core.info('Gerando payload...');
    const payload = getPayload(inputs);
    const payloadStr = JSON.stringify(payload, null, 2);

    core.info(payloadStr);

    await Promise.all(inputs.webhooks.map(webhook =>
      wrapWebhook(webhook.trim(), payload)
    ));

    core.setOutput('payload', payloadStr);
  } catch (error) {
    core.error(error as Error);
  }
}

function wrapWebhook(webhook: string, payload: Object): Promise<void> {
  return async function () {
    try {
      await axios.post(webhook, payload);
    } catch (e: any) {
      if (e.response) {
        core.error(`Webhook response: 
          ${e.response.status}: ${JSON.stringify(e.response.data)}`
        );
      } else {
        core.error(e);
      }
    }
  }()
}

export function getPayload(inputs: Readonly<Inputs>): Object { 
  
  const ctx = github.context;
  const { owner, repo } = ctx.repo;

  const { eventName, payload, serverUrl, action } = ctx;

  const repoUrl = `${serverUrl}/${owner}/${repo}`;

  const request_reviewers: Array<{ login: string, avatar_url: string }> = payload.pull_request
    ?.requested_reviewers;
  
  let embed: { [key: string]: any } = {};

  if (eventName === 'pull_request') { 
    return getPullRequestFormat(ctx);
  }

  let discord_payload: any = {
    username: inputs.username,
    avatar_url: inputs.avatar_url,
    embeds: [embed],
  }
  
  return discord_payload;
}

run();