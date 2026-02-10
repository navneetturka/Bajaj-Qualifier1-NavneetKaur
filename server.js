require('dotenv').config();

console.log("ENV CHECK:", {
  GEMINI: process.env.GEMINI_API_KEY ? "LOADED" : "MISSING",
  EMAIL: process.env.OFFICIAL_EMAIL
});

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || "your.email@chitkara.edu.in";

let genAI = null;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;

    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

function gcd(a, b) {
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

app.post('/bfhl', async (req, res) => {
    try {
        const body = req.body;
        const keys = Object.keys(body);

        if (keys.length !== 1) {
            return res.status(400).json({
                is_success: false,
                official_email: OFFICIAL_EMAIL,
                error: "Request must contain exactly one key: fibonacci, prime, lcm, hcf, or AI"
            });
        }

        const key = keys[0];
        let result;

        switch (key) {
            case 'fibonacci': {
                const fibInput = body.fibonacci;
                if (typeof fibInput !== 'number' || !Number.isInteger(fibInput) || fibInput < 0) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: OFFICIAL_EMAIL,
                        error: "fibonacci must be a non-negative integer"
                    });
                }

                const fibSeries = [];
                if (fibInput === 0) {
                    fibSeries.push(0);
                } else if (fibInput === 1) {
                    fibSeries.push(0, 1);
                } else {
                    fibSeries.push(0, 1);
                    for (let i = 2; i < fibInput; i++) {
                        fibSeries.push(fibSeries[i - 1] + fibSeries[i - 2]);
                    }
                }
                result = fibSeries;
                break;
            }

            case 'prime': {
                const primeInput = body.prime;
                if (!Array.isArray(primeInput)) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: OFFICIAL_EMAIL,
                        error: "prime must be an array of integers"
                    });
                }

                if (!primeInput.every(num => Number.isInteger(num))) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: OFFICIAL_EMAIL,
                        error: "All elements in prime array must be integers"
                    });
                }

                result = primeInput.filter(num => isPrime(num));
                break;
            }

            case 'lcm': {
                const lcmInput = body.lcm;
                if (!Array.isArray(lcmInput) || lcmInput.length < 2) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: OFFICIAL_EMAIL,
                        error: "lcm must be an array with at least 2 integers"
                    });
                }

                if (!lcmInput.every(num => Number.isInteger(num) && num > 0)) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: OFFICIAL_EMAIL,
                        error: "All elements in lcm array must be positive integers"
                    });
                }

                let lcmResult = lcmInput[0];
                for (let i = 1; i < lcmInput.length; i++) {
                    lcmResult = lcm(lcmResult, lcmInput[i]);
                }
                result = lcmResult;
                break;
            }

            case 'hcf': {
                const hcfInput = body.hcf;
                if (!Array.isArray(hcfInput) || hcfInput.length < 2) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: OFFICIAL_EMAIL,
                        error: "hcf must be an array with at least 2 integers"
                    });
                }

                if (!hcfInput.every(num => Number.isInteger(num) && num > 0)) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: OFFICIAL_EMAIL,
                        error: "All elements in hcf array must be positive integers"
                    });
                }

                let hcfResult = hcfInput[0];
                for (let i = 1; i < hcfInput.length; i++) {
                    hcfResult = gcd(hcfResult, hcfInput[i]);
                }
                result = hcfResult;
                break;
            }

            case 'AI': {
                const aiInput = body.AI;

                if (typeof aiInput !== 'string' || aiInput.trim().length === 0) {
                    return res.status(400).json({
                        is_success: false,
                        official_email: OFFICIAL_EMAIL,
                        error: "AI must be a non-empty string"
                    });
                }

                if (!genAI) {
                    return res.status(500).json({
                        is_success: false,
                        official_email: OFFICIAL_EMAIL,
                        error: "AI service not configured"
                    });
                }

                try {
                    const model = genAI.getGenerativeModel({
                        model: "models/gemini-2.5-flash"
                    });

                    const prompt = `Answer the following question in exactly one single word: ${aiInput}`;
                    const aiResponse = await model.generateContent(prompt);
                    const text = aiResponse.response.text().trim();
                    result = text.split(/\s+/)[0].replace(/[^\w]/g, '');
                } catch (err) {
                    return res.status(500).json({
                        is_success: false,
                        official_email: OFFICIAL_EMAIL,
                        error: "Failed to get AI response: " + err.message
                    });
                }
                break;
            }

            default:
                return res.status(400).json({
                    is_success: false,
                    official_email: OFFICIAL_EMAIL,
                    error: `Invalid key: ${key}. Must be one of: fibonacci, prime, lcm, hcf, AI`
                });
        }

        return res.status(200).json({
            is_success: true,
            official_email: OFFICIAL_EMAIL,
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: "Internal server error: " + error.message
        });
    }
});

app.get('/health', (req, res) => {
    try {
        return res.status(200).json({
            is_success: true,
            official_email: OFFICIAL_EMAIL
        });
    } catch (error) {
        return res.status(500).json({
            is_success: false,
            official_email: OFFICIAL_EMAIL,
            error: "Health check failed"
        });
    }
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Bajaj Health API is running",
        endpoints: {
            "POST /bfhl": "Main endpoint for fibonacci, prime, lcm, hcf, and AI operations",
            "GET /health": "Health check endpoint"
        }
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        error: "Internal server error: " + err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;