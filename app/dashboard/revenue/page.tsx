"use client";

import { useEffect, useMemo, useState } from "react";
import { KpiCard } from "@/components/KpiCard";
import { SimpleTable } from "@/components/SimpleTable";
import type { RevenueDashboardResponse } from "@/lib/types";

interface MetaResponse {
  months: string[];
}

export default function RevenueDashboardPage(): React.JSX.Element {
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [data, setData] = useState<RevenueDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
        const response = await fetch(`/api/dashboard/revenue${query}`);
        if (!response.ok) {
          setError("Failed to load revenue dashboard.");
          setData(null);
          setLoading(false);
          return;
        }

        const payload = (await response.json()) as RevenueDashboardResponse;
        setData(payload);
      } catch {
        setError("Failed to load revenue dashboard.");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [selectedMonth, refreshKey]);

  const monthlyRows = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.monthlyRevenue.map((row) => [row.month, row.revenue]);
  }, [data]);

  const topClientsRows = useMemo(() => {
    if (!data) {
      return [];
    }
    return data.topClients.map((row) => [row.clientId, row.revenue, row.avgArpu]);
  }, [data]);

  return (
    <section className="dashboard-page">
        <section className="hero" data-reveal>
          <p className="eyebrow">Module 04 - Revenus</p>
          <h1>Pilotage des revenus et de la valeur client</h1>
          <p>
            Suivez la composition du revenu telecom et la tendance mensuelle pour
            identifier la creation de valeur en voix, data et SMS.
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
              Actualiser les revenus
            </button>
          </div>
        </section>

        {loading ? (
          <p className="panel muted delay-1" data-reveal>
            Chargement des indicateurs de revenu...
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
              <KpiCard label="Revenu Total" value={data.summary.totalRevenue} />
              <KpiCard label="ARPU Moyen" value={data.summary.avgArpu} />
              <KpiCard
                label="Croissance %"
                value={data.summary.growthPercent}
                hint="Dernier mois vs premier mois"
                emphasis={
                  data.summary.growthPercent >= 0 ? "ok" : "warn"
                }
              />
              <KpiCard label="Revenu Voix" value={data.summary.revenueVoice} />
              <KpiCard label="Revenu Data" value={data.summary.revenueData} />
              <KpiCard label="Revenu SMS" value={data.summary.revenueSms} />
            </section>

            <section className="two-columns delay-2" data-reveal>
              <SimpleTable
                title="Revenu Mensuel"
                columns={["Mois", "Revenu"]}
                rows={monthlyRows}
              />
              <SimpleTable
                title="Top Clients"
                columns={["Client", "Revenu", "ARPU Moyen"]}
                rows={topClientsRows}
              />
            </section>
          </>
        ) : null}
    </section>
  );
}
