import * as core from '@actions/core';
import fs from 'fs';
import jsonschema from 'jsonschema';
import * as github from '@actions/github';
import { processDiscussion } from './index';

// Mock the dependencies
jest.mock('@actions/core');
jest.mock('fs');
jest.mock('jsonschema');
jest.mock('@actions/github');

describe('Discussion Workflow', () => {
  beforeEach(() => {
    // Reset the mocked values before each test
    jest.clearAllMocks();
  });

  it('should validate input and generate a valid JSON file', () => {
    // Mock the inputs
    core.getInput.mockReturnValueOnce('Test Title');
    core.getInput.mockReturnValueOnce('Test Body');
    core.getInput.mockReturnValueOnce('["Label 1", "Label 2"]');

    // Mock the schema validation result
    jsonschema.validate.mockReturnValueOnce({ valid: true });

    // Call the function you want to test
    processDiscussion();

    // Assertions
    expect(fs.writeFileSync).toHaveBeenCalledWith('prompt.json', expect.any(String));
    expect(core.setOutput).toHaveBeenCalledWith('validation', 'valid');
  });

  it('should handle empty labels input', () => {
    // Mock the inputs
    core.getInput.mockReturnValueOnce('Test Title');
    core.getInput.mockReturnValueOnce('Test Body');
    core.getInput.mockReturnValueOnce('');

    // Call the function you want to test
    processDiscussion();

    // Assertions
    expect(fs.writeFileSync).toHaveBeenCalledWith('prompt.json', expect.any(String));
    expect(core.setOutput).toHaveBeenCalledWith('validation', 'valid');
  });

  it('should handle invalid input and report validation errors', () => {
    // Mock the inputs
    core.getInput.mockReturnValueOnce('Test Title');
    core.getInput.mockReturnValueOnce('Test Body');
    core.getInput.mockReturnValueOnce('["Label 1", "Label 2"]');

    // Mock the schema validation result
    jsonschema.validate.mockReturnValueOnce({
      valid: false,
      errors: [{ message: 'Invalid schema' }],
    });

    // Call the function you want to test
    processDiscussion();

    // Assertions
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(core.setOutput).toHaveBeenCalledWith('validation', 'invalid');
    expect(core.setOutput).toHaveBeenCalledWith('invalid_reasons', expect.any(String));
  });
});
