import { Tool } from "./types.js";
import { searchIssues } from "./search-issues.js";
import { getIssue } from "./get-issue.js";
import { createIssue } from "./create-issue.js";
import { updateIssue } from "./update-issue.js";
import { addComment } from "./add-comment.js";

export const tools: Tool[] = [
  searchIssues,
  getIssue,
  createIssue,
  updateIssue,
  addComment,
];
