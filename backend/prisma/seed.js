
/*
 * Seeds demo claims that are ready for evidence.
 *
 * Idempotent:
 * - Uses fixed IDs
 * - Uses upsert
 * - Safe to run multiple times
 */
require('dotenv/config');

const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});
const claims = [
    {
        id: '11111111-1111-4111-8111-111111111111',

        productId: 'PRD-REVITALIFT-001',
        productName: 'Revitalift Night Serum (demo)',
        formulaVersion: 'F-2026-03',

        text: 'Reduces wrinkles by 20% in 4 weeks',
        type: 'EFFICACY_QUANTIFIED',

        markets: ['FR', 'DE', 'US'],

        metric: 'wrinkle depth',
        targetValue: 20,
        unit: '%',

        timeframeDays: 28,
        timeframeKind: 'WITHIN',
    },

    {
        id: '22222222-2222-4222-8222-222222222222',

        productId: 'PRD-HYDRA-002',
        productName: 'Hydra Genius Gel (demo)',
        formulaVersion: 'F-2026-01',

        text: 'Hydrates skin for 24 hours',
        type: 'EFFICACY_QUALITATIVE',

        markets: ['FR', 'IN'],

        metric: 'skin hydration (corneometry)',
        targetValue: null,
        unit: null,

        timeframeDays: 1,
        timeframeKind: 'LASTS',
    },

    {
        id: '33333333-3333-4333-8333-333333333333',

        productId: 'PRD-REVITALIFT-001',
        productName: 'Revitalift Night Serum (demo)',
        formulaVersion: 'F-2026-03',

        text: '9 out of 10 women say their skin feels smoother',
        type: 'CONSUMER_PERCEPTION',

        markets: ['FR', 'GB'],

        metric: 'self-assessed smoothness',
        targetValue: 90,
        unit: '%',

        timeframeDays: null,
        timeframeKind: null,
    },
];

async function main() {
    for (const claim of claims) {
        await prisma.claim.upsert({
            where: {
                id: claim.id,
            },

            update: {
                // Keep seed idempotent.
                // Existing records are not overwritten.
            },

            create: {
                ...claim,

                status: 'AWAITING_EVIDENCE',
                proposedById: 'demo-business-user',
            },
        });
    }

    console.log(`Seeded ${claims.length} demo claims`);
}

main()
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
