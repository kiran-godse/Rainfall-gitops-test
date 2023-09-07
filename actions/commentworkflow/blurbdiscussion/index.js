import fetch from "node-fetch";
import * as core from "@actions/core";

const updateDiscussion = async () => {
const accessToken = core.getInput("PAT");
const discussionId = core.getInput("discussionId");
const updatingbody = core.getInput("updatedbody");
console.log('discussionId', discussionId);
console.log('updatingbody', updatingbody);

const graphqlMutation = `
mutation {
   updateDiscussion(input: {
      discussionId: "${discussionId}",
      body: ${JSON.stringify(updatingbody)}
   }) {
      discussion {
         id
         body
      }
   }
}
`;


const apiUrl = 'https://api.github.com/graphql';


const headers = {
    "Content-Type": "application/json",
    'Authorization': 'Bearer '+ accessToken ,
};


console.log('Api url', apiUrl)
console.log('heade:', headers)
console.log('graph mutation', graphqlMutation)
fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query: graphqlMutation }),
})
    .then(response => {
        if (response.status === 200) {
            console.log('Discussion updated successfully.');
        }
        else {
            console.log('Error:', response.status , response.message)
        }
    });
};

module.exports = updateDiscussion;