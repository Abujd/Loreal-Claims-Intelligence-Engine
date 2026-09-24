class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

class ValidationError extends AppError {
    constructor(details) {
        super('Invalid request', 400, 'VALIDATION_ERROR', details);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not found') {
        super(message, 404, 'NOT_FOUND');
    }
}

class LlmUnavailableError extends AppError {
    constructor(message = 'LLM service unavailable') {
        super(message, 503, 'LLM_UNAVAILABLE');
    }
}

class LlmOutputError extends AppError {
    constructor(message = 'LLM returned invalid output', details) {
        super(message, 502, 'LLM_INVALID_OUTPUT', details);
    }
}

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    LlmUnavailableError,
    LlmOutputError,
};