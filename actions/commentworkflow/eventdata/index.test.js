// Import the necessary modules and libraries for the GitHub Action
// GitHub Actions core module for setting outputs and handling errors
// GitHub Actions github module for accessing GitHub context
const core = require('@actions/core'); 
const github = require('@actions/github'); 
const handleGitHubAction = require('./index'); 

// Mock the imported modules for testing
// Mock the core module and github module for testing
jest.mock('@actions/core'); 
jest.mock('@actions/github'); 

// Describe the test suite for the GitHub Action
describe('GitHub Actions', () => {
  
  it('should set outputs correctly', () => {
    // Set the payload data for the GitHub context
    github.context.payload = {
      comment: { body: 'Test Comment Body' },
      discussion: { id: 123, node_id: 'testNodeId', body: 'Test Discussion Body' },
    };

    // Spy on the setOutput function from the core module
    const setOutputSpy = jest.spyOn(core, 'setOutput');

    // Call the main function to be tested
    handleGitHubAction();

    // Expectations: Verify that setOutput was called with the expected values
    expect(setOutputSpy).toHaveBeenCalledWith('comment_body', 'Test Comment Body');
    expect(setOutputSpy).toHaveBeenCalledWith('disc_ID', 'testNodeId');
    expect(setOutputSpy).toHaveBeenCalledWith('disc_body', 'Test Discussion Body');

    // Restore the original setOutput function after testing
    setOutputSpy.mockRestore();
  });

  // Test case: should handle errors gracefully
  it('should handle errors gracefully', () => {
    // Set the payload data to null to simulate an error condition
    github.context.payload = null;

    // Spy on the setFailed function from the core module and mock its implementation
    const setFailedSpy = jest.spyOn(core, 'setFailed').mockImplementation(() => {});

    // Call the main function to be tested
    handleGitHubAction();

    // Expectation: Verify that setFailed was called
    expect(setFailedSpy).toHaveBeenCalled();

    // Restore the original setFailed function after testing
    setFailedSpy.mockRestore();
  });
});
