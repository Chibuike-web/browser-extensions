/**
 * @typedef {Object} GeminiAPIResponse
 * @property {{ src: string, alt: string }[]} altText
 */

/**
 * @typedef {Object} GeminiAPIError
 * @property {string} error
 * @property {string} [details]
 */

/**
 * @typedef {Object} GeminiAPIStatus
 * @property {{  status: string }} altText
 */

/**
 * @callback SendResponse
 * @param {GeminiAPIResponse | GeminiAPIError | { success: true, data: GeminiAPIResponse['altText'] } | GeminiAPIStatus} response
 * @returns {void}
 */
