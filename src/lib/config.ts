const defaultConfig: Config = {
  actions: {
    allowStars: false
  },
  resources: {
    allowedPatterns: [],
    allowedReferences: []
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

class ActionConfig {
  allowStars: boolean;
}

class ResourceConfig {
  allowedPatterns: [];
  allowedReferences: [];
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
