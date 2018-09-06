import { Config } from '../../lib';

export const standardConfig: Config = {
  allowedPatterns: ['arn:'],
  allowedReferences: ['Fn::Sub', 'Ref']
};
