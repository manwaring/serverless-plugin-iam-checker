export class BasicChecker {
  propertyPatternsMatchAllowed(properties: any[], allowedPatterns: string[]): boolean {
    return (
      properties.filter(
        property => this.isPropertyObject(property) && !this.doesPropertyPatternMatch(property, allowedPatterns)
      ).length === 0
    );
  }

  doesPropertyPatternMatch(property: any, allowedPatterns: string[]): boolean {
    const key = Object.keys(property)[0];
    const value = property[key];
    return this.propertyIsString(value) && allowedPatterns.find(pattern => value.indexOf(pattern) > -1) !== undefined;
  }

  hasPropertiesWithWildcardOnly(properties: any[]): boolean {
    return (
      properties.filter(property => this.propertyIsString(property) && this.propertyIsWildcardOnly(<string>property))
        .length > 0
    );
  }

  hasPropertiesWithWildcard(properties: any[]): boolean {
    return properties.filter(property => this.propertyHasWildcard(property)).length === 0;
  }

  propertyHasWildcard(property: any): boolean {
    return JSON.stringify(property).indexOf('*') > -1;
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
