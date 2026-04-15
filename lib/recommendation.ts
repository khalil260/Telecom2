import { getClientConsumptionData } from "@/lib/data-source";
import type {
  ClientConsumptionRecord,
  RankedOffer,
  RecommendationModelOverviewResponse,
  RecommendationResponse,
} from "@/lib/types";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const round = (value: number): number => Number(value.toFixed(2));

const MODEL_VERSION = "tt-reco-v2.1";

interface FeatureVector {
  dataIntensity: number;
  voiceIntensity: number;
  smsIntensity: number;
  rechargeIntensity: number;
  rechargeFrequency: number;
  arpuLevel: number;
  budgetSensitivity: number;
  mixedBalance: number;
  weekendRatio: number;
  incomingActivity: number;
}

interface OfferCandidate {
  offer: string;
  rationale: string;
  score: (vector: FeatureVector) => number;
}

const OFFER_CANDIDATES: ReadonlyArray<OfferCandidate> = [
  {
    offer: "Forfait Internet 25 Go",
    rationale: "Priorite donnees elevee avec recharge et ARPU soutenus.",
    score: (vector) =>
      clamp(
        0.47 * vector.dataIntensity +
          0.2 * vector.arpuLevel +
          0.15 * vector.rechargeIntensity +
          0.1 * (1 - vector.budgetSensitivity) +
          0.08 * vector.weekendRatio,
        0,
        1,
      ),
  },
  {
    offer: "Forfait Internet 10 Go",
    rationale: "Profil data standard avec usage regulier et equilibre budgetaire.",
    score: (vector) =>
      clamp(
        0.36 * vector.dataIntensity +
          0.19 * vector.mixedBalance +
          0.17 * vector.rechargeFrequency +
          0.16 * (1 - vector.budgetSensitivity) +
          0.12 * vector.incomingActivity,
        0,
        1,
      ),
  },
  {
    offer: "Forfait Voix Plus",
    rationale: "Usage communication (voix/SMS) dominant sur le profil data.",
    score: (vector) =>
      clamp(
        0.43 * vector.voiceIntensity +
          0.24 * vector.smsIntensity +
          0.14 * vector.rechargeIntensity +
          0.11 * vector.incomingActivity +
          0.08 * (1 - vector.dataIntensity),
        0,
        1,
      ),
  },
  {
    offer: "Forfait Mixte S",
    rationale: "Profil sensible au budget avec besoin mixte voix/data.",
    score: (vector) =>
      clamp(
        0.38 * vector.budgetSensitivity +
          0.2 * vector.mixedBalance +
          0.16 * (1 - vector.arpuLevel) +
          0.15 * vector.voiceIntensity +
          0.11 * vector.dataIntensity,
        0,
        1,
      ),
  },
];

function buildFeatureVector(row: ClientConsumptionRecord): FeatureVector {
  const dataIntensity = clamp(row.totalSessionVolumeMb / 12000, 0, 1);
  const voiceIntensity = clamp(row.callDurationTotalMin / 1800, 0, 1);
  const smsIntensity = clamp(row.smsTotal / 500, 0, 1);
  const rechargeIntensity = clamp(row.amountRecharge / 120, 0, 1);
  const rechargeFrequency = clamp(row.nbRecharge / 6, 0, 1);
  const arpuLevel = clamp(row.arpu / 140, 0, 1);
  const budgetSensitivity = clamp(1 - arpuLevel, 0, 1);
  const mixedBalance = clamp(1 - Math.abs(dataIntensity - voiceIntensity), 0, 1);
  const weekendRatio = clamp(
    row.weekendDataMb / Math.max(1, row.totalSessionVolumeMb),
    0,
    1,
  );
  const incomingActivity = clamp(row.incomingActivityDays / 31, 0, 1);

  return {
    dataIntensity,
    voiceIntensity,
    smsIntensity,
    rechargeIntensity,
    rechargeFrequency,
    arpuLevel,
    budgetSensitivity,
    mixedBalance,
    weekendRatio,
    incomingActivity,
  };
}

function scoreOffers(vector: FeatureVector): RankedOffer[] {
  return OFFER_CANDIDATES.map((candidate) => ({
    offer: candidate.offer,
    score: round(clamp(candidate.score(vector), 0, 1) * 100),
    rationale: candidate.rationale,
  })).sort((left, right) => right.score - left.score);
}

