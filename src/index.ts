class IamChecker {
  constructor(serverless) {
    this.serverless = serverless;

    // this.commands = {
    //   checkIam: {
    //     usage: "Checks your Iam policies for * permissions or resources",
    //     lifecycleEvents: ["hello", "world"],
    //     options: {
    //       message: {
    //         usage:
    //           "Specify the message you want to deploy " +
    //           "(e.g. \"--message 'My Message'\" or \"-m 'My Message'\")",
    //         required: true,
    //         shortcut: "m"
    //       }
    //     }
    //   }
    // };

    this.hooks = {
      'after:deploy:createDeploymentArtifacts': this.checkIam.bind(this)
    };
  }

  serverless: any;
  hooks: any;

  checkIam() {
    const resources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
    this.serverless.cli.log(JSON.stringify(resources);
    const roles = resources.filter(resource => resource.Type === 'AWS::IAM::Role');
    roles.forEach(role => this.checkRole(role));
    this.serverless.cli.log('Hello from Serverless!');
  }

  checkRole(role: any) {
    const policies = role.Properties.Policies;
    policies.forEach(policy => this.checkPolicy(policy));
  }

  checkPolicy(policy: any) {
    const statements = policy.Statement;
    statements.forEach(statement => this.checkStatement(statement));
  }

  checkStatement(statement: any) {
    const actions = statement.Action;
    const resources = statement.Resource;
    const starActions = actions.find(action => action && action.indexOf('*') > -1);
    const starResources = resources.find(resource => resource && resource.indexOf('*') > -1);
    if (starActions.length > 0 || starResources.length > 0) {
      throw new this.serverless.classes.Error(`Actions or resources contain *`);
    }
  }
}

export = IamChecker;
