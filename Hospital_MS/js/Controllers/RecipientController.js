const db = require('./db');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const handleError = (res, message, statusCode = 500) => {
    res.status(statusCode).send(message);
};

const recipientValidationRules = [
    body('R_name').notEmpty().withMessage('Name is required').isLength({ min: 3 }),
    body('R_age').isInt({ min: 0 }).withMessage('Age must be a valid number'),
    body('R_password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('Test_fees').isFloat({ min: 0 }).withMessage('Test fees must be a valid number'),
    body('R_gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
    body('R_email').isEmail().withMessage('Invalid email format')
];

const createRecipient = async (req, res) => {
    await recipientValidationRules(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { R_name, R_age, R_password, Test_fees, R_gender, R_email } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(R_password, 10); // No salt rounds
            const sql = `INSERT INTO Recipient (R_name, R_age, R_password, Test_fees, R_gender, R_email)
                         VALUES (?, ?, ?, ?, ?, ?)`;
            db.query(sql, [R_name, R_age, hashedPassword, Test_fees, R_gender, R_email], (err) => {
                if (err) return handleError(res, 'Error saving recipient.');
                res.status(201).send('Recipient added successfully!');
            });
        } catch {
            handleError(res, 'Error processing request.');
        }
    });
};

const getRecipients = (req, res) => {
    const sql = 'SELECT id, R_name, R_age, Test_fees, R_gender, R_email FROM Recipient';
    db.query(sql, (err, results) => {
        if (err) return handleError(res, 'Error fetching recipients.');
        res.json(results);
    });
};

const getRecipientById = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT id, R_name, R_age, Test_fees, R_gender, R_email FROM Recipient WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return handleError(res, 'Error fetching recipient.');
        if (result.length === 0) return res.status(404).send('Recipient not found.');
        res.json(result[0]);
    });
};

const updateRecipient = async (req, res) => {
    const { id } = req.params;
    await recipientValidationRules(req, res, async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { R_name, R_age, R_password, Test_fees, R_gender, R_email } = req.body;
        try {
            const updateValues = [R_name, R_age, Test_fees, R_gender, R_email, id];
            let sql = `UPDATE Recipient SET R_name = ?, R_age = ?, Test_fees = ?, R_gender = ?, R_email = ? WHERE id = ?`;

            if (R_password) {
                const hashedPassword = await bcrypt.hash(R_password, 10); // No salt rounds
                sql = `UPDATE Recipient SET R_name = ?, R_age = ?, R_password = ?, Test_fees = ?, R_gender = ?, R_email = ? WHERE id = ?`;
                updateValues.splice(2, 0, hashedPassword);
            }

            db.query(sql, updateValues, (err) => {
                if (err) return handleError(res, 'Error updating recipient.');
                res.send('Recipient updated successfully!');
            });
        } catch {
            handleError(res, 'Error processing request.');
        }
    });
};

const deleteRecipient = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Recipient WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) return handleError(res, 'Error deleting recipient.');
        res.send('Recipient deleted successfully!');
    });
};

const loginRecipient = (req, res) => {
    const { R_email, R_password } = req.body;

    if (!R_email || !R_password) {
        return res.status(400).send("Invalid Email or Password");
    }

    const sql = "SELECT * FROM Recipient WHERE R_email = ?";
    db.query(sql, [R_email], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).send("Invalid Email or Password");
        }

        const isMatch = await bcrypt.compare(R_password, results[0].R_password);
        if (!isMatch) {
            return res.status(404).send("Invalid Email or Password");
        }

        // Store user ID and data in session
        req.session.user = {
            id: results[0].id,
            name: results[0].R_name,
            age: results[0].R_age,
            gender: results[0].R_gender,
            email: results[0].R_email,
            mobile: results[0].R_mobile,
            test_fees: results[0].Test_fees
        };

        res.redirect('/dashboard'); // Redirect to the dashboard
    });
};


module.exports = {
    createRecipient,
    getRecipients,
    getRecipientById,
    updateRecipient,
    deleteRecipient,
    loginRecipient
};
