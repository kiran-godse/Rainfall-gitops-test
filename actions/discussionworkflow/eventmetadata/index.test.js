const core = require('@actions/core'); // Import the 'core' module from GitHub Actions.
const github = require('@actions/github'); // Import the 'github' module from GitHub Actions.
const { updateDiscussion } = require('./index'); // Import the 'updateDiscussion' function from your own module.

// Mocking dependencies for testing purposes:
jest.mock('@actions/core'); // Mock the 'core' module.
jest.mock('@actions/github'); // Mock the 'github' module.

// Define a mock context object that simulates GitHub repository information.
const context = {
  repo: {
    owner: 'rainfall-kiran',
    repo: 'gitops-test',
  },
};

// Set the 'github.context' to the mock context object.
github.context = context;

// Begin describing the test suite for the 'updateDiscussion' function.
describe('updateDiscussion', () => {
  // Define a test case for the 'updateDiscussion' function.
  it('should update discussion and set outputs', async () => {
    // Mock a GitHub payload that simulates a discussion and repository information.
    github.context.payload = {
      repository: {
        node_id: 'TestRepositoryNodeId',
      },
      discussion: {
        number: 42,
        node_id: 'TestDiscussionNodeId',
        body: 'Test Discussion Body',
        title: 'Test Discussion Title',
      },
    };

    // Mock Octokit GraphQL response.
    const mockOctokit = {
      graphql: jest.fn().mockResolvedValue({
        repository: {
          discussion: {
            labels: {
              nodes: [{ name: 'Label1' }, { name: 'Label2' }],
            },
          },
        },
      }),
    };

    // Spy on the 'setOutput' function from the 'core' module.
    const setOutputSpy = jest.spyOn(core, 'setOutput');

    // Mock the return value of 'github.getOctokit'.
    github.getOctokit.mockReturnValue(mockOctokit);

    // Call the 'updateDiscussion' function with mock arguments.
    await updateDiscussion('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', 42, 'Updated Body');

    // Expectations for function calls and outputs.
    expect(mockOctokit.graphql).toHaveBeenCalledWith(expect.stringContaining(`query {
      repository(owner: "${github.context.repo.owner}", name: "${github.context.repo.repo}") {
        discussion(number: 42) {
          title
          body
          labels(first: 10) {
            nodes {
              name
            }
          }
        }
      }
    }`));

    expect(setOutputSpy).toHaveBeenCalledWith('disc_ID', 'TestDiscussionNodeId');
    expect(setOutputSpy).toHaveBeenCalledWith('disc_body', 'Test Discussion Body');
    expect(setOutputSpy).toHaveBeenCalledWith('disc_labels', 'Label1, Label2');
    expect(setOutputSpy).toHaveBeenCalledWith('repo_ID', 'TestRepositoryNodeId');
    expect(setOutputSpy).toHaveBeenCalledWith('disc_title', 'Test Discussion Title');
    expect(setOutputSpy).toHaveBeenCalledWith('disc_num', 42);

    // Restore the 'setOutput' spy after the test.
    setOutputSpy.mockRestore();
  });

  // Define another test case for error handling.
  it('should handle errors gracefully', async () => {
    // Set the GitHub payload to null to simulate an error condition.
    github.context.payload = null;

    // Spy on the 'setFailed' function from the 'core' module.
    const setFailedSpy = jest.spyOn(core, 'setFailed').mockImplementation(() => {});

    // Call the 'updateDiscussion' function with mock arguments.
    await updateDiscussion('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', 42, 'Updated Body');

    // Expectation: 'setFailed' function should have been called.
    expect(setFailedSpy).toHaveBeenCalled();

    // Restore the 'setFailed' spy after the test.
    setFailedSpy.mockRestore();
  });
});
