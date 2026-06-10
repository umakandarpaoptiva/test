import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  TextContent,
} from "@modelcontextprotocol/sdk/types.js";
import { JiraClient } from "./jira-client.js";
import { tools } from "./tools/index.js";

// Initialize Jira client
const jiraUrl = process.env.JIRA_URL || "https://your-domain.atlassian.net";
const jiraEmail = process.env.JIRA_EMAIL || "";
const jiraApiToken = process.env.JIRA_API_TOKEN || "";

const jiraClient = new JiraClient(jiraUrl, jiraEmail, jiraApiToken);

// Create MCP server
const server = new Server({
  name: "jira-mcp-server",
  version: "1.0.0",
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const toolInput = request.params.arguments as Record<string, unknown>;

  try {
    const tool = tools.find((t) => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    const result = await tool.handler(jiraClient, toolInput);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        } as TextContent,
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
          isError: true,
        } as TextContent,
      ],
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Jira MCP server started");
}

main().catch(console.error);
