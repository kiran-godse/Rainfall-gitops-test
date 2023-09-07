import * as core from '@actions/core';
import axios from 'axios';
async function labelsInfo() {
const PAT = core.getInput('PAT');
const disc_labels = core.getInput('disc_labels');
const repoOwner = 'rainfall-one';
const repoName = 'gitops-test';

const disclabels = disc_labels.replace('[','').replaceAll('"','').replace(']','')

const infolabel = disclabels.split(',');

for (let i = 0; i < infolabel.length; i++) {
    infolabel[i] = infolabel[i].trim();
  }

console.log(infolabel)

const headers = {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `Bearer ${PAT}`
};

const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/labels`;

axios
  .get(apiUrl, { headers })
  .then(response => {
    const labels = response.data.map(label => ({
      name: label.name,
      node_id: label.node_id // Retrieve the label ID
    }));
    console.log('Labels:', labels);

    if (Array.isArray(infolabel)) {
      const labelIds = infolabel.map(labelName => {
        const label = labels.find(labelObj => labelObj.name === labelName);
        return label ? label.node_id : null;
      });

      console.log('Label IDs:', labelIds);
      core.setOutput("label_id",labelIds);
    } else {
      console.error('disc_labels is not an array');
    }
  })
  .catch(error => {
    console.error('Error fetching labels:', error.message);
  });
}
module.exports = labelsInfo;
