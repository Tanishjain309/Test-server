import { check, validationResult } from 'express-validator';

export const validateUser = [
    check('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 20 })
        .withMessage('Name must be between 3 to 20 characters long'),
        
    check('email')
        .normalizeEmail()
        .isEmail()
        .withMessage('Email is invalid'),    
        
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 to 16 characters long'),
];

// Validation result middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    res.status(400).json({ success: false, error: errors.array() });
};
