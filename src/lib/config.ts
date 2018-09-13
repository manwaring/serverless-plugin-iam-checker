export class Config {
  constructor(config?: Config) {
    config = config || defaultConfig;
    this.actions = new ActionConfig(config.actions);
    this.resources = new ResourceConfig(config.resources);
  }
  actions?: ActionConfig;
  resources?: ResourceConfig;
}

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

export class ActionConfig {
  constructor(config: ActionConfig) {
    const {
      IAM_CHECKER_ACTIONS_ALLOW_WILDCARDS,
      IAM_CHECKER_ACTIONS_ALLOW_WILDCARDONLY,
      IAM_CHECKER_ACTIONS_ALLOWED_PATTERNS
    } = process.env;
    this.allowWildcards = IAM_CHECKER_ACTIONS_ALLOW_WILDCARDS
      ? JSON.parse(IAM_CHECKER_ACTIONS_ALLOW_WILDCARDS)
      : config && config.allowWildcards
        ? config.allowWildcards
        : defaultConfig.actions.allowWildcards;
    this.allowWildcardOnly = IAM_CHECKER_ACTIONS_ALLOW_WILDCARDONLY
      ? JSON.parse(IAM_CHECKER_ACTIONS_ALLOW_WILDCARDONLY)
      : config && config.allowWildcardOnly
        ? config.allowWildcardOnly
        : defaultConfig.actions.allowWildcardOnly;
    this.allowedPatterns = IAM_CHECKER_ACTIONS_ALLOWED_PATTERNS
      ? JSON.parse(IAM_CHECKER_ACTIONS_ALLOWED_PATTERNS)
      : config && config.allowedPatterns
        ? config.allowedPatterns
        : defaultConfig.actions.allowedPatterns;
  }
  allowedPatterns: string[] = [];
  allowWildcards: boolean;
  allowWildcardOnly: boolean;
}

export class ResourceConfig {
  constructor(config: ResourceConfig) {
    const {
      IAM_CHECKER_RESOURCES_ALLOW_WILDCARDS,
      IAM_CHECKER_RESOURCES_ALLOW_WILDCARDONLY,
      IAM_CHECKER_RESOURCES_ALLOWED_PATTERNS,
      IAM_CHECKER_RESOURCES_ALLOWED_REFERENCES
    } = process.env;
    this.allowWildcards = IAM_CHECKER_RESOURCES_ALLOW_WILDCARDS
      ? JSON.parse(IAM_CHECKER_RESOURCES_ALLOW_WILDCARDS)
      : config && config.allowWildcards
        ? config.allowWildcards
        : defaultConfig.resources.allowWildcards;
    this.allowWildcardOnly = IAM_CHECKER_RESOURCES_ALLOW_WILDCARDONLY
      ? JSON.parse(IAM_CHECKER_RESOURCES_ALLOW_WILDCARDONLY)
      : config && config.allowWildcardOnly
        ? config.allowWildcardOnly
        : defaultConfig.resources.allowWildcardOnly;
    this.allowedPatterns = IAM_CHECKER_RESOURCES_ALLOWED_PATTERNS
      ? JSON.parse(IAM_CHECKER_RESOURCES_ALLOWED_PATTERNS)
      : config && config.allowedPatterns
        ? config.allowedPatterns
        : defaultConfig.resources.allowedPatterns;
    this.allowedReferences = IAM_CHECKER_RESOURCES_ALLOWED_REFERENCES
      ? JSON.parse(IAM_CHECKER_RESOURCES_ALLOWED_REFERENCES)
      : config && config.allowedReferences
        ? config.allowedReferences
        : defaultConfig.resources.allowedReferences;
  }
  allowedPatterns: string[] = [];
  allowedReferences: string[] = [];
  allowWildcards: boolean;
  allowWildcardOnly: boolean;
}
