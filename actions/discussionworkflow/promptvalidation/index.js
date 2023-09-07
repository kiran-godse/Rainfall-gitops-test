import * as core from '@actions/core';
import fs from 'fs/promises'; // Use 'fs/promises' for the promises-based API
import jsonschema from 'jsonschema';
import * as github from '@actions/github';

// Rest of your test file...

import { invalid_labels} from '../../../constant.js';

const discussionTitle = core.getInput("title");
const discussionBody = core.getInput("body");
const inputLabels = core.getInput("labels");

let discussionLabels;

if (inputLabels === '') {
  discussionLabels = [];
} else {
  const labels = inputLabels.replace('[', '').replaceAll('"', '').replace(']', '');
  discussionLabels = labels.split(',');
}

console.log("discussionlabels:", discussionLabels);

let invalid_reason = [];

if(discussionLabels.length==0){
  invalid_reason.push(invalid_labels)
}
if (invalid_reason.length > 0) {
  const invalidreason = invalid_reason.join('\n');
  const words = invalidreason.split(' ');
  const invalidreasons = words.join('\\space ');
  console.log("invaid_reasin",invalidreasons);
  core.setOutput('invalid_reasons', invalidreasons);
}


const promptJson = {
  Title: discussionTitle,
  Labels: discussionLabels,
  Body: discussionBody
};

console.log('Constructed prompt JSON:\n', JSON.stringify(promptJson, null, 2));

const promptJsonString = JSON.stringify(promptJson, null, 2);

const validationResult = jsonschema.validate(promptJson, schema);
let isvalid = '';
if (validationResult.valid) {
  isvalid = 'valid';
  console.log('Generated prompt JSON is valid.');
  fs.writeFileSync('prompt.json', promptJsonString);
} else {
  isvalid = 'invalid';
  console.log('Generated prompt JSON is invalid.');
  console.log('Validation errors:', validationResult.errors);
}
core.setOutput("validation", isvalid);