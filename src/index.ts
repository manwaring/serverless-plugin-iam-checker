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
    let resources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
    let roles = [];
    const keys = Object.keys(resources);
    this.logDebugObject(resources);
    this.logDebugObject(keys);
    Object.keys(resources).forEach(key => {
      this.logDebugObject(key);
      this.logDebugObject(resources[key].Type);
      if (resources[key].Type === 'AWS::IAM::Role') {
        roles.push(resources[key]);
      }
    });
    this.logDebugObject(roles);
    if (roles && roles.length) {
      roles.forEach(role => this.checkRole(role));
    }
    this.logDebugObject('Hello from Serverless!');
  }

  checkRole(role: any) {
    this.logDebugObject(role);
    const policies = role.Properties.Policies;
    this.logDebugObject(policies);
    if (policies && policies.length) {
      policies.forEach(policy => this.checkPolicy(policy));
    }
  }

  checkPolicy(policy: any) {
    this.logDebugObject(policy);
    const statements = policy.PolicyDocument.Statement;
    this.logDebugObject(statements);
    if (statements && statements.length) {
      statements.forEach(statement => this.checkStatement(statement));
    }
  }

  checkStatement(statement: any) {
    this.logDebugObject(statement);
    const actions = statement.Action;
    const resources = statement.Resource;
    let starActions, starResources;
    // need to handle when this is a single action instead of array
    if (Array.isArray(actions)) {
      starActions = actions.find(action => {
        this.logDebugObject(action);
        action = JSON.stringify(action);
        this.logDebugObject(action);
        return action.indexOf('*') > -1;
      });
    } else if (JSON.stringify(actions).indexOf('*') > -1) {
      starActions = [actions];
    }
    // need to handle when this is a single resource instead of array
    if (Array.isArray(resources)) {
      starResources = resources.find(resource => {
        this.logDebugObject(resource);
        resource = JSON.stringify(resource);
        this.logDebugObject(resource);
        return resource.indexOf('*') > -1;
      });
    } else if (JSON.stringify(resources).indexOf('*') > -1) {
      starResources = [resources];
    }
    if ((starActions && starActions.length > 0) || (starResources && starResources.length > 0)) {
      throw new this.serverless.classes.Error(`Actions or resources contain *`);
    }
  }

  log(message: string) {
    this.serverless.cli.log(message);
  }

  logDebugObject(message: any) {
    if (process.env.SLS_DEBUG) {
      this.serverless.cli.log(JSON.stringify(message));
    }
  }
}

export = IamChecker;
