import express from 'express';

const logger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction //resolve linter error to not use Function as a type
): void => {
  const url = req.url;
  console.log('Visited : ' + url);
  next();
};

export default logger;
