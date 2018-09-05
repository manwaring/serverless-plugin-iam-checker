import { Resources, Role } from './lib/cloudformation';

class IamChecker {
  serverless: any;
  config: any;
  hooks: any;

  constructor(serverless) {
    this.serverless = serverless;
    this.config = (serverless.service.custom && serverless.service.custom.iamChecker) || {};
    this.hooks = {
      'after:package:createDeploymentArtifacts': this.checkIam.bind(this)
    };
  }

  checkIam() {
    this.log('Checking IAM permissions...');
    const resources = new Resources(this.serverless.service.provider.compiledCloudFormationTemplate.Resources);
    const invalidRoles = resources.getIamRoles().filter(role => role.isInvalid());
    if (invalidRoles && invalidRoles.length > 0) {
      const message = invalidRoles.reduce(
        (msg, role, index) => `${msg}${index > 0 ? ', ' : ''}${role.resourceName}`,
        'The following roles have invalid configurations: '
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

export = IamChecker;
