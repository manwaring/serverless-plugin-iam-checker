import { Config } from '../../lib';

export const basicConfig: Config = {
  allowedPatterns: ['arn:'],
  allowedReferences: ['Fn::Sub', 'Ref']
};

export const impossibleConfig: Config = {
  allowedPatterns: ['nothing will pass this'],
  allowedReferences: ["even if it did it won't pass this"]
};
