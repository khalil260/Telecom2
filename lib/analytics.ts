import {
  getClientConsumptionData,
  getPackageActivationData,
  getWeeklyConsumptionData,
} from "@/lib/data-source";
import type {
  ClientBehaviorResponse,
  GlobalDashboardResponse,
  PackagesDashboardResponse,
  RevenueDashboardResponse,
} from "@/lib/types";

const round = (value: number): number => Number(value.toFixed(2));

export async function buildGlobalDashboard(
  month?: string,
): Promise<GlobalDashboardResponse> {
  const [consumption, weekly] = await Promise.all([
    getClientConsumptionData(),
    getWeeklyConsumptionData(),
  ]);

  const filtered = month
    ? consumption.filter((row) => row.month === month)
    : consumption;

  const filteredWeekly = month
    ? weekly.filter((row) => row.monthDt === month)
    : weekly;

  const clientSet = new Set(filtered.map((row) => row.clientId));
  const activeSet = new Set(
    filtered.filter((row) => row.status === "A").map((row) => row.clientId),
  );

  const totalRevenue = filtered.reduce(
    (acc, row) => acc + row.revenueVoice + row.revenueData + row.revenueSms,
    0,
  );
  const totalSessionVolume = filtered.reduce(
    (acc, row) => acc + row.totalSessionVolumeMb,
    0,
  );
  const avgArpu =
    filtered.length === 0
      ? 0
      : filtered.reduce((acc, row) => acc + row.arpu, 0) / filtered.length;

  const monthMap = new Map<
    string,
    {
      volumeSessionMb: number;
      transactionsAmount: number;
      activeClients: Set<string>;
    }
  >();

  filteredWeekly.forEach((row) => {
    const existing = monthMap.get(row.monthDt) ?? {
      volumeSessionMb: 0,
      transactionsAmount: 0,
      activeClients: new Set<string>(),
    };

    existing.volumeSessionMb += row.volumeSessionMb;
    existing.transactionsAmount += row.transactionsAmount;
    existing.activeClients.add(row.clientId);

    monthMap.set(row.monthDt, existing);
  });

  const monthlyTrend = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, value]) => ({
      month: monthKey,
      volumeSessionMb: round(value.volumeSessionMb),
      transactionsAmount: round(value.transactionsAmount),
      activeClients: value.activeClients.size,
    }));

  const offerCount = new Map<string, number>();
  filtered.forEach((row) => {
    offerCount.set(row.offerType, (offerCount.get(row.offerType) ?? 0) + 1);
  });

  const topOffers = [...offerCount.entries()]
    .map(([offer, count]) => ({ offer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    filters: {
      month: month ?? null,
    },
    summary: {
      totalClients: clientSet.size,
      activeClients: activeSet.size,
      avgArpu: round(avgArpu),
      totalRevenue: round(totalRevenue),
      totalTransactions: round(
        filteredWeekly.reduce((acc, row) => acc + row.transactionsAmount, 0),
      ),
      totalSessionVolumeMb: round(totalSessionVolume),
    },
    monthlyTrend,
    topOffers,
  };
}

export async function buildClientBehavior(
  clientId: string,
): Promise<ClientBehaviorResponse | null> {
  const [consumption, activations] = await Promise.all([
    getClientConsumptionData(),
    getPackageActivationData(),
  ]);

  const rows = consumption
    .filter((row) => row.clientId === clientId)
    .sort((a, b) => a.month.localeCompare(b.month));

  if (rows.length === 0) {
    return null;
  }

  const latest = rows[rows.length - 1];

  const monthlyUsage = rows.map((row) => ({
    month: row.month,
    arpu: round(row.arpu),
    revenue: round(row.revenueVoice + row.revenueData + row.revenueSms),
    sessionVolumeMb: round(row.totalSessionVolumeMb),
    callDurationMin: round(row.callDurationTotalMin),
    smsTotal: row.smsTotal,
  }));

  const relatedActivations = activations
    .filter((row) => row.clientId === clientId)
    .sort((a, b) => b.transDate.localeCompare(a.transDate))
    .slice(0, 8)
    .map((row) => ({
      transDate: row.transDate,
      forfaitName: row.forfaitName,
      transAmount: round(row.transAmount),
      validityDays: row.validityDays,
    }));

  return {
    clientId,
    latest: {
      month: latest.month,
      status: latest.status,
      offerType: latest.offerType,
      targetOffer: latest.targetOffer,
      arpu: round(latest.arpu),
      totalSessionVolumeMb: round(latest.totalSessionVolumeMb),
      callDurationTotalMin: round(latest.callDurationTotalMin),
      smsTotal: latest.smsTotal,
      amountRecharge: round(latest.amountRecharge),
      nbRecharge: latest.nbRecharge,
      incomingActivityDays: latest.incomingActivityDays,
    },
    totals: {
      revenue: round(
        rows.reduce(
          (acc, row) => acc + row.revenueVoice + row.revenueData + row.revenueSms,
          0,
        ),
      ),
      calls: round(rows.reduce((acc, row) => acc + row.callDurationTotalMin, 0)),
      sms: rows.reduce((acc, row) => acc + row.smsTotal, 0),
      sessionVolumeMb: round(
        rows.reduce((acc, row) => acc + row.totalSessionVolumeMb, 0),
      ),
    },
    monthlyUsage,
    recentActivations: relatedActivations,
  };
}

export async function buildPackagesDashboard(
  month?: string,
): Promise<PackagesDashboardResponse> {
  const activations = await getPackageActivationData();

  const filtered = month
    ? activations.filter((row) => row.transDate.startsWith(month))
    : activations;

  const totalTransAmount = filtered.reduce((acc, row) => acc + row.transAmount, 0);
  const avgValidity =
    filtered.length === 0
      ? 0
      : filtered.reduce((acc, row) => acc + row.validityDays, 0) / filtered.length;

  const packMap = new Map<string, { activations: number; amount: number }>();
  const channelMap = new Map<string, number>();
  const monthlyMap = new Map<string, number>();

  filtered.forEach((row) => {
    const existingPack = packMap.get(row.forfaitName) ?? {
      activations: 0,
      amount: 0,
    };
    existingPack.activations += 1;
    existingPack.amount += row.transAmount;
    packMap.set(row.forfaitName, existingPack);

    channelMap.set(row.channel, (channelMap.get(row.channel) ?? 0) + 1);

    const monthKey = row.transDate.slice(0, 7);
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) ?? 0) + row.transAmount);
  });

  return {
    filters: {
      month: month ?? null,
    },
    summary: {
      totalActivations: filtered.length,
      totalTransAmount: round(totalTransAmount),
      avgValidityDays: round(avgValidity),
      totalAllocatedDataMb: round(
        filtered.reduce((acc, row) => acc + row.dataAllocatedMb, 0),
      ),
      totalAllocatedMinutes: round(
        filtered.reduce((acc, row) => acc + row.minutesAllocated, 0),
      ),
      totalAllocatedSms: round(
        filtered.reduce((acc, row) => acc + row.smsAllocated, 0),
      ),
    },
    topPackages: [...packMap.entries()]
      .map(([forfaitName, values]) => ({
        forfaitName,
        activations: values.activations,
        amount: round(values.amount),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8),
    channelDistribution: [...channelMap.entries()]
      .map(([channel, activations]) => ({ channel, activations }))
      .sort((a, b) => b.activations - a.activations),
    monthlyAmountTrend: [...monthlyMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, amount]) => ({ month: monthKey, amount: round(amount) })),
  };
}