function buildReasons(
  row: ClientConsumptionRecord,
  predicted: RankedOffer,
): string[] {
  const reasons = [predicted.rationale];

  if (row.totalSessionVolumeMb >= 9000) {
    reasons.push("Le volume de data mensuel est eleve, compatible avec une offre internet superieure.");
  }

  if (row.callDurationTotalMin >= 950 || row.smsTotal >= 180) {
    reasons.push("Le niveau de communication voix/SMS renforce la pertinence d'une offre orientee usage.");
  }

  if (row.arpu < 35 || row.amountRecharge < 20) {
    reasons.push("Le profil de depense reste prudent, ce qui favorise un positionnement budgetaire.");
  }

  if (reasons.length === 1) {
    reasons.push("Le moteur donne un classement coherent avec l'equilibre usage/recharge observe.");
  }

  return reasons;
}

function buildConfidence(rankedOffers: RankedOffer[]): number {
  const best = rankedOffers[0]?.score ?? 0;
  const second = rankedOffers[1]?.score ?? best;
  const margin = clamp((best - second) / 30, 0, 1);

  return round(clamp(best * 0.78 + margin * 22, 35, 97));
}

function buildRecommendationCore(row: ClientConsumptionRecord): {
  predictedOffer: string;
  confidence: number;
  rankedOffers: RankedOffer[];
  reasons: string[];
  features: RecommendationResponse["features"];
} {
  const vector = buildFeatureVector(row);
  const rankedOffers = scoreOffers(vector).slice(0, 3);
  const predicted = rankedOffers[0];

  return {
    predictedOffer: predicted.offer,
    confidence: buildConfidence(rankedOffers),
    rankedOffers,
    reasons: buildReasons(row, predicted),
    features: {
      arpu: round(row.arpu),
      sessionVolumeMb: round(row.totalSessionVolumeMb),
      callDurationMin: round(row.callDurationTotalMin),
      smsTotal: row.smsTotal,
      amountRecharge: round(row.amountRecharge),
    },
  };
}

function latestRowsByClient(
  rows: ClientConsumptionRecord[],
): ClientConsumptionRecord[] {
  const latestByClient = new Map<string, ClientConsumptionRecord>();

  rows.forEach((row) => {
    const current = latestByClient.get(row.clientId);
    if (!current || row.month > current.month) {
      latestByClient.set(row.clientId, row);
    }
  });

  return [...latestByClient.values()];
}

export async function getRecommendationForClient(
  clientId: string,
): Promise<RecommendationResponse | null> {
  const rows = (await getClientConsumptionData())
    .filter((row) => row.clientId === clientId)
    .sort((a, b) => a.month.localeCompare(b.month));

  if (rows.length === 0) {
    return null;
  }

  const latest = rows[rows.length - 1];
  const core = buildRecommendationCore(latest);

  return {
    clientId,
    month: latest.month,
    currentOfferType: latest.offerType,
    predictedOffer: core.predictedOffer,
    confidence: core.confidence,
    modelVersion: MODEL_VERSION,
    rankedOffers: core.rankedOffers,
    reasons: core.reasons,
    features: core.features,
    targetOfferFromDataset: latest.targetOffer,
    matchesTargetOffer: core.predictedOffer === latest.targetOffer,
  };
}

export async function getRecommendationModelOverview(): Promise<RecommendationModelOverviewResponse> {
  const rows = await getClientConsumptionData();
  const latestRows = latestRowsByClient(rows);

  if (latestRows.length === 0) {
    return {
      modelVersion: MODEL_VERSION,
      evaluatedClients: 0,
      exactMatchRate: 0,
      averageConfidence: 0,
      highConfidenceRate: 0,
      topPredictedOffers: [],
    };
  }

  const evaluations = latestRows.map((row) => ({
    target: row.targetOffer,
    ...buildRecommendationCore(row),
  }));

  const exactMatchCount = evaluations.filter(
    (evaluation) => evaluation.predictedOffer === evaluation.target,
  ).length;

  const averageConfidence = round(
    evaluations.reduce((sum, evaluation) => sum + evaluation.confidence, 0) /
      evaluations.length,
  );

  const highConfidenceRate = round(
    (evaluations.filter((evaluation) => evaluation.confidence >= 75).length /
      evaluations.length) *
      100,
  );

  const predictedMap = new Map<string, number>();
  evaluations.forEach((evaluation) => {
    predictedMap.set(
      evaluation.predictedOffer,
      (predictedMap.get(evaluation.predictedOffer) ?? 0) + 1,
    );
  });

  const topPredictedOffers = [...predictedMap.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([offer, count]) => ({
      offer,
      count,
      sharePercent: round((count / evaluations.length) * 100),
    }));

  return {
    modelVersion: MODEL_VERSION,
    evaluatedClients: evaluations.length,
    exactMatchRate: round((exactMatchCount / evaluations.length) * 100),
    averageConfidence,
    highConfidenceRate,
    topPredictedOffers,
  };
}
