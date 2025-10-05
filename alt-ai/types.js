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
 * @callback SendResponse
 * @param {GeminiAPIResponse | GeminiAPIError | { success: true, data: GeminiAPIResponse['altText'] }} response
 * @returns {void}
 */
