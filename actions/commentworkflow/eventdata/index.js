import * as core from "@actions/core";
import * as github from '@actions/github';

function handleGitHubAction() {
try {
  const commentBody = github.context.payload.comment.body;
  const discussionId = github.context.payload.discussion.id;
  const discussionNodeId = github.context.payload.discussion.node_id;
  const discussionBody = github.context.payload.discussion.body;

  console.log(`Comment Body: ${commentBody}`);
  console.log(`Discussion ID: ${discussionId}`);
  console.log(`Discussion Node ID: ${discussionNodeId}`);
  console.log(`Discussion Body: ${discussionBody}`);

  core.setOutput("comment_body", commentBody);
  core.setOutput("disc_ID", discussionNodeId);
  core.setOutput("disc_body", discussionBody);
} catch (error) {
  core.setFailed(error.message);
}
}
module.exports = handleGitHubAction;
