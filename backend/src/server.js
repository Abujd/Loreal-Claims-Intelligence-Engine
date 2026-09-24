const express = require("express");
require("dotenv").config();
const { config } = require("./config");
const claimRoutes = require("./routes/claim.routes");
const assessRoutes = require("./routes/assess.routes");
const { AppError } = require("./errors");
const { pingOllama } = require("./llm/ollama.client");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();

// Demo only: no auth, wide-open CORS so the Vite dev server can call the API directly.
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", async (req, res) => {
    try {
        await pingOllama();
        res.json({ status: "ok", ollama: "reachable" });
    } catch {
        res.status(503).json({ status: "degraded", ollama: "unreachable" });
    }
});

app.use("/api/claims", claimRoutes);
app.use("/api/assess", assessRoutes);

app.use((err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            code: err.code,
            details: err.details,
        });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});