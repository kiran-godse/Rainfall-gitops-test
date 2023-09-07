import { createRequire } from "module";
const require = createRequire(import.meta.url);
global.require = require;

const fs = require('fs');
const ejs = require('ejs');

import * as core from "@actions/core";

const blurb_body = core.getInput("blurb_body");
const comment_body = core.getInput("comment_body");

try {
    const templateContent = fs.readFileSync('gptprompt.edge', 'utf-8');
    const compiledTemplate = ejs.compile(templateContent)

    const data = {
        previous_response: blurb_body,
        new_comment: comment_body
    };

    const finalgptprompt = compiledTemplate(data);
    core.setOutput("Newprompt", finalgptprompt);
} catch (error) {
    console.error("An error occured: ", error);
}
