/**
 * Async Handler Wrapper
 * Wraps asynchronous route/controller functions to catch any rejected promises
 * and pass the error to Express's next() function, eliminating repetitive try-catch blocks.
 *
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = asyncHandler;
