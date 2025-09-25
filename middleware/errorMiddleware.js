// middleware/errorMiddleware.js
const errorHandler = (err, req, res, _next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    message: err.message || 'Error interno',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
module.exports = { errorHandler };
