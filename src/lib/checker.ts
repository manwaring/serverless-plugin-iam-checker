import { Config, ActionConfig, ResourceConfig } from './config';
import { Role } from './cloudformation';

export class Checker {
  constructor(config: Config) {
    this.config = config;
  }
  config: Config;

  isRoleValid(role: Role): boolean {
    const { actions, resources } = role.getResourcesAndActions();
    const actionChecker = new ActionsChecker(actions, this.config.actions);
    const resourceChecker = new ResourcesChecker(resources, this.config.resources);
    return actionChecker.isValid() && resourceChecker.isValid();
  }
}

class CheckerActions {
  constructor(config: ActionConfig | ResourceConfig) {
    this.config = config;
  }
  config: ActionConfig | ResourceConfig;

  hasNoPropertiesWithWildcardOnly(properties: any[]): boolean {
    return (
      properties.filter(property => this.propertyIsString(property) && this.propertyIsWildcardOnly(<string>property))
        .length === 0
    );
  }

  hasNoPropertiesWithWildcard(properties: any[]): boolean {
    return (
      properties.filter(property => this.propertyIsString(property) && this.propertyHasWildcard(<string>property))
        .length === 0
    );
  }

  propertyPatternsMatchAllowed(properties: any[]): boolean {
    return (
      properties.filter(property => this.isPropertyObject(property) && !this.doesPropertyPatternMatch(property))
        .length === 0
    );
  }

  doesPropertyPatternMatch(property: any): boolean {
    const key = Object.keys(property)[0];
    const value = property[key];
    return (
      this.propertyIsString(value) &&
      this.config.allowedPatterns.find(pattern => value.indexOf(pattern) > -1) !== undefined
    );
  }

  propertyHasWildcard(property: string): boolean {
    return property.indexOf('*') > -1;
  }

  propertyIsWildcardOnly(property: string): boolean {
    return property.replace(/'/g, '').replace(/"/g, '') === '*';
  }

  propertyIsString(property: any): boolean {
    // @ts-ignore
    return (typeof property).toUpperCase() === 'STRING' || property instanceof String;
  }

  isPropertyObject(property: any): boolean {
    return property !== null && typeof property === 'object';
  }
}

class ActionsChecker extends CheckerActions {
  constructor(actions: string[], config: ActionConfig) {
    super(config);
    this.actions = actions;
    this.config = config;
  }

  actions: string[] = [];
  config: ActionConfig;

  isValid(): boolean {
    let isValid = true;
    if (!this.config.allowWildcardOnly) {
      isValid = isValid && this.hasNoPropertiesWithWildcardOnly(this.actions);
    }
    if (!this.config.allowWildcards) {
      isValid = isValid && this.hasNoPropertiesWithWildcard(this.actions);
    }
    if (this.config.allowedPatterns.length > 0) {
      isValid = isValid && this.propertyPatternsMatchAllowed(this.actions);
    }
    return isValid;
  }
}

class ResourcesChecker extends CheckerActions {
  constructor(resources: any[], config: ResourceConfig) {
    super(config);
    this.resources = resources;
    this.config = config;
  }

  resources: any[] = [];
  config: ResourceConfig;

  isValid(): boolean {
    return (
      this.hasNoPropertiesWithWildcardOnly(this.resources) &&
      this.propertyPatternsMatchAllowed(this.resources) &&
      this.propertyReferencesMatchAllowed(this.resources)
    );
  }

  propertyReferencesMatchAllowed(properties: any[]): boolean {
    return (
      properties.filter(property => this.isPropertyObject(property) && !this.doesPropertyReferenceMatch(property))
        .length === 0
    );
  }

  doesPropertyReferenceMatch(property: any): boolean {
    const key = Object.keys(property)[0];
    return this.config.allowedReferences.find(reference => key.indexOf(reference) > -1) !== undefined;
  }
}
