import * as core from '@actions/core';
import { Octokit } from '@octokit/core';
import fetch from 'node-fetch';

const accessToken = core.getInput('PAT');
const repo_name = core.getInput('repo_name');
const [repoOwner, repoName] = repo_name.split("/");
let disc_Num = core.getInput('disc_body');

const discussionNumbers = disc_Num
  .split(' ')
  .map(text => parseInt(text.replace('#', ''), 10));

console.log(discussionNumbers);

const query = `
  query GetDiscussion($repoOwner: String!, $repoName: String!, $discussionNumber: Int!) {
    repository(owner: $repoOwner, name: $repoName) {
      discussion(number: $discussionNumber) {
        title
        body
      }
    }
  }
`;
const octokit = new Octokit({ auth: `token ${accessToken}`, request: { fetch } });

async function fetchDiscussionData(discussionNumber) {
  try {
    const response = await octokit.graphql(query, {
      repoOwner,
      repoName,
      discussionNumber,
    });

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    const discussion = response.repository.discussion;
    return {
      title: discussion.title,
      body: discussion.body,
    };
  } catch (error) {
    console.error(`Error fetching discussion data for discussion #${discussionNumber}:`, error.message);
    return null;
  }
}

async function fetchMultipleDiscussions() {
  const discussionData = await Promise.all(discussionNumbers.map(fetchDiscussionData));
  const allDiscussionData = []; 

  discussionData.forEach((data, index) => {
    if (data) {
      allDiscussionData.push({
        title: data.title,
        body: data.body,
      });
    }
  });

  return allDiscussionData;
}


fetchMultipleDiscussions().then(allDiscussionData => {
  console.log('All Discussion Data:', allDiscussionData);
  
  function convertToMarkdown(allDiscussionData) {
    let markdown = '';
  
    allDiscussionData.forEach(item => {
      markdown += `## ${item.title}\n\n${item.body}\n\n`;
    });
  
    return markdown;
  }
  
  const markdownData = convertToMarkdown(allDiscussionData);
  console.log(markdownData);
  
  core.setOutput('url_disc_body',markdownData);
});