import { Tool } from "./types.js";

export const updateIssue: Tool = {
  name: "update_issue",
  description: "Update fields on a Jira issue",
  inputSchema: {
    type: "object",
    properties: {
      issueKey: {
        type: "string",
        description: "The issue key (e.g., 'PROJ-123')",
      },
      summary: {
        type: "string",
        description: "New summary (optional)",
      },
      description: {
        type: "string",
        description: "New description (optional)",
      },
      priority: {
        type: "string",
        description: "New priority (optional)",
      },
      assignee: {
        type: "string",
        description: "New assignee username (optional)",
      },
    },
    required: ["issueKey"],
  },
  handler: async (client, input) => {
    const issueKey = input.issueKey as string;
    const updates: Record<string, unknown> = {};

    if (input.summary) updates.summary = input.summary;
    if (input.description) updates.description = input.description;
    if (input.priority) updates.priority = { name: input.priority };
    if (input.assignee) updates.assignee = { name: input.assignee };

    await client.updateIssue(issueKey, updates);
    return {
      success: true,
      message: `Issue ${issueKey} updated successfully`,
    };
  },
};
