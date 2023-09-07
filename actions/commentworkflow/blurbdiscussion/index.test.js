const core = require('@actions/core');
const fetch = require('node-fetch');
const updateDiscussion = require('./index');

// Mock the functions from node-fetch and @actions/core
jest.mock('node-fetch');
jest.mock('@actions/core');

describe('updateDiscussion', () => {
  it('should update the discussion successfully', async () => {
    // Mock the core.getInput values
    core.getInput.mockReturnValueOnce('mockedAccessToken'); // PAT
    core.getInput.mockReturnValueOnce('mockedDiscussionId'); // discussionId
    core.getInput.mockReturnValueOnce('mockedUpdatingBody'); // updatedbody

    // Mock the fetch function to return a successful response
    fetch.mockResolvedValue({
      status: 200,
      statusText: 'OK',
    });

    // Call the updateDiscussion function
    await updateDiscussion();

    // Assertions
    expect(core.getInput).toHaveBeenCalledWith('PAT');
    expect(core.getInput).toHaveBeenCalledWith('discussionId');
    expect(core.getInput).toHaveBeenCalledWith('updatedbody');
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer mockedAccessToken',
      },
      body: expect.stringContaining('mutation'),
    });
    expect(console.log).toHaveBeenCalledWith('Discussion updated successfully.');
  });

  it('should handle API error', async () => {
    // Mock the core.getInput values
    core.getInput.mockReturnValueOnce('mockedAccessToken'); // PAT
    core.getInput.mockReturnValueOnce('mockedDiscussionId'); // discussionId
    core.getInput.mockReturnValueOnce('mockedUpdatingBody'); // updatedbody

    // Mock the fetch function to return an error response
    fetch.mockResolvedValue({
      status: 500,
      statusText: 'Internal Server Error',
    });

    // Call the updateDiscussion function
    await updateDiscussion();

    // Assertions
    expect(console.error).toHaveBeenCalledWith('Error:', 500, 'Internal Server Error');
  });

  it('should handle fetch error', async () => {
    // Mock the core.getInput values
    core.getInput.mockReturnValueOnce('mockedAccessToken'); // PAT
    core.getInput.mockReturnValueOnce('mockedDiscussionId'); // discussionId
    core.getInput.mockReturnValueOnce('mockedUpdatingBody'); // updatedbody

    // Mock the fetch function to throw an error
    fetch.mockRejectedValue(new Error('Fetch error'));

    // Call the updateDiscussion function
    await updateDiscussion();

    // Assertions
    expect(console.error).toHaveBeenCalledWith('Error:', 'Fetch error');
  });
});
