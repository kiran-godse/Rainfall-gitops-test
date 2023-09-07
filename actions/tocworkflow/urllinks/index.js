import core from '@actions/core';
import github from '@actions/github';

try {
    const discussionTitle = github.context.payload.discussion.title;
    const discussionBody = github.context.payload.discussion.body;

    console.log(`TOC Body: ${discussionBody}`);
    console.log(`TOC Title: ${discussionTitle}`);
    
    const linkRegex = /#(\[.*?\])\((https?:\/\/[^\s]+)\)/g;

    const extractedLinks = [];
    let match;
    while ((match = linkRegex.exec(discussionBody)) !== null) {
        const url = match[2];
        extractedLinks.push(url);
    }

    console.log(extractedLinks);


    core.setOutput("toc_url",extractedLinks);
    core.setOutput("toc_title", discussionTitle);

} catch (error) {
    core.setFailed(error.message);
}