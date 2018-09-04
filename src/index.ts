import { Resources, Role } from './cloudformation';

class IamChecker {
  serverless: any;
  hooks: any;

  constructor(serverless) {
    this.serverless = serverless;
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
        (msg: string, role: Role, index: number) => `${msg}${index > 0 ? ', ' : ''}${role.resourceName}`,
        'The following roles have invalid configurations: '
      );
      throw new this.serverless.classes.Error(message);
    }
  }

  log(message: string) {
    this.serverless.cli.log(message);
  }

  logDebugObject(message: string) {
    if (process.env.SLS_DEBUG) {
      this.serverless.cli.log(message);
    }
  }
}

export = IamChecker;
