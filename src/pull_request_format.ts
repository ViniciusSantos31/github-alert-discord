import { Context } from "@actions/github/lib/context";
import { actionColors } from "./inputs";

export function getPullRequestFormat(ctx: Context): Object {

  const { owner, repo } = ctx.repo;
  const { eventName, payload, serverUrl } = ctx;
  const repoUrl = `${serverUrl}/${owner}/${repo}`;

  const request_reviewers: Array<{ login: string, avatar_url: string }> = payload.pull_request
    ?.requested_reviewers;

  let embed: { [key: string]: any } = {
    color: actionColors[payload.action ?? "opened"] || 0x000000,
    timestamp: new Date().toISOString(),
    title: "Pull request",
    url: payload.pull_request?.html_url,
    description:
      `A pull request has been **${payload.action}** in **\`${repo}\`** by [${payload.pull_request?.user.login}](${payload.pull_request?.user.html_url})`,
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
        value: request_reviewers?.length ? request_reviewers
          .map(reviewer => `[${reviewer.login}](${reviewer.avatar_url})`)
          .join(", ") : `[Click to add reviewers](${payload.pull_request?.html_url})`,
        inline: true
      },
      {
        name: "Link to PR",
        value:
          `[#${payload.pull_request?.number} ${payload.pull_request?.title ?? "Pull request link"}](${payload.pull_request?.html_url})`,
        inline: true
      }
    ],
    footer: {
      text: `Requested by ${payload.pull_request?.user.login}`,
      icon_url: payload.pull_request?.user.avatar_url
    },
  };
  
  const discord_payload = {
    username: "GitHub Action",
    avatar_url:
      "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    embeds: [embed],
  };
  
  return discord_payload;
}