require('dotenv').config();
const express = require('express');
const { userModel } = require('./models');
const { Keypair } = require('@solana/web3.js');
const jwt = require('jsonwebtoken');
const { sendTxn } = require('./utils');
const cors = require('cors');
const corsOptions = {
    origin: ['http://localhost:5173',
        'https://cloudwallet_solana.netlify.app',
    ],
    methods: 'GET,POST', 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};




const app = express();
app.use(cors(corsOptions));
const JWT_SECRET = process.env.JWT_SEC
app.use(express.json());

app.post('/api/v1/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const keyPair = new Keypair();
    const publicKey = keyPair.publicKey.toString();
    const privateKey = JSON.stringify(Array.from(keyPair.secretKey));
    await userModel.create({
        username,
        password,
        email,
        publicKey,
        privateKey
    }).then(() => {
          console.log('User created successfully');
    }).catch((err) => {
        console.error('Error creating user:', err);
        res.status(500).json({
            message: 'Error creating user',
            error: err.message,
        });
        return;
    });
    res.json({
        message: keyPair.publicKey.toString(),
    });
}
);

app.post('/api/v1/signin', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await userModel.findOne({ username, password })

    if(user) {
        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET 
        );
        res.json({
            message: 'User signed in successfully',
            token,
            publicKey: user.publicKey,
        });
    }
    else {
        res.status(401).json({
            message: 'Invalid username or password',
        });
        return;
    }
    console.log('User signed in successfully');
}   
);



app.post('/api/v1/txn/sign', async (req, res) => {
    const { toAddress, amount } = req.body;
    if (!toAddress || !amount) {
        return res.status(400).json({
            message: 'Missing required fields',
        });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    const token = authHeader.split(' ')[1];
    let userId;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid token',
        });
    }
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        });
    }
    const privateKey = user.privateKey;
    const result = await sendTxn({
        privateKey,
        toAddress,
        amount
    });
    if (!result.success) {
        return res.status(500).json({
            message: 'Transaction failed',
            error: result.error,
        });
    }
    res.json({
        message: 'Transaction successful',
        signature: result.signature,
    });
});

app.get('/api/v1/user', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
    const token = authHeader.split(' ')[1];
    let userId;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid token',
        });
    }
    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: 'User not found',
        });
    }
    res.json({
        username: user.username,
        email: user.email,
        publicKey: user.publicKey,
    });
    console.log('User details fetched successfully');

} );



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
