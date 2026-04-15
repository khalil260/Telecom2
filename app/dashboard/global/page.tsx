"use client";

import { useEffect, useMemo, useState } from "react";
import { KpiCard } from "@/components/KpiCard";
import { SimpleTable } from "@/components/SimpleTable";
import type { GlobalDashboardResponse } from "@/lib/types";

interface MetaResponse {
  months: string[];
}

export default function GlobalDashboardPage(): React.JSX.Element {
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [data, setData] = useState<GlobalDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    async function loadMeta() {
      try {
        const response = await fetch("/api/meta/clients");
        const payload = (await response.json()) as MetaResponse;
        setMonths(payload.months ?? []);
      } catch {
        setMonths([]);
      }
    }

    void loadMeta();
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      const query = selectedMonth
        ? `?month=${encodeURIComponent(selectedMonth)}`
        : "";

      try {
        const response = await fetch(`/api/dashboard/global${query}`);
        if (!response.ok) {
          setError("Failed to load global dashboard data.");
          setData(null);
          setLoading(false);
          return;
        }

        const payload = (await response.json()) as GlobalDashboardResponse;
        setData(payload);
      } catch {
        setError("Failed to load global dashboard data.");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [selectedMonth, refreshKey]);

  const trendRows = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.monthlyTrend.map((item) => [
      item.month,
      item.volumeSessionMb.toLocaleString(),
      item.transactionsAmount.toLocaleString(),
      item.activeClients,
    ]);
  }, [data]);

  const offerRows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.topOffers.map((item) => [item.offer, item.count]);
  }, [data]);

  return (
    <section className="dashboard-page">
        <section className="hero" data-reveal>
          <p className="eyebrow">Module 01 - Pilotage Global TT</p>
          <h1>Vue consolidee de la consommation et de l'activite telecom</h1>
          <p>
            Suivi mensuel des clients actifs, des revenus et de l'usage voix/data/SMS
            a partir des jeux de donnees operationnels du projet PFE.
          </p>

          <div className="filters">
            <div>
              <label htmlFor="month">Filtre mois</label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                <option value="">Tous les mois</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="button secondary"
              onClick={() => setRefreshKey((current) => current + 1)}
              type="button"
            >
              Actualiser les donnees
            </button>
          </div>
        </section>

        {loading ? (
          <p className="panel muted delay-1" data-reveal>
            Chargement des indicateurs globaux...
          </p>
        ) : null}
        {error ? (
          <p className="panel error delay-1" data-reveal>
            {error}
          </p>
        ) : null}

        {data ? (
          <>
            <section className="kpi-grid delay-1" data-reveal>
              <KpiCard label="Clients Totaux" value={data.summary.totalClients} />
              <KpiCard label="Clients Actifs" value={data.summary.activeClients} />
              <KpiCard label="ARPU Moyen (TND)" value={data.summary.avgArpu} />
              <KpiCard
                label="Revenu Total (TND)"
                value={data.summary.totalRevenue.toLocaleString()}
              />
              <KpiCard
                label="Montant Transactions (TND)"
                value={data.summary.totalTransactions.toLocaleString()}
              />
              <KpiCard
                label="Volume Session (MB)"
                value={data.summary.totalSessionVolumeMb.toLocaleString()}
              />
            </section>

            <section className="two-columns delay-2" data-reveal>
              <SimpleTable
                title="Tendance Mensuelle"
                columns={[
                  "Mois",
                  "Volume Session MB",
                  "Montant Transactions",
                  "Clients Actifs",
                ]}
                rows={trendRows}
              />
              <SimpleTable
                title="Offres Les Plus Utilisees"
                columns={["Offre", "Occurrences"]}
                rows={offerRows}
              />
            </section>
          </>
        ) : null}
    </section>
  );
}
