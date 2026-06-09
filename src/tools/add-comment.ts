import { Tool } from "./types.js";

export const addComment: Tool = {
  name: "add_comment",
  description: "Add a comment to a Jira issue",
  inputSchema: {
    type: "object",
    properties: {
      issueKey: {
        type: "string",
        description: "The issue key (e.g., 'PROJ-123')",
      },
      comment: {
        type: "string",
        description: "Comment text",
      },
    },
    required: ["issueKey", "comment"],
  },
  handler: async (client, input) => {
    const result = await client.addComment(
      input.issueKey as string,
      input.comment as string
    );
    return {
      success: true,
      commentId: result.id,
      message: "Comment added successfully",
    };
  },
};
