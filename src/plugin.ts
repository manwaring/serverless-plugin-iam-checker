import { Resources, Config, RoleChecker } from './lib';

class IamCheckerPlugin {
  serverless: any;
  config: Config;
  roleChecker: RoleChecker;
  hooks: any;

  constructor(serverless) {
    this.serverless = serverless;
    this.config = new Config((serverless.service.custom && serverless.service.custom.iamChecker) || undefined);
    this.hooks = {
      'after:package:createDeploymentArtifacts': this.checkIam.bind(this)
    };
  }

  checkIam() {
    this.log('Checking IAM permissions...');
    const resources = new Resources(this.serverless.service.provider.compiledCloudFormationTemplate.Resources);
    const invalidRoles = resources
      .getIamRoles()
      .map(role => new RoleChecker(this.config, role).validate())
      .filter(validation => !validation.isValid);
    if (invalidRoles && invalidRoles.length > 0) {
      const message = invalidRoles.reduce(
        (msg, validation, index) => `${msg}${index > 0 ? ', ' : ''}${validation.role.resourceName}`,
        'The following roles have invalid configurations: '
      );
      this.debug(
        invalidRoles.reduce(
          (msg, validation, index) => `${msg}${index > 0 ? '/n' : ''}${validation.validationMessages}`,
          'The following errors occurred:/n'
        )
      );
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
