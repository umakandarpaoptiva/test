import { Tool } from "./types.js";

export const searchIssues: Tool = {
  name: "search_issues",
  description: "Search for Jira issues using JQL (Jira Query Language)",
  inputSchema: {
    type: "object",
    properties: {
      jql: {
        type: "string",
        description: "JQL query string (e.g., 'project = PROJ AND status = To Do')",
      },
      maxResults: {
        type: "number",
        description: "Maximum number of results to return (default: 50)",
        default: 50,
      },
    },
    required: ["jql"],
  },
  handler: async (client, input) => {
    const jql = input.jql as string;
    const maxResults = (input.maxResults as number) || 50;
    const result = await client.searchIssues(jql, maxResults);
    return {
      total: result.total,
      returned: result.issues.length,
      issues: result.issues.map((issue) => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status?.name,
        assignee: issue.fields.assignee?.displayName,
        priority: issue.fields.priority?.name,
        created: issue.fields.created,
        updated: issue.fields.updated,
      })),
    };
  },
};
