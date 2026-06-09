import { Tool } from "./types.js";

export const getIssue: Tool = {
  name: "get_issue",
  description: "Get details of a specific Jira issue by its key",
  inputSchema: {
    type: "object",
    properties: {
      issueKey: {
        type: "string",
        description: "The issue key (e.g., 'PROJ-123')",
      },
    },
    required: ["issueKey"],
  },
  handler: async (client, input) => {
    const issueKey = input.issueKey as string;
    const issue = await client.getIssue(issueKey);
    return {
      key: issue.key,
      id: issue.id,
      summary: issue.fields.summary,
      description: issue.fields.description,
      status: issue.fields.status?.name,
      assignee: issue.fields.assignee?.displayName,
      priority: issue.fields.priority?.name,
      created: issue.fields.created,
      updated: issue.fields.updated,
    };
  },
};