export async function buildRevenueDashboard(
  month?: string,
): Promise<RevenueDashboardResponse> {
  const consumption = await getClientConsumptionData();
  const filtered = month
    ? consumption.filter((row) => row.month === month)
    : consumption;

  const monthMap = new Map<string, number>();
  const clientRevenueMap = new Map<string, { revenue: number; arpuTotal: number; n: number }>();

  filtered.forEach((row) => {
    const revenue = row.revenueVoice + row.revenueData + row.revenueSms;
    monthMap.set(row.month, (monthMap.get(row.month) ?? 0) + revenue);

    const current = clientRevenueMap.get(row.clientId) ?? {
      revenue: 0,
      arpuTotal: 0,
      n: 0,
    };
    current.revenue += revenue;
    current.arpuTotal += row.arpu;
    current.n += 1;
    clientRevenueMap.set(row.clientId, current);
  });

  const monthlyRevenue = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, revenue]) => ({ month: monthKey, revenue: round(revenue) }));

  const first = monthlyRevenue[0]?.revenue ?? 0;
  const last = monthlyRevenue[monthlyRevenue.length - 1]?.revenue ?? 0;
  const growthPercent = first === 0 ? 0 : ((last - first) / first) * 100;

  return {
    filters: {
      month: month ?? null,
    },
    summary: {
      totalRevenue: round(
        filtered.reduce(
          (acc, row) => acc + row.revenueVoice + row.revenueData + row.revenueSms,
          0,
        ),
      ),
      avgArpu: round(
        filtered.length === 0
          ? 0
          : filtered.reduce((acc, row) => acc + row.arpu, 0) / filtered.length,
      ),
      growthPercent: round(growthPercent),
      revenueVoice: round(filtered.reduce((acc, row) => acc + row.revenueVoice, 0)),
      revenueData: round(filtered.reduce((acc, row) => acc + row.revenueData, 0)),
      revenueSms: round(filtered.reduce((acc, row) => acc + row.revenueSms, 0)),
    },
    monthlyRevenue,
    topClients: [...clientRevenueMap.entries()]
      .map(([clientId, values]) => ({
        clientId,
        revenue: round(values.revenue),
        avgArpu: round(values.arpuTotal / values.n),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10),
  };
}
