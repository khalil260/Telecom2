"use client";

import { useEffect, useMemo, useState } from "react";
import { KpiCard } from "@/components/KpiCard";
import { SimpleTable } from "@/components/SimpleTable";
import { TT_MOBILE_DATA_OFFERS } from "@/lib/tunisie-telecom-info";
import type { PackagesDashboardResponse } from "@/lib/types";

interface MetaResponse {
  months: string[];
}

export default function PackagesDashboardPage(): React.JSX.Element {
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [data, setData] = useState<PackagesDashboardResponse | null>(null);
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
        const response = await fetch(`/api/dashboard/packages${query}`);
        if (!response.ok) {
          setError("Failed to load package dashboard.");
          setData(null);
          setLoading(false);
          return;
        }

        const payload = (await response.json()) as PackagesDashboardResponse;
        setData(payload);
      } catch {
        setError("Failed to load package dashboard.");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [selectedMonth, refreshKey]);

  const topPackagesRows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.topPackages.map((row) => [
      row.forfaitName,
      row.activations,
      row.amount,
    ]);
  }, [data]);

  const channelRows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.channelDistribution.map((row) => [row.channel, row.activations]);
  }, [data]);

  const monthlyRows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.monthlyAmountTrend.map((row) => [row.month, row.amount]);
  }, [data]);

  return (
    <section className="dashboard-page">
        <section className="hero" data-reveal>
          <p className="eyebrow">Module 03 - Offres Et Forfaits</p>
          <h1>Suivi de performance des forfaits Tunisie Telecom</h1>
          <p>
            Mesurez l'adoption des forfaits internet et mixtes, la contribution des
            canaux et l'evolution des montants transactionnels.
          </p>
          <p className="hero-note">
            Exemples d'offres publiques TT: 200 Go / 100 DT (60 jours), 45 Go / 50
            DT, 25 Go / 30 DT, 4 Go / 10 DT.
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
              Actualiser l'analyse
            </button>
          </div>
        </section>

        {loading ? (
          <p className="panel muted delay-1" data-reveal>
            Chargement des indicateurs forfaits...
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
              <KpiCard
                label="Activations Totales"
                value={data.summary.totalActivations}
              />
              <KpiCard
                label="Montant Transaction Total"
                value={data.summary.totalTransAmount}
              />
              <KpiCard
                label="Validite Moyenne (jours)"
                value={data.summary.avgValidityDays}
              />
              <KpiCard
                label="Data Allouee (MB)"
                value={data.summary.totalAllocatedDataMb}
              />
              <KpiCard
                label="Minutes Allouees"
                value={data.summary.totalAllocatedMinutes}
              />
              <KpiCard
                label="SMS Alloues"
                value={data.summary.totalAllocatedSms}
              />
            </section>

            <section className="two-columns delay-2" data-reveal>
              <SimpleTable
                title="Top Forfaits"
                columns={["Forfait", "Activations", "Montant"]}
                rows={topPackagesRows}
              />
              <SimpleTable
                title="Distribution Par Canal"
                columns={["Canal", "Activations"]}
                rows={channelRows}
              />
            </section>

            <div className="delay-3" data-reveal>
              <SimpleTable
                title="Tendance Mensuelle Des Montants"
                columns={["Mois", "Montant"]}
                rows={monthlyRows}
              />
            </div>

            <section className="panel delay-3" data-reveal>
              <div className="panel-head">
                <h3>Catalogue Public TT - Internet Mobile</h3>
              </div>
              <p className="panel-subtitle">
                Forfaits internet publies sur tunisietelecom.tn (particulier).
              </p>

              <div className="offer-chip-grid">
                {TT_MOBILE_DATA_OFFERS.map((offer) => (
                  <article className="offer-chip" key={offer.title}>
                    <p className="info-item-head">{offer.title}</p>
                    <p className="info-item-meta">{offer.detail}</p>
                    <a
                      className="meta-link"
                      href={offer.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Voir sur le site TT
                    </a>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : null}
    </section>
  );
}
