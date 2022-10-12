// noinspection JSUnusedGlobalSymbols
const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

const Errors = {
  NOT_DECIMAL_NUMBER: {
    code: "doubleNumber.e001",
    message: "The value is not a valid decimal number.",
  },
  MAX_DIGIT_NUM_EXCEEDED: {
    code: "doubleNumber.e002",
    message: "The value exceeded maximum number of digits.",
  },
  MAX_DECIMAL_PLACES_EXCEEDED: {
    code: "doubleNumber.e003",
    message: "The value exceeded maximum number of decimal places.",
  },
};

const DEFAULT_MAX_DIGIT_NUM = 11;

/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param params - Matcher can take 0 to 2 parameters with following rules:
 * - no parameters: validates that number of digits does not exceed the maximum value of 11.
 * - one parameter: the parameter specifies maximum length of number for the above rule (parameter replaces the default value of 11)
 * - two parameters:
 *   -- first parameter represents the total maximum number of digits,
 *   -- the second parameter represents the maximum number of decimal places.
 *   -- both conditions must be met in this case.
 */
class DecimalNumberMatcher {
  constructor(...params) {
    this.params = params;
    this.validator = new ValidationResult();
  }

  match(value) {
    if (!value) return;

    const decimal = this._getValidDecimal(value);

    if (!decimal) return this.validator;

    if (this.params.length === 0) this._validateMaxDigitsCount(decimal);
    if (this.params.length === 1) this._validateMaxDigitsCount(decimal, this.params[0]);
    if (this.params.length === 2) {
      this._validateMaxDigitsCount(decimal, this.params[0]);
      this._validateMaxDecimalPlaces(decimal, this.params[1]);
    }

    return this.validator;
  }

  /**
   * Method validates the input value and returns a valid Decimal instance
   * @param {String} value match dtoIn value
   * @returns {Decimal|void}
   * @throws Errors.NOT_DECIMAL_NUMBER
   * @private
   */
  _getValidDecimal(value) {
    try {
      return new Decimal(value);
    } catch {
      this.validator.addInvalidTypeError(Errors.NOT_DECIMAL_NUMBER.code, Errors.NOT_DECIMAL_NUMBER.message);
    }
  }

  _validateMaxDigitsCount(decimal, maxDigitsNumber = DEFAULT_MAX_DIGIT_NUM) {
    if (decimal.precision(true) > maxDigitsNumber) {
      this.validator.addInvalidTypeError(Errors.MAX_DIGIT_NUM_EXCEEDED.code, Errors.MAX_DIGIT_NUM_EXCEEDED.message);
    }
  }

  _validateMaxDecimalPlaces(decimal, maxDecimalPlaces) {
    if (decimal.decimalPlaces() > maxDecimalPlaces) {
      this.validator.addInvalidTypeError(Errors.MAX_DECIMAL_PLACES_EXCEEDED.code, Errors.MAX_DECIMAL_PLACES_EXCEEDED.message);
    }
  }
}

module.exports = DecimalNumberMatcher;
