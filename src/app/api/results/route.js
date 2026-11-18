import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const adminKey = searchParams.get('secret');

        // Check if the votes can be shown
        const isPublicView = process.env.SHOW_RESULTS === 'true';
        const isAdmin = adminKey && adminKey === process.env.ADMIN_SECRET;
        const canViewCandidateVotes = isPublicView || isAdmin;

        // Get data from FPT for counting the voters
        const allDpt = await db.orm.public.Dpt.all();
        const totalDpt = allDpt.length;
        const totalVoted = allDpt.filter((voter) => voter.hasVoted).length;
        const turnoutPercentage = totalDpt > 0 ? ((totalVoted / totalDpt) * 100).toFixed(2) : 0;

        // Participants statistics for every batch
        const turnoutByBatch = {};
        for (const voter of allDpt) {
            if (!turnoutByBatch[voter.batch]) {
                turnoutByBatch[voter.batch] = { total: 0, voted: 0 };
            }

            turnoutByBatch[voter.batch].total += 1;
            if (voter.hasVoted) {
                turnoutByBatch[voter.batch].voted += 1;
            }
        }

        const batchStats = Object.keys(turnoutByBatch)
            .sort()
            .map((batch) => {
                const { total, voted } = turnoutByBatch[batch];
                return {
                    batch,
                    totalDpt: total,
                    totalVoted: voted,
                    percentage: total > 0 ? ((voted / total) * 100).toFixed(2) : 0
                };
            });

        // Get all candidate and their votes
        const candidates = await db.orm.public.Candidate.all();
        const votes = await db.orm.public.Vote.all();
        const totalVotesCast = votes.length;

        // Count votes for each candidate
        let resultsByCategory = {};

        if (canViewCandidateVotes) {
            // Group candidates by category
            for (const candidate of candidates) {
                if (!resultsByCategory[candidate.category]) {
                    resultsByCategory[candidate.category] = {
                        category: candidate.category,
                        totalCategoryVotes: 0,
                        candidates: [],
                    };
                }

                // Count votes for this candidate
                const candidateVotes = votes.filter((v) => v.candidateId === candidate.id).length;
                resultsByCategory[candidate.category].totalCategoryVotes += candidateVotes;

                resultsByCategory[candidate.category].candidates.push({
                    id: candidate.id,
                    orderNumber: candidate.orderNumber,
                    candidateName: candidate.candidateName,
                    voteCount: candidateVotes,
                });
            }

            // Count percentage for each candidate
            for (const category in resultsByCategory) {
                const group = resultsByCategory[category];
                group.candidates.sort((a, b) => a.orderNumber - b.orderNumber);

                group.candidates = group.candidates.map((cand) => ({
                    ...cand,
                    percentage:
                        group.totalCategoryVotes > 0
                            ? ((cand.voteCount / group.totalCategoryVotes) * 100).toFixed(2) : 0,
                }));
            }
        }

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            visibility: canViewCandidateVotes ? 'PUBLIC' : 'RESTRICTED_TO_TURNOUT_ONLY',
            turnout: {
                totalDpt,
                totalVoted,
                turnoutPercentage: `${turnoutPercentage}%`,
                byBatch: batchStats,
            },
            results: canViewCandidateVotes
                ? Object.values(resultsByCategory)
                : 'Hasil perolehan suara belum dipublikasikan. Pantau setelah penutupan bilik suara.',
        });
    } catch (error) {
        console.error('Results Error:', error);
        return NextResponse.json(
            { error: 'Gagal merekapitulasi hasil suara.', detail: error.message },
            { status: 500 }
        );
    }
}