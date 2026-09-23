const prisma = require("../prisma/prisma");

const createClaim = async (data) => {
    const claim = await prisma.claim.create({
        data: {
            productId: data.productId,
            productName: data.productName,
            formulaVersion: data.formulaVersion,
            text: data.text,
            type: data.type,
            markets: data.markets,
            metric: data.metric,
            targetValue: data.targetValue,
            unit: data.unit,
            timeframeDays: data.timeframeDays,
            timeframeKind: data.timeframeKind,
            status: data.status,
            proposedById: data.proposedById
        },
    });

    return claim;
};

const toClaimResponse = (claim) => ({
    id: claim.id,
    productName: claim.productName,
    claimText: claim.claimText,
    claimType: claim.claimType,
    market: claim.market,
    status: claim.status,
    createdAt: claim.createdAt,
});

const listClaims = async () => {
    const claims = await prisma.claim.findMany({
        orderBy: {
            createdAt: "asc",
        },
        include: {
            _count: {
                select: {
                    assessments: true,
                },
            },
        },
    });

    return claims.map((c) => ({
        ...toClaimResponse(c),
        assessmentCount: c._count.assessments,
    }));
};

module.exports = {
    createClaim,
    listClaims
};