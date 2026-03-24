// Core layer uses only language primitives and domain types.
// No framework/runtime adapters are referenced from here.
export class BusinessRuleException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessRuleException";
  }
}

export class EntityNotFoundException extends Error {
  constructor(entityName: string, criteria?: string) {
    super(criteria ? `${entityName} not found by ${criteria}` : `${entityName} not found`);
    this.name = "EntityNotFoundException";
  }
}

export class UnauthorizedException extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedException";
  }
}
