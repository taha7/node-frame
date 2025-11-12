// Simple Jest test with basic assertion
// Jest provides test() and expect() globals automatically

import { test, expect } from '@jest/globals';

test('true equals true', () => {
  expect(true).toEqual(true);
});

test('basic math', () => {
  expect(1 + 1).toBe(2);
});

test('string equality', () => {
  expect('hello').toBe('hello');
});
