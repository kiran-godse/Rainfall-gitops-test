// Import the code you want to test
const labelsInfo = require('./index');

// Import Axios and mock it
const axios = require('axios');
jest.mock('axios');

// Import the core module and mock its functions
const core = require('@actions/core');

// Mock the core.getInput function
const mockGetInput = jest.spyOn(core, 'getInput');
mockGetInput.mockReturnValueOnce('mockedPAT');
mockGetInput.mockReturnValueOnce('["Label1", "Label2"]');
mockGetInput.mockReturnValueOnce('mockedRepoName');

// Mock the core.setOutput function
const mockSetOutput = jest.spyOn(core, 'setOutput');

describe('labelsInfo', () => {
  it('should fetch labels and extract label IDs', async () => {
    // Mock the Axios `get` method
    axios.get.mockResolvedValueOnce({
      data: [
        { name: 'Label1', node_id: 'NodeID1' },
        { name: 'Label2', node_id: 'NodeID2' },
      ],
    });

    // Call the labelsInfo function
    await labelsInfo();

    // Assertions
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('https://api.github.com/repos/rainfall-one/gitops-test/labels'),
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: 'Bearer mockedPAT',
        },
      }
    );

    expect(mockSetOutput).toHaveBeenCalledWith('label_id', ['NodeID1', 'NodeID2']);
  });



});




