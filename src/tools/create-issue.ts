import { Tool } from "./types.js";

export const createIssue: Tool = {
  name: "create_issue",
  description: "Create a new Jira issue",
  inputSchema: {
    type: "object",
    properties: {
      project: {
        type: "string",
        description: "Project key (e.g., 'PROJ')",
      },
      summary: {
        type: "string",
        description: "Issue summary/title",
      },
      description: {
        type: "string",
        description: "Issue description (optional)",
      },
      issueType: {
        type: "string",
        description: "Issue type (e.g., 'Bug', 'Task', 'Story')",
      },
      assignee: {
        type: "string",
        description: "Assignee username (optional)",
      },
      priority: {
        type: "string",
        description: "Priority (e.g., 'High', 'Medium', 'Low') (optional)",
      },
    },
    required: ["project", "summary", "issueType"],
  },
  handler: async (client, input) => {
    const result = await client.createIssue({
      project: input.project as string,
      summary: input.summary as string,
      description: input.description as string | undefined,
      issueType: input.issueType as string,
      assignee: input.assignee as string | undefined,
      priority: input.priority as string | undefined,
    });
    return {
      success: true,
      issueId: result.id,
      issueKey: result.key,
      message: `Issue ${result.key} created successfully`,
    };
  },
};
