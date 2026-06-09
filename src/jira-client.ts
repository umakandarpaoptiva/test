import axios, { AxiosInstance } from "axios";

interface JiraIssue {
  key: string;
  id: string;
  fields: {
    summary: string;
    description?: string;
    status?: { name: string };
    assignee?: { displayName: string; emailAddress: string };
    priority?: { name: string };
    created: string;
    updated: string;
    [key: string]: unknown;
  };
}

interface JiraSearchResult {
  issues: JiraIssue[];
  total: number;
  maxResults: number;
  startAt: number;
}

export class JiraClient {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string, email: string, apiToken: string) {
    const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");

    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  async searchIssues(jql: string, maxResults: number = 50): Promise<JiraSearchResult> {
    try {
      const response = await this.axiosInstance.get("/rest/api/3/search", {
        params: {
          jql,
          maxResults,
          fields: [
            "summary",
            "description",
            "status",
            "assignee",
            "priority",
            "created",
            "updated",
          ],
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getIssue(issueKey: string): Promise<JiraIssue> {
    try {
      const response = await this.axiosInstance.get(`/rest/api/3/issue/${issueKey}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createIssue(issueData: {
    project: string;
    summary: string;
    description?: string;
    issueType: string;
    assignee?: string;
    priority?: string;
  }): Promise<{ id: string; key: string }> {
    try {
      const payload = {
        fields: {
          project: { key: issueData.project },
          summary: issueData.summary,
          description: issueData.description || "",
          issuetype: { name: issueData.issueType },
          ...(issueData.assignee && { assignee: { name: issueData.assignee } }),
          ...(issueData.priority && { priority: { name: issueData.priority } }),
        },
      };

      const response = await this.axiosInstance.post("/rest/api/3/issue", payload);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateIssue(
    issueKey: string,
    updates: Record<string, unknown>
  ): Promise<void> {
    try {
      await this.axiosInstance.put(`/rest/api/3/issue/${issueKey}`, {
        fields: updates,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async transitionIssue(issueKey: string, transitionId: string): Promise<void> {
    try {
      await this.axiosInstance.post(`/rest/api/3/issue/${issueKey}/transitions`, {
        transition: { id: transitionId },
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addComment(issueKey: string, comment: string): Promise<{ id: string }> {
    try {
      const response = await this.axiosInstance.post(
        `/rest/api/3/issue/${issueKey}/comments`,
        {
          body: {
            version: 1,
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: comment,
                  },
                ],
              },
            ],
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.errorMessages?.[0] || error.message;
      return new Error(`Jira API Error: ${message}`);
    }
    return error instanceof Error ? error : new Error(String(error));
  }
}
