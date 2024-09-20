const express = require('express');
const {
    createRecipient,
    getRecipients,
    getRecipientById,
    updateRecipient,
    deleteRecipient,
    loginRecipient,
    registerRecipient
} = require('./recipientController');

const router = express.Router();

// Create recipient
router.post('/recipient', createRecipient);

// Get all recipients
router.get('/recipients', getRecipients);

// Get recipient by ID
router.get('/recipient/:id', getRecipientById);

// Update recipient
router.put('/recipient/:id', updateRecipient);

// Delete recipient
router.delete('/recipient/:id', deleteRecipient);

// Register (create account)
router.post('/register', registerRecipient);

// Login
router.post('/login', loginRecipient);

module.exports = router;
