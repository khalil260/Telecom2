"use client";

import { useEffect, useMemo, useState } from "react";
import { KpiCard } from "@/components/KpiCard";
import { SimpleTable } from "@/components/SimpleTable";
import type { ClientBehaviorResponse } from "@/lib/types";

interface MetaResponse {
  clients: string[];
}

export default function ClientDashboardPage(): React.JSX.Element {
  const [clients, setClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [data, setData] = useState<ClientBehaviorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    async function loadMeta() {
      try {
        const response = await fetch("/api/meta/clients");
        const payload = (await response.json()) as MetaResponse;
        setClients(payload.clients ?? []);
        if (payload.clients?.length) {
          setSelectedClient(payload.clients[0]);
        }
      } catch {
        setClients([]);
      }
    }

    void loadMeta();
  }, []);

  useEffect(() => {
    if (!selectedClient) {
      return;
    }

    async function loadClient() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/dashboard/client?clientId=${encodeURIComponent(selectedClient)}`,
        );

        if (!response.ok) {
          setError("Failed to load client behavior.");
          setData(null);
          setLoading(false);
          return;
        }

        const payload = (await response.json()) as ClientBehaviorResponse;
        setData(payload);
      } catch {
        setError("Failed to load client behavior.");
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    void loadClient();
  }, [selectedClient, refreshKey]);

  const usageRows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.monthlyUsage.map((row) => [
      row.month,
      row.arpu,
      row.revenue,
      row.sessionVolumeMb,
      row.callDurationMin,
      row.smsTotal,
    ]);
  }, [data]);

  const activationRows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.recentActivations.map((row) => [
      row.transDate,
      row.forfaitName,
      row.transAmount,
      row.validityDays,
    ]);
  }, [data]);

  return (
    <section className="dashboard-page">
        <section className="hero" data-reveal>
          <p className="eyebrow">Module 02 - Profil Client</p>
          <h1>Analyse comportementale client a 360 degres</h1>
          <p>
            Etudiez le parcours d'un client via l'usage data/voix, les recharges,
            l'offre actuelle et l'historique d'activation de forfaits.
          </p>

          <div className="filters">
            <div>
              <label htmlFor="client">Client</label>
              <select
                id="client"
                value={selectedClient}
                onChange={(event) => setSelectedClient(event.target.value)}
              >
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="button secondary"
              onClick={() => setRefreshKey((current) => current + 1)}
              type="button"
            >
              Actualiser le profil
            </button>
          </div>
        </section>

        {loading ? (
          <p className="panel muted delay-1" data-reveal>
            Chargement du profil client...
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
              <KpiCard label="Mois Recent" value={data.latest.month} />
              <KpiCard
                label="Statut"
                value={data.latest.status}
                emphasis={data.latest.status === "A" ? "ok" : "warn"}
              />
              <KpiCard label="Offre Actuelle" value={data.latest.offerType} />
              <KpiCard label="Offre Cible" value={data.latest.targetOffer} />
              <KpiCard label="ARPU (TND)" value={data.latest.arpu} />
              <KpiCard
                label="Volume Session MB"
                value={data.latest.totalSessionVolumeMb}
              />
              <KpiCard
                label="Duree Appels (min)"
                value={data.latest.callDurationTotalMin}
              />
              <KpiCard label="SMS Total" value={data.latest.smsTotal} />
              <KpiCard label="Montant Recharge" value={data.latest.amountRecharge} />
              <KpiCard label="Nombre Recharges" value={data.latest.nbRecharge} />
              <KpiCard label="Revenu Total" value={data.totals.revenue} />
              <KpiCard label="Total Appels (min)" value={data.totals.calls} />
              <KpiCard label="Total SMS" value={data.totals.sms} />
              <KpiCard
                label="Total Session MB"
                value={data.totals.sessionVolumeMb}
              />
            </section>

            <section className="two-columns delay-2" data-reveal>
              <SimpleTable
                title="Usage Mensuel"
                columns={[
                  "Mois",
                  "ARPU",
                  "Revenu",
                  "Session MB",
                  "Appels Min",
                  "SMS",
                ]}
                rows={usageRows}
              />
              <SimpleTable
                title="Activations Recentes"
                columns={["Date", "Forfait", "Montant", "Validite (jours)"]}
                rows={activationRows}
              />
            </section>
          </>
        ) : null}
    </section>
  );
}
