import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware to check validation results
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array() 
    });
  }
  
  next();
};

/**
 * Validation rules for profiles
 */
export const profileValidation = {
  update: [
    body('full_name')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('bio')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Bio must not exceed 500 characters'),
    body('top_genres')
      .optional()
      .isArray()
      .withMessage('Top genres must be an array'),
    body('top_artists')
      .optional()
      .isArray()
      .withMessage('Top artists must be an array'),
    validate,
  ],
};

/**
 * Validation rules for matches
 */
export const matchValidation = {
  create: [
    body('user2_id')
      .notEmpty()
      .isUUID()
      .withMessage('Valid user2_id is required'),
    validate,
  ],
  updateStatus: [
    param('matchId')
      .isUUID()
      .withMessage('Valid match ID is required'),
    body('status')
      .isIn(['pending', 'accepted', 'rejected'])
      .withMessage('Status must be pending, accepted, or rejected'),
    validate,
  ],
};

/**
 * Validation rules for messages
 */
export const messageValidation = {
  create: [
    body('match_id')
      .notEmpty()
      .isUUID()
      .withMessage('Valid match_id is required'),
    body('content')
      .notEmpty()
      .isString()
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message content must be between 1 and 1000 characters'),
    validate,
  ],
};

/**
 * Validation rules for pagination
 */
export const paginationValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  validate,
];
