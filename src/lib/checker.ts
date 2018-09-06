import { Config } from './config';
import { Role } from './cloudformation';

export class Checker {
  constructor(config: Config) {
    this.config = config;
  }
  config: Config;

  isRoleValid(role: Role): boolean {
    const { actions, resources } = role.getResourcesAndActions();
    const actionsAndResources = [...actions, ...resources];
    console.log(`Properties to check: ${JSON.stringify(actionsAndResources)}`);
    let isValid = true;
    if (this.config.checkStarOnly) {
      isValid = isValid && this.hasNoStarOnlyProperties(actionsAndResources);
      console.log(`Is valid after no star check: ${isValid}`);
    }
    if (this.config.allowedPatterns.length > 0) {
      isValid = isValid && this.propertyPatternsMatchAllowed(resources);
      console.log(`Is valid after allowed patterns check: ${isValid}`);
    }
    if (this.config.allowedReferences.length > 0) {
      isValid = isValid && this.propertyReferencesMatchAllowed(resources);
      console.log(`Is valid after allowed references check: ${isValid}`);
    }
    return isValid;
  }

  hasNoStarOnlyProperties(properties: any[]): boolean {
    return (
      properties.filter(property => this.isPropertyString(property) && this.isPropertyStarOnly(<string>property))
        .length === 0
    );
  }

  propertyPatternsMatchAllowed(properties: any[]): boolean {
    return (
      properties.filter(property => this.isPropertyObject(property) && !this.doesPropertyPatternMatch(property))
        .length === 0
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

  doesPropertyPatternMatch(property: any): boolean {
    const key = Object.keys(property)[0];
    const value = property[key];
    return (
      this.isPropertyString(value) &&
      this.config.allowedPatterns.find(pattern => value.indexOf(pattern) > -1) !== undefined
    );
  }

  isPropertyStarOnly(property: string): boolean {
    return property.replace(/'/g, '').replace(/"/g, '') === '*';
  }

  isPropertyString(property: any): boolean {
    // @ts-ignore
    return (typeof property).toUpperCase() === 'STRING' || property instanceof String;
  }

  isPropertyObject(property: any): boolean {
    return property !== null && typeof property === 'object';
  }
}
