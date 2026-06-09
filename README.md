# Jira MCP Server

A Model Context Protocol (MCP) server implementation for Jira integration. This server enables AI models and other applications to interact with Jira through a standardized protocol.

## Features

- **Search Issues**: Search Jira issues using JQL (Jira Query Language)
- **Get Issue Details**: Retrieve detailed information about specific issues
- **Create Issues**: Create new Jira issues programmatically
- **Update Issues**: Modify issue fields like summary, description, priority, and assignee
- **Add Comments**: Add comments to existing issues

## Setup

### Prerequisites

- Node.js 18+
- Jira Cloud instance (or Jira Server/Data Center with API access)
- Jira API token (or password for Jira Server)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your Jira credentials:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your Jira information:
   ```
   JIRA_URL=https://your-domain.atlassian.net
   JIRA_EMAIL=your-email@example.com
   JIRA_API_TOKEN=your-api-token-here
   ```

### Getting a Jira API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Copy the token and add it to your `.env` file

## Usage

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Start

```bash
npm start
```

## Tools Available

### search_issues

Search for Jira issues using JQL.

**Input:**
- `jql` (string, required): JQL query string
- `maxResults` (number, optional): Maximum results to return (default: 50)

**Example:**
```json
{
  "jql": "project = PROJ AND status = 'To Do'",
  "maxResults": 10
}
```

### get_issue

Get details of a specific issue.

**Input:**
- `issueKey` (string, required): Issue key (e.g., 'PROJ-123')

### create_issue

Create a new Jira issue.

**Input:**
- `project` (string, required): Project key
- `summary` (string, required): Issue title
- `issueType` (string, required): Issue type (Bug, Task, Story, etc.)
- `description` (string, optional): Issue description
- `assignee` (string, optional): Assignee username
- `priority` (string, optional): Priority level

### update_issue

Update issue fields.

**Input:**
- `issueKey` (string, required): Issue key
- `summary` (string, optional): New summary
- `description` (string, optional): New description
- `priority` (string, optional): New priority
- `assignee` (string, optional): New assignee username

### add_comment

Add a comment to an issue.

**Input:**
- `issueKey` (string, required): Issue key
- `comment` (string, required): Comment text

## Configuration

The server reads configuration from environment variables:

- `JIRA_URL`: Your Jira instance URL
- `JIRA_EMAIL`: Email associated with your Jira account
- `JIRA_API_TOKEN`: API token for authentication

## Architecture

```
src/
├── index.ts           # Main server entry point
├── jira-client.ts     # Jira API client implementation
└── tools/             # Tool implementations
    ├── index.ts       # Tool registry
    ├── types.ts       # Tool type definitions
    ├── search-issues.ts
    ├── get-issue.ts
    ├── create-issue.ts
    ├── update-issue.ts
    └── add-comment.ts
```

## API Reference

This server uses the Jira REST API v3. For more information, visit:
https://developer.atlassian.com/cloud/jira/platform/rest/v3/

## Error Handling

All errors from the Jira API are caught and returned with descriptive messages. Authentication errors, rate limits, and invalid inputs are handled gracefully.

## Security

- Store API tokens securely (use `.env` file, never commit to version control)
- Use environment variables for sensitive configuration
- API tokens are transmitted over HTTPS

## License

MIT
