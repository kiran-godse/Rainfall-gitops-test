import * as core from "@actions/core";
import * as github from '@actions/github';

export async function updateDiscussion(accessToken, discussionId, updatingbody) {
try {
  const repositoryNodeId = github.context.payload.repository.node_id;
  const discussionTitle = github.context.payload.discussion.title;
  const discussionNum = github.context.payload.discussion.number;
  const discussionNodeId = github.context.payload.discussion.node_id;
  const discussionBody = github.context.payload.discussion.body;
  
  console.log(`Discussion number: ${discussionNum}`);
  console.log(`Discussion Node ID: ${discussionNodeId}`);
  console.log(`Discussion Body: ${discussionBody}`);
  console.log(`Discussion Title: ${discussionTitle}`);
  console.log(`repository node_id: ${repositoryNodeId}`);

  // GraphQL query
  const query = `
    query {
      repository(owner: "${github.context.repo.owner}", name: "${github.context.repo.repo}") {
        discussion(number: ${discussionNum}) {
          title
          body
          labels(first: 10) {
            nodes {
              name
            }
          }
        }
      }
    }
  `;

  // GitHub GraphQL API request using octokit
  const octokit = github.getOctokit(core.getInput("PAT")); 
  octokit.graphql(query).then((response) => {
    // Extract labels from the response
    const discussionLabels = response.repository.discussion.labels.nodes.map(
      (node) => node.name
    );
    console.log("Discussion Labels:", discussionLabels);
    
    core.setOutput("disc_ID", discussionNodeId);
    core.setOutput("disc_body", discussionBody);
    core.setOutput("disc_labels", discussionLabels.join(", "));
    core.setOutput("repo_ID", repositoryNodeId);
    core.setOutput("disc_title", discussionTitle);
    core.setOutput("disc_num", discussionNum);
  });
} catch (error) {
  core.setFailed(error.message);
}
}
