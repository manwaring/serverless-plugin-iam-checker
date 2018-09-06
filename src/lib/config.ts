const defaultConfig: Config = {
  checkStarOnly: true,
  allowedPatterns: [],
  allowedReferences: []
};

export class Config {
  constructor(config?: Config) {
    if (!config || Object.keys(config).length < 1) {
      this.checkStarOnly = defaultConfig.checkStarOnly;
      this.allowedPatterns = defaultConfig.allowedPatterns;
      this.allowedReferences = defaultConfig.allowedReferences;
    } else {
      this.allowedPatterns = config.allowedPatterns;
      this.allowedReferences = config.allowedReferences;
      this.checkStarOnly = config.checkStarOnly;
    }
  }
  checkStarOnly?: boolean;
  allowedPatterns?: string[];
  allowedReferences?: string[];
}
