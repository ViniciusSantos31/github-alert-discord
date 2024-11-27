import * as core from '@actions/core';
import * as github from '@actions/github';

import axios from 'axios';
import { actionOption, getInputs, Inputs } from "./inputs";

async function run() {
  try {
    core.info('Getting inputs...');
    const inputs = getInputs();

    core.info('Gerando payload...');
    const payload = getPayload(inputs);
    const payloadStr = JSON.stringify(payload, null, 2);

    core.debug(JSON.stringify(payload));

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

  const { eventName, payload, serverUrl } = ctx;

  const repoUrl = `${serverUrl}/${owner}/${repo}`;
  // const workflowUrl = `${repoUrl}/actions/runs/${runId}`;

  // const eventFieldTitle = `Evento - ${eventName}`;
  // const eventDetail = formatEvent(eventName, payload);

  const request_reviewers: Array<{ login: string, avatar_url: string }> = payload.pull_request
    ?.requested_reviewers;

  let embed: { [key: string]: any } = {
    color: 5814783,
    timestamp: new Date().toISOString(),
    title: actionOption[eventName]?.title || eventName,
    url: payload.pull_request?.html_url,
    fields: [
      {
        name: "Repository",
        value: `[${repo}](${repoUrl})`,
      },
      {
        name: "PR Description",
        value: payload.pull_request?.body || "No description",
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
        value:
          `[${payload.pull_request?.title ?? "Pull request link"}](${payload.pull_request?.html_url})`,
        inline: true
      }
    ]
  };

  let discord_payload: any = {
    content: "Content",
    username: inputs.username,
    avatar_url: inputs.avatar_url,
    embeds: [embed],
  }
  
  return discord_payload;
}

run();