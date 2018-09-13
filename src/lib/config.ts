const defaultConfig: Config = {
  actions: {
    allowedPatterns: [':'],
    allowWildcards: false,
    allowWildcardOnly: false
  },
  resources: {
    allowedReferences: ['Ref', 'Fn::Join', 'Fn::Sub'],
    allowedPatterns: ['arn:'],
    allowWildcards: true,
    allowWildcardOnly: false
  }
};

export class Config {
  constructor(config?: Config) {
    config = getConfigValues(config);
    this.actions = config.actions;
    this.resources = config.resources;
  }
  actions?: ActionConfig;
  resources?: ResourceConfig;
}

export class ActionConfig {
  allowedPatterns: string[] = [];
  allowWildcards: boolean;
  allowWildcardOnly: boolean;
}

export class ResourceConfig {
  allowedPatterns: string[] = [];
  allowedReferences: string[] = [];
  allowWildcards: boolean;
  allowWildcardOnly: boolean;
}

// TODO need to override with environment variables if exist
function getConfigValues(config: Config): Config {
  if (!config || Object.keys(config).length < 1) {
    config = defaultConfig;
  }
  if (!config.actions || Object.keys(config.actions).length < 1) {
    config.actions = defaultConfig.actions;
  }
  if (!config.resources || Object.keys(config.resources).length < 1) {
    config.resources = defaultConfig.resources;
  }
  return config;
}
