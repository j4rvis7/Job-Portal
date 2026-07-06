/**
 * utils/asyncWrapper.js
 * Wraps async route handlers so we don't need try/catch in every controller.
 * Any error thrown inside the async function is automatically passed to next().
 */

const asyncWrapper = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = asyncWrapper;
