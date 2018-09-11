import { Config } from '../../lib';

export const basicConfig: Config = {
  actions: {
    allowedPatterns: [':'],
    allowWildcards: false,
    allowWildcardOnly: false
  },
  resources: {
    allowedPatterns: ['arn:'],
    allowedReferences: ['Fn::Sub', 'Ref', 'Fn::Join'],
    allowWildcards: true,
    allowWildcardOnly: false
  }
};

export const partialConfigWithResources: Config = {
  resources: {
    allowedPatterns: ['arn:'],
    allowedReferences: ['Fn::Sub', 'Ref', 'Fn::Join'],
    allowWildcards: true,
    allowWildcardOnly: false
  }
};

export const partialConfigWithActions: Config = {
  actions: {
    allowedPatterns: [':'],
    allowWildcards: false,
    allowWildcardOnly: false
  }
};

export const impossibleConfig: Config = {
  actions: {
    allowedPatterns: ['nothing will pass this'],
    allowWildcards: false,
    allowWildcardOnly: false
  },
  resources: {
    allowedPatterns: ['nothing will pass this'],
    allowedReferences: ["even if it did it won't pass this"],
    allowWildcards: false,
    allowWildcardOnly: false
  }
};
