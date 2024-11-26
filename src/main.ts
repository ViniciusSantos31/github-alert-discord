import * as core from '@actions/core';
import * as github from '@actions/github';

import { formatEvent } from './format';
import { getInputs, Inputs, statusOptions } from "./inputs";

async function run() {
  try {
    core.info('Getting inputs...');
    const inputs = getInputs();

    core.info('Gerando payload...');
    const payload = getPayload(inputs);
  } catch (error) {
    core.error(error);
  }
}

export function getPayload(inputs: Readonly<Inputs>): Object { 
  
  const ctx = github.context;
  const { owner, repo } = ctx.repo;

  const { eventName, ref, workflow, actor, payload, serverUrl, runId } = ctx;

  const repoUrl = `${serverUrl}/${owner}/${repo}`;
  const workflowUrl = `${repoUrl}/actions/runs/${runId}`;

  core.debug(JSON.stringify(payload));

  const eventFieldTitle = `Evento - ${eventName}`;
  const eventDetail = formatEvent(eventName, payload);

  let embed: { [key: string]: any } = {
    color: statusOptions[inputs.status].color,
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
        value: statusOptions[inputs.status].status, 
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

  let discord_payload: any = {
    content: inputs.content,
    username: inputs.username,
    avatar_url: inputs.avatar_url,
    embeds: [embed],
  }
  
  return discord_payload;
}

run();