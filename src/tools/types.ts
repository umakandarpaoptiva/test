import { JiraClient } from "../jira-client.js";

export interface Tool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (client: JiraClient, input: Record<string, unknown>) => Promise<unknown>;
}
