import * as core from '@actions/core';
import * as github from '@actions/github';
import axios from 'axios';
import { processDiscussion } from './index';

// Mock the dependencies
jest.mock('@actions/core');
jest.mock('axios');
jest.mock('@actions/github');

describe('processDiscussion', () => {
  beforeEach(() => {
    // Reset the mocked values before each test
    jest.clearAllMocks();
  });

  it('should handle a valid discussion', async () => {
    // Mock the inputs and payload for a valid discussion
    core.getInput.mockReturnValueOnce('mockedPAT');
    core.getInput.mockReturnValueOnce('mockedRepoName');
    github.context.payload = {
      discussion: {
        body: 'title: Test Title\nlabels: ["Label 1", "Label 2"]\nbody: Test Body',
      },
      repository: {
        node_id: 'mockedRepoNodeId',
      },
    };

    // Mock the axios response
    const axiosResponse = {
      data: [
        { name: 'Label 1', node_id: 'label1NodeId' },
        { name: 'Label 2', node_id: 'label2NodeId' },
      ],
    };
    axios.get.mockResolvedValueOnce(axiosResponse);

    // Call the function you want to test
    const result = await processDiscussion();

    // Assertions
    expect(result.labelIds).toEqual(['label1NodeId', 'label2NodeId']);
    expect(result.missingFields).toHaveLength(0);
    // Add more assertions as needed
  });

  it('should handle a discussion with missing title', async () => {
    // Mock the inputs and payload for a discussion with a missing title
    core.getInput.mockReturnValueOnce('mockedPAT');
    core.getInput.mockReturnValueOnce('mockedRepoName');
    github.context.payload = {
      discussion: {
        body: 'labels: ["Label 1", "Label 2"]\nbody: Test Body',
      },
      repository: {
        node_id: 'mockedRepoNodeId',
      },
    };

    // Mock the axios response (not needed for this case)

    // Call the function you want to test
    const result = await processDiscussion();

    // Assertions for missing title case
    expect(result.missingFields).toContain('missing_title');
    // Add more assertions as needed
  });

  // Add more test cases for different scenarios (missing labels, invalid title, etc.)

  // ...
});
