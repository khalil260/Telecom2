export interface ClientConsumptionRecord {
  clientId: string;
  status: string;
  offerType: string;
  ancMonths: number;
  month: string;
  totalSessionVolumeMb: number;
  weekendDataMb: number;
  volume2gMb: number;
  volume3gMb: number;
  volume4gMb: number;
  nbCdr: number;
  nbCdrWeekend: number;
  callDurationTotalMin: number;
  callDurationOffnetMin: number;
  smsTotal: number;
  smsIn: number;
  smsOffnetIn: number;
  amountForfaitData: number;
  amountForfaitVoice: number;
  amountRecharge: number;
  nbRecharge: number;
  transferInAmount: number;
  transferOutAmount: number;
  vasActivationCount: number;
  arpu: number;
  arpm: number;
  incomingActivityDays: number;
  incomingCallsCount: number;
  revenueVoice: number;
  revenueData: number;
  revenueSms: number;
  targetOffer: string;
}

export interface PackageActivationRecord {
  activationId: string;
  clientId: string;
  forfaitName: string;
  transAmount: number;
  transDate: string;
  validityDays: number;
  dataAllocatedMb: number;
  minutesAllocated: number;
  smsAllocated: number;
  channel: string;
}

export interface WeeklyConsumptionRecord {
  rowId: string;
  clientId: string;
  monthDt: string;
  weekDt: string;
  volumeSessionMb: number;
  callsCount: number;
  smsCount: number;
  transactionsAmount: number;
}

export interface GlobalDashboardResponse {
  filters: {
    month: string | null;
  };
  summary: {
    totalClients: number;
    activeClients: number;
    avgArpu: number;
    totalRevenue: number;
    totalTransactions: number;
    totalSessionVolumeMb: number;
  };
  monthlyTrend: Array<{
    month: string;
    volumeSessionMb: number;
    transactionsAmount: number;
    activeClients: number;
  }>;
  topOffers: Array<{
    offer: string;
    count: number;
  }>;
}

export interface ClientBehaviorResponse {
  clientId: string;
  latest: {
    month: string;
    status: string;
    offerType: string;
    targetOffer: string;
    arpu: number;
    totalSessionVolumeMb: number;
    callDurationTotalMin: number;
    smsTotal: number;
    amountRecharge: number;
    nbRecharge: number;
    incomingActivityDays: number;
  };
  totals: {
    revenue: number;
    calls: number;
    sms: number;
    sessionVolumeMb: number;
  };
  monthlyUsage: Array<{
    month: string;
    arpu: number;
    revenue: number;
    sessionVolumeMb: number;
    callDurationMin: number;
    smsTotal: number;
  }>;
  recentActivations: Array<{
    transDate: string;
    forfaitName: string;
    transAmount: number;
    validityDays: number;
  }>;
}

export interface PackagesDashboardResponse {
  filters: {
    month: string | null;
  };
  summary: {
    totalActivations: number;
    totalTransAmount: number;
    avgValidityDays: number;
    totalAllocatedDataMb: number;
    totalAllocatedMinutes: number;
    totalAllocatedSms: number;
  };
  topPackages: Array<{
    forfaitName: string;
    activations: number;
    amount: number;
  }>;
  channelDistribution: Array<{
    channel: string;
    activations: number;
  }>;
  monthlyAmountTrend: Array<{
    month: string;
    amount: number;
  }>;
}

export interface RevenueDashboardResponse {
  filters: {
    month: string | null;
  };
  summary: {
    totalRevenue: number;
    avgArpu: number;
    growthPercent: number;
    revenueVoice: number;
    revenueData: number;
    revenueSms: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  topClients: Array<{
    clientId: string;
    revenue: number;
    avgArpu: number;
  }>;
}

export interface RecommendationResponse {
  clientId: string;
  month: string;
  currentOfferType: string;
  predictedOffer: string;
  confidence: number;
  modelVersion: string;
  rankedOffers: RankedOffer[];
  reasons: string[];
  features: {
    arpu: number;
    sessionVolumeMb: number;
    callDurationMin: number;
    smsTotal: number;
    amountRecharge: number;
  };
  targetOfferFromDataset: string;
  matchesTargetOffer: boolean;
}

export interface RankedOffer {
  offer: string;
  score: number;
  rationale: string;
}

export interface RecommendationModelOverviewResponse {
  modelVersion: string;
  evaluatedClients: number;
  exactMatchRate: number;
  averageConfidence: number;
  highConfidenceRate: number;
  topPredictedOffers: Array<{
    offer: string;
    count: number;
    sharePercent: number;
  }>;
}
