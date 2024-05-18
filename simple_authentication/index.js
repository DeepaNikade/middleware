import express from 'express';

const PORT = 4000;

const app = express();

const authenticationData = [];

// Logging middleware
const logger = (req, res, next) => {
    const start = Date.now();
    const { method, url } = req;
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${timestamp}] ${method} ${url} - ${duration}ms`);
    });

    next();
};

app.use(express.json());
app.use(logger);

function authorizationMiddleware(req, res, next) {
    const userExists = authenticationData.find(elem => req.body.email === elem.email && req.body.password === elem.password);
    if (userExists) {
        next();
    } else {
        res.status(401).json({
            error: "Invalid credentials"
        });
    }
}

app.post('/signUp', (req, res) => {
    authenticationData.push(req.body);
    res.status(201).json({
        message: "User is created successfully"
    });
});

app.get('/signIn', authorizationMiddleware, (req, res) => {
    res.status(200).json({
        message: "Signed in successfully"
    });
});

app.use('/*', (req, res) => {
    res.status(404).json({
        error: "Path is invalid, please check"
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
