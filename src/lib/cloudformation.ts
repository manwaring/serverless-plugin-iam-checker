export class Resources {
  constructor(resource: Resource) {
    Object.keys(resource).forEach(key => {
      if (resource[key]) {
        this[key] = resource[key];
      }
    });
  }

  [key: string]: Resource | any;

  getIamRoles(): Role[] {
    return Object.keys(this)
      .filter(key => this[key].Type === 'AWS::IAM::Role')
      .map(key => new Role(this[key], key));
  }
}

interface Resource {
  Type: string;
  Properties: any;
}

export class Role implements Resource {
  constructor(role: Role, resourceName: string) {
    this.Type = role.Type;
    this.Properties = new RoleProperties(role.Properties);
    this.resourceName = resourceName;
  }
  Type: string;
  Properties: RoleProperties;
  resourceName: string;

  getResourcesAndActions(): { actions: any; resources: any } {
    const policies = this.Properties.Policies;
    const statements = policies
      .map(policy => policy.PolicyDocument.Statement)
      .reduce((statementArr1, statementArr2) => [...statementArr1, ...statementArr2]);
    const actions = statements
      .map(statement => statement.getAllActions())
      .reduce((statementArr1, statementArr2) => [...statementArr1, ...statementArr2]);
    const resources = statements
      .map(statement => statement.getAllResources())
      .reduce((statementArr1, statementArr2) => [...statementArr1, ...statementArr2]);
    return { actions, resources };
  }
}

class RoleProperties {
  constructor(roleProperties: RoleProperties) {
    this.AssumeRolePolicyDocument = new PolicyDocument(roleProperties.AssumeRolePolicyDocument);
    this.ManagedPolicyArns = roleProperties.ManagedPolicyArns;
    this.MaxSessionDuration = roleProperties.MaxSessionDuration;
    this.Path = roleProperties.Path;
    this.Policies = roleProperties.Policies.map(policy => new Policy(policy));
    this.RoleName = roleProperties.RoleName;
  }
  AssumeRolePolicyDocument: PolicyDocument;
  ManagedPolicyArns: any[];
  MaxSessionDuration: number;
  Path: any;
  Policies: Policy[];
  RoleName: any;
}

class Policy {
  constructor(policy: Policy) {
    this.PolicyDocument = new PolicyDocument(policy.PolicyDocument);
    this.PolicyName = policy.PolicyName;
  }
  PolicyDocument: PolicyDocument;
  PolicyName: any;
}

class PolicyDocument {
  constructor(policyDocument: PolicyDocument) {
    if (policyDocument) {
      this.Version = policyDocument.Version;
      this.Statement = policyDocument.Statement.map(statement => new Statement(statement));
    }
  }
  Version: string;
  Statement: Statement[];
}

class Statement {
  constructor(statement: Statement) {
    this.Effect = statement.Effect;
    this.Principal = statement.Principal;
    this.Action = statement.Action;
    this.Resource = statement.Resource;
  }
  Effect: string;
  Principal?: any;
  Action: any[] | any;
  Resource: any[] | any;

  getAllActions(): string[] {
    return this.propsToArray(this.Action);
  }

  getAllResources(): string[] {
    return this.propsToArray(this.Resource);
  }

  private propsToArray(props: any[] | any): any[] {
    if (Array.isArray(props)) {
      return props;
    } else {
      return [props];
    }
  }
}
