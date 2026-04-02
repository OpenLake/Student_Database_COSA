class HttpError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {any} [details]
   */
  constructor(statusCode, message, details) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

module.exports = { HttpError };

