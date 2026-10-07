export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.response?.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`❌ [error] [${req.method} ${req.originalUrl}]:`, message);

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
