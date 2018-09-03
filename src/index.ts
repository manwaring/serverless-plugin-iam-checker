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
      'after:package:createDeploymentArtifacts': this.checkIam.bind(this)
    };
  }

  serverless: any;
  hooks: any;

  checkIam() {
    let resources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
    const roles = [];
    const keys = Object.keys(resources);
    this.log(JSON.stringify(resources));
    this.log(keys);
    this.log(JSON.stringify(keys));
    Object.keys(resources).forEach(key => {
      this.log(key);
      if (resources[key].Type === 'AWS::IAM::Role') {
        roles.push(resources[key]);
      }
    });
    // const roles = resources.filter(resource => resource.Type === 'AWS::IAM::Role');
    this.log(roles);
    roles.forEach(role => this.checkRole(role));
    this.log('Hello from Serverless!');
  }

  checkRole(role: any) {
    this.log(role);
    const policies = role.Properties.Policies;
    this.log(policies);
    policies.forEach(policy => this.checkPolicy(policy));
  }

  checkPolicy(policy: any) {
    this.log(policy);
    const statements = policy.Statement;
    this.log(statements);
    statements.forEach(statement => this.checkStatement(statement));
  }

  checkStatement(statement: any) {
    this.log(statement);
    const actions = statement.Action;
    const resources = statement.Resource;
    const starActions = actions.find(action => action && action.indexOf('*') > -1);
    const starResources = resources.find(resource => resource && resource.indexOf('*') > -1);
    if (starActions.length > 0 || starResources.length > 0) {
      throw new this.serverless.classes.Error(`Actions or resources contain *`);
    }
  }

  log(...args) {
    this.serverless.cli.log(args);
  }
}

export = IamChecker;
