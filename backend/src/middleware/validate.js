// middleware/validate.js
const { z } = require("zod");
const { ValidationError } = require("../errors");

/** validate("body" | "params" | "query", schema) -> req.valid[source] */
const validate = (source, schema) => (req, _res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) return next(new ValidationError(z.treeifyError(result.error)));
    req.valid = { ...req.valid, [source]: result.data };
    next();
};

module.exports = { validate };