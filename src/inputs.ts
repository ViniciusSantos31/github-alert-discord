import * as core from '@actions/core';

export interface Inputs {
  webhooks: string[];
  username: string;
  avatar_url: string;
}

interface StatusOption {
  title: string;
  color: number;
}

export const actionOption: Record<string, StatusOption> = {
  pull_request: { title: 'Pull Request', color: 5814783 },
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
    username: core.getInput('username'),
    avatar_url: core.getInput('avatar_url'),
  }

  if (!inputs.webhooks.length) {
    core.warning('No webhooks provided');
  }

  return inputs;
}