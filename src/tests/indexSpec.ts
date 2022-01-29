import supertest from 'supertest';
import app from '../index';
import { getImage, getImagesDir } from '../utils/fsUtils';
import fs from 'fs';
import path from 'path';

const request = supertest(app);

describe('Test endpoint responses', () => {
  const validFile = 'right';
  const invalidFile = 'nonExistingFile';
  const width = 300;
  const height = 400;
  invalid= notValid;


  it('gets the main endpoint', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe(
      'use api/images?filename={yourfilename} to get started'
    );
  });
  it('gets the api endpoint', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
    expect(response.text).toBe(
      'use api/images?filename={yourfilename} to get started'
    );
  });
  it('get api/images with invalid file', async () => {
    const response = await request.get('/api/images?filename=' + invalidFile);
    expect(response.status).toBe(400);
    expect(response.text).toBe('file name is invalid');
  });
});
