import { readCsvRows } from "@/lib/csv";
import type {
  ClientConsumptionRecord,
  PackageActivationRecord,
  WeeklyConsumptionRecord,
} from "@/lib/types";

const toNumber = (value: string): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const OFFER_TYPE_MAP: Record<string, string> = {
  "Budget Mix": "Forfait Mixte S",
  "Data Plus": "Forfait Internet 25 Go",
  "Family Max": "Forfait Internet 45 Go",
  "Voice Pro": "Forfait Voix Plus",
};

const TARGET_OFFER_MAP: Record<string, string> = {
  "Data Booster 10GB": "Forfait Internet 10 Go",
  "Max Data 25GB": "Forfait Internet 25 Go",
  "Smart Budget Mix": "Forfait Mixte S",
  "Voice+SMS Premium": "Forfait Voix Plus",
};

const PACKAGE_NAME_MAP: Record<string, string> = {
  "Forfait Data 5GB": "Forfait Internet 4 Go",
  "Forfait Data 10GB": "Forfait Internet 10 Go",
  "Forfait Mixte S": "Forfait Mixte S",
  "Forfait Mixte M": "Forfait Mixte M",
  "Forfait Voix Plus": "Forfait Voix Plus",
};

const CHANNEL_MAP: Record<string, string> = {
  Web: "MyTT Web",
  "Mobile App": "MyTT App",
  USSD: "Code USSD",
  POS: "TT Shop",
};

const mapLabel = (value: string, mapper: Record<string, string>): string =>
  mapper[value] ?? value;

export async function getClientConsumptionData(): Promise<
  ClientConsumptionRecord[]
> {
  const rows = await readCsvRows("client_consumption.csv");

  return rows.map((row) => ({
    clientId: row.client_id,
    status: row.status,
    offerType: mapLabel(row.offer_type, OFFER_TYPE_MAP),
    ancMonths: toNumber(row.anc_months),
    month: row.month,
    totalSessionVolumeMb: toNumber(row.total_session_volume_mb),
    weekendDataMb: toNumber(row.weekend_data_mb),
    volume2gMb: toNumber(row.volume_2g_mb),
    volume3gMb: toNumber(row.volume_3g_mb),
    volume4gMb: toNumber(row.volume_4g_mb),
    nbCdr: toNumber(row.nb_cdr),
    nbCdrWeekend: toNumber(row.nb_cdr_weekend),
    callDurationTotalMin: toNumber(row.call_duration_total_min),
    callDurationOffnetMin: toNumber(row.call_duration_offnet_min),
    smsTotal: toNumber(row.sms_total),
    smsIn: toNumber(row.sms_in),
    smsOffnetIn: toNumber(row.sms_offnet_in),
    amountForfaitData: toNumber(row.amount_forfait_data),
    amountForfaitVoice: toNumber(row.amount_forfait_voice),
    amountRecharge: toNumber(row.amount_recharge),
    nbRecharge: toNumber(row.nb_recharge),
    transferInAmount: toNumber(row.transfer_in_amount),
    transferOutAmount: toNumber(row.transfer_out_amount),
    vasActivationCount: toNumber(row.vas_activation_count),
    arpu: toNumber(row.arpu),
    arpm: toNumber(row.arpm),
    incomingActivityDays: toNumber(row.incoming_activity_days),
    incomingCallsCount: toNumber(row.incoming_calls_count),
    revenueVoice: toNumber(row.revenue_voice),
    revenueData: toNumber(row.revenue_data),
    revenueSms: toNumber(row.revenue_sms),
    targetOffer: mapLabel(row.target_offer, TARGET_OFFER_MAP),
  }));
}

export async function getPackageActivationData(): Promise<
  PackageActivationRecord[]
> {
  const rows = await readCsvRows("package_activations.csv");

  return rows.map((row) => ({
    activationId: row.activation_id,
    clientId: row.client_id,
    forfaitName: mapLabel(row.forfait_name, PACKAGE_NAME_MAP),
    transAmount: toNumber(row.trans_amount),
    transDate: row.trans_date,
    validityDays: toNumber(row.validity_days),
    dataAllocatedMb: toNumber(row.data_allocated_mb),
    minutesAllocated: toNumber(row.minutes_allocated),
    smsAllocated: toNumber(row.sms_allocated),
    channel: mapLabel(row.channel, CHANNEL_MAP),
  }));
}

export async function getWeeklyConsumptionData(): Promise<
  WeeklyConsumptionRecord[]
> {
  const rows = await readCsvRows("weekly_consumption.csv");

  return rows.map((row) => ({
    rowId: row.row_id,
    clientId: row.client_id,
    monthDt: row.month_dt,
    weekDt: row.week_dt,
    volumeSessionMb: toNumber(row.volume_session_mb),
    callsCount: toNumber(row.calls_count),
    smsCount: toNumber(row.sms_count),
    transactionsAmount: toNumber(row.transactions_amount),
  }));
}
