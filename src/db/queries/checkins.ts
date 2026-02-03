import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import {
    keyResultCheckIn,
    checkInEvidence,
    keyResult,
    objective,
} from "@/db/schema/okr";
import {
    checkin,
    evidence,
} from "@/db/schema/okr-related";
import { owner } from "@/db/schema/core";

export async function getAllCheckIns() {
    // 1. Fetch Objective/Entity Check-ins
    const entityCheckins = await db.query.checkin.findMany({
        with: {
            owner: true,
        },
        orderBy: [desc(checkin.checkinDate)],
    });

    // 2. Fetch Key Result Check-ins
    const krCheckins = await db.query.keyResultCheckIn.findMany({
        with: {
            keyResult: {
                with: {
                    objective: true,
                },
            },
            evidence: true,
        },
        orderBy: [desc(keyResultCheckIn.createdAt)],
    });

    return {
        entityCheckins,
        krCheckins,
    };
}

export async function getAllEvidence() {
    // 1. Fetch Objective/Entity Evidence
    const entityEvidence = await db.query.evidence.findMany({
        with: {
            uploadedByOwner: true,
        },
        orderBy: [desc(evidence.createdAt)],
    });

    // 2. Fetch Check-in Evidence (via KeyResultCheckIn)
    // We need to fetch evidence and join with checkin -> KR -> Objective to get context
    const checkInEvidences = await db.query.checkInEvidence.findMany({
        with: {
            checkIn: {
                with: {
                    keyResult: {
                        with: {
                            objective: true,
                        },
                    },
                },
            },
        },
        orderBy: [desc(checkInEvidence.createdAt)],
    });

    return {
        entityEvidence,
        checkInEvidences,
    };
}
