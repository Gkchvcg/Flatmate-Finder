import mongoose from 'mongoose';
import User from '../src/models/User.js';
import { registerUser, loginUser } from '../src/controllers/authController.js';
import dotenv from 'dotenv';
dotenv.config();

// Mock req, res, next
const mockRes = () => {
    const res = {};
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (data) => { res.body = data; return res; };
    return res;
};

const mockNext = (err) => {
    if (err) console.error('Next called with error:', err.message);
};

async function testAuthFlow() {
    try {
        console.log('--- Starting Auth Flow Test ---');
        const connectionUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flatmate-finder';
        await mongoose.connect(connectionUri);
        console.log('Connected to DB');

        const testEmail = 'auth-test-' + Date.now() + '@example.com';
        const testPassword = 'Password123!';

        // 1. Register
        console.log('\nSTEP 1: Registration');
        const regReq = {
            body: {
                name: 'Auth Tester',
                email: testEmail,
                password: testPassword,
                phone: '1234567890'
            }
        };
        const regRes = mockRes();
        await registerUser(regReq, regRes, mockNext);
        
        if (regRes.statusCode === 201) {
            console.log('SUCCESS: Registration completed.');
        } else {
            console.error('FAILURE: Registration failed, status:', regRes.statusCode);
            return;
        }

        // 2. Login
        console.log('\nSTEP 2: Login');
        const loginReq = {
            body: {
                email: testEmail,
                password: testPassword
            }
        };
        const loginRes = mockRes();
        await loginUser(loginReq, loginRes, mockNext);

        if (loginRes.body && loginRes.body.token) {
            console.log('SUCCESS: Login successful, token received.');
        } else {
            console.error('FAILURE: Login failed, no token in response.');
        }

        // Cleanup
        await User.findOneAndDelete({ email: testEmail });
        console.log('\nCleanup: Test user deleted.');
        await mongoose.connection.close();
        console.log('DB Connection closed.');

    } catch (error) {
        console.error('Auth flow test error:', error);
        process.exit(1);
    }
}

testAuthFlow();
