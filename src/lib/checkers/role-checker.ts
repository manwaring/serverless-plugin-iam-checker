import { Config, ActionConfig, ResourceConfig } from '../config';
import { Role } from '../cloudformation';
import { BasicChecker } from './basic-checker';

export class RoleChecker {
  constructor(config: Config, role: Role) {
    const { actions, resources } = role.getResourcesAndActions();
    this.actionsChecker = new ActionsChecker(actions, config.actions);
    this.resourcesChecker = new ResourcesChecker(resources, config.resources);
    this.role = role;
    this.config = config;
  }
  actionsChecker: ActionsChecker;
  resourcesChecker: ResourcesChecker;
  role: Role;
  config: Config;

  validate(): { role: Role; config: Config; isValid: boolean; validationMessages: string[] } {
    const actionValidation = this.actionsChecker.validate();
    const resourceValidation = this.resourcesChecker.validate();
    return {
      role: this.role,
      config: this.config,
      isValid: actionValidation.isValid && resourceValidation.isValid,
      validationMessages: [...actionValidation.validationMessages, ...resourceValidation.validationMessages]
    };
  }
}

class ActionsChecker extends BasicChecker {
  constructor(actions: string[], config: ActionConfig) {
    super();
    this.actions = actions;
    this.config = config;
  }

  actions: string[] = [];
  config: ActionConfig;

  validate(): { isValid: boolean; validationMessages: string[] } {
    let isValid = true;
    const validationMessages: string[] = [];
    if (!this.config.allowWildcardOnly && this.hasPropertiesWithWildcardOnly(this.actions)) {
      isValid = false;
      validationMessages.push(`Wildcard-only actions are not allowed`);
    }
    if (!this.config.allowWildcards && this.hasPropertiesWithWildcard(this.actions)) {
      isValid = false;
      validationMessages.push(`Wildcards in actions are not allowed`);
    }
    if (
      this.config.allowedPatterns.length > 0 &&
      !this.propertyPatternsMatchAllowed(this.actions, this.config.allowedPatterns)
    ) {
      isValid = false;
      validationMessages.push(`Actions must match the following patterns: ${this.config.allowedPatterns}`);
    }
    return { isValid, validationMessages };
  }
}

class ResourcesChecker extends BasicChecker {
  constructor(resources: any[], config: ResourceConfig) {
    super();
    this.resources = resources;
    this.config = config;
  }

  resources: any[] = [];
  config: ResourceConfig;

  validate(): { isValid: boolean; validationMessages: string[] } {
    let isValid = true;
    const validationMessages: string[] = [];
    if (!this.config.allowWildcardOnly && this.hasPropertiesWithWildcardOnly(this.resources)) {
      isValid = false;
      validationMessages.push(`Wildcard-only resources are not allowed`);
    }
    if (!this.config.allowWildcards && this.hasPropertiesWithWildcard(this.resources)) {
      isValid = false;
      validationMessages.push(`Wildcards in resources are not allowed`);
    }
    if (
      this.config.allowedPatterns.length > 0 &&
      !this.propertyPatternsMatchAllowed(this.resources, this.config.allowedPatterns)
    ) {
      isValid = false;
      validationMessages.push(`Resources must match the following patterns: ${this.config.allowedPatterns}`);
    }
    if (
      this.config.allowedReferences.length > 0 &&
      !this.propertyReferencesMatchAllowed(this.resources, this.config.allowedReferences)
    ) {
      isValid = false;
      validationMessages.push(`Resources must match the following references: ${this.config.allowedReferences}`);
    }
    return { isValid, validationMessages };
  }

  propertyReferencesMatchAllowed(properties: any[], allowedReferences: string[]): boolean {
    return (
      properties.filter(
        property => this.isPropertyObject(property) && !this.doesPropertyReferenceMatch(property, allowedReferences)
      ).length === 0
    );
  }

  doesPropertyReferenceMatch(property: any, allowedReferences: string[]): boolean {
    const key = Object.keys(property)[0];
    return allowedReferences.find(reference => key.indexOf(reference) > -1) !== undefined;
  }
}
