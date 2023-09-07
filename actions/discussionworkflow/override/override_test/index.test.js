const github = require('@actions/github');
const core = require('@actions/core');
const processDiscussionBody = require('./index');


// Mock the core.setOutput function
jest.spyOn(core, 'setOutput');

describe('Discussion Body Processing', () => {
  it('should set override_status to "absent" when "override" is not present in the discussion body', () => {
    // Mock the GitHub context payload with no "override" keyword
    github.context.payload = {
      discussion: {
        body: 'Some discussion content\nthat does not contain the word "override"',
      },
    };

    // Call the function that processes the discussion body
    processDiscussionBody();

    // Assertions
    expect(core.setOutput).toHaveBeenCalledWith('override_status', 'absent');
  });

  it('should set override_status to "present" when "override" is present in the discussion body', () => {
    // Mock the GitHub context payload with "override" keyword
    github.context.payload = {
      discussion: {
        body: 'Some discussion content\nthat contains the word "override"',
      },
    };

    // Call the function that processes the discussion body
    processDiscussionBody();

    // Assertions
    expect(core.setOutput).toHaveBeenCalledWith('override_status', 'absent');
  });
});
