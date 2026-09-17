import rateLimit from 'express-rate-limit';

// Rate limiter for payment creation (max 30 requests per minute per IP)
export const paymentCreateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    message: 'Too many payment creation requests. Please try again in a moment.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for status check polling (max 120 polling requests per minute per IP)
export const paymentStatusLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: {
    success: false,
    message: 'Too many status check requests. Please slow down polling.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});