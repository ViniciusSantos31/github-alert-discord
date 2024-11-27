import { Context } from "@actions/github/lib/context";
import { actionOption } from "./inputs";

export function getPullRequestFormat(ctx: Context): Object {

  const { owner, repo } = ctx.repo;
  const { eventName, payload, serverUrl, action } = ctx;
  const repoUrl = `${serverUrl}/${owner}/${repo}`;

  const request_reviewers: Array<{ login: string, avatar_url: string }> = payload.pull_request
    ?.requested_reviewers;

  let embed: { [key: string]: any } = {
    color: actionOption[eventName]?.color || 0x000000,
    timestamp: new Date().toISOString(),
    title: actionOption[eventName]?.title || eventName,
    url: payload.pull_request?.html_url,
    description:
      `A new pull request has been **${action}** in \`${repo}\` by [${payload.pull_request?.user.login}](${payload.pull_request?.user.html_url})`,
    fields: [
      {
        name: "Repository",
        value: `[${repo}](${repoUrl})`,
      },
      {
        name: "PR Description",
        value: payload.pull_request?.body || "No description",
      },
      (request_reviewers?.length && {
        name: "Reviewers",
        value: request_reviewers
          .map(reviewer => `[${reviewer.login}](${reviewer.avatar_url})`)
          .join(", "),
        inline: true
      }),
      {
        name: "Link to PR",
        value:
          `[#${payload.pull_request?.number} ${payload.pull_request?.title ?? "Pull request link"}](${payload.pull_request?.html_url})`,
        inline: true
      }
    ]
  };
  
  const discord_payload = {
    username: "GitHub Action",
    avatar_url:
      "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    embeds: [embed]
  };
  
  return discord_payload;
}