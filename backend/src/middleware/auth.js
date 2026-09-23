const allowedRoles = [
    "BUSINESS",
    "CLAIMS_MANAGER",
    "SCIENTIST",
    "EVALUATOR",
    "REGULATORY",
];

const auth = (req, res, next) => {
    const userId = req.headers["x-user-id"];
    const userRole = req.headers["x-user-role"];

    if (!userId || !userRole) {
        return res.status(401).json({
            message: "Missing identity headers",
        });
    }

    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
            message: "Role not allowed",
        });
    }

    req.user = {
        id: userId,
        role: userRole,
    };

    next();
};

module.exports = auth;