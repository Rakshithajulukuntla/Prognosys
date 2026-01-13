const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// 1. FIX: Handle BigInt (The likely cause of your crash)
BigInt.prototype.toJSON = function () { return this.toString() }

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`Attempting login for: ${email}`); // Log attempt

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ error: 'Invalid credentials (User not found)' });
        }

        // Check password
        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
            console.log("Password mismatch");
            return res.status(401).json({ error: 'Invalid credentials (Password mismatch)' });
        }

        console.log("Login successful!");

        // Remove password from response
        const { passwordHash, ...userWithoutPassword } = user;

        res.json({
            message: 'Login successful',
            user: userWithoutPassword
        });

    } catch (error) {
        // 2. DEBUG: Print the actual error to the terminal
        console.error("CRITICAL LOGIN ERROR:", error);

        // 3. DEBUG: Send the error detail to PowerShell so you can see it
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});