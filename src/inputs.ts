import * as core from '@actions/core';

export interface Inputs {
  webhooks: string[];
  status: string;
  content: string;
  description: string;
  title: string;
  color?: number;
  url: string;
  username: string;
  avatar_url: string;
}

interface StatusOption {
  status: string;
  color: number;
}

export const statusOptions: Record<string, StatusOption> = {
  success: { status: 'Success', color: 0x2ecc71 },
  failure: { status: 'Failure', color: 0xe74c3c },
  cancelled: { status: 'Cancelled', color: 0xf39c12 },
  neutral: { status: 'Neutral', color: 0x95a5a6 },
};

export function getInputs(): Inputs {
  const webhook: string = core.getInput('webhook');
  const webhooks: string[] = webhook.split('\n');

  webhooks.forEach((webhook, i) => { 
    core.setSecret(webhook);

    if (webhook.endsWith('/github')) {
      core.warning(`Webhook URL ${i + 1} termina com '/github'. Isso pode causar erros!`);
    }
  });

  const inputs: Inputs = {
    webhooks,
    status: core.getInput('status'),
    content: core.getInput('content'),
    description: core.getInput('description'),
    title: core.getInput('title'),
    color: statusOptions[core.getInput('status')].color,
    url: core.getInput('url'),
    username: core.getInput('username'),
    avatar_url: core.getInput('avatar_url'),
  }

  if (!inputs.webhooks.length) {
    core.warning('No webhooks provided');
  }

  return inputs;
}