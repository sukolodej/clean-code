"use strict";

/**
 * Object validation result
 */
class ValidationResult {
  constructor() {
    this.valid = true;
  }

  /**
   * Adds error that value is of invalid base type.
   * @param {String} code
   * @param {String} message
   */
  addInvalidTypeError(code, message) {
    this.valid = false;
    if (!this.invalidTypes) {
      this.invalidTypes = { [code]: message };
    } else {
      this.invalidTypes[code] = message;
    }
  }
}

module.exports = ValidationResult;
