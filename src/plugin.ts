import { Resources, Config, RoleChecker } from './lib';

class IamCheckerPlugin {
  serverless: any;
  roleChecker: RoleChecker;
  hooks: any;

  constructor(serverless) {
    this.serverless = serverless;
    this.hooks = {
      'after:package:createDeploymentArtifacts': this.checkIam.bind(this)
    };
  }

  checkIam() {
    this.log('Checking IAM permissions...');
    const config = new Config(
      (this.serverless.service.custom && this.serverless.service.custom.iamChecker) || undefined
    );
    const resources = new Resources(this.serverless.service.provider.compiledCloudFormationTemplate.Resources);
    const invalidRoles = resources
      .getIamRoles()
      .map(role => new RoleChecker(config, role).validate())
      .filter(validation => !validation.isValid);
    if (invalidRoles && invalidRoles.length > 0) {
      const message = invalidRoles.reduce(
        (msg, validation, index) => `${msg}${index > 0 ? ', ' : ''}${validation.role.resourceName}`,
        `The following roles have invalid configurations: `
      );
      invalidRoles.forEach(validation => {
        this.debug(`  ${validation.role.resourceName} has the following validation errors:`);
        validation.validationMessages.forEach(message => this.debug(`   ${message}`));
      });
      throw new this.serverless.classes.Error(message);
    }
  }

  log(message: string) {
    this.serverless.cli.log(message);
  }

  debug(message: string) {
    if (process.env.SLS_DEBUG) {
      this.serverless.cli.log(message);
    }
  }
}

export = IamCheckerPlugin;
