"use client";

import { useEffect, useMemo, useState } from "react";
import { KpiCard } from "@/components/KpiCard";
import { SimpleTable } from "@/components/SimpleTable";
import type { RecommendationResponse } from "@/lib/types";

interface MetaResponse {
  clients: string[];
}

interface ProspectFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface SubmittedProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mappedClientId: string;
}

const initialForm: ProspectFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

function mapPhoneToClientId(phone: string, clients: string[]): string {
  if (clients.length === 0) {
    return "";
  }

  const digits = phone.replace(/\D/g, "");
  if (!digits) {
    return clients[0];
  }

  const seed = digits
    .split("")
    .reduce((accumulator, digit) => accumulator + Number(digit), 0);

  return clients[seed % clients.length];
}

function validateForm(form: ProspectFormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.firstName.trim() || form.firstName.trim().length < 2) {
    errors.firstName = "Veuillez saisir un prenom valide.";
  }

  if (!form.lastName.trim() || form.lastName.trim().length < 2) {
    errors.lastName = "Veuillez saisir un nom valide.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email.trim())) {
    errors.email = "Veuillez saisir une adresse email valide.";
  }

  const phoneDigits = form.phone.replace(/\D/g, "");
  if (phoneDigits.length < 8) {
    errors.phone = "Le numero doit contenir au moins 8 chiffres.";
  }

  return errors;
}

export default function RecommendationPage(): React.JSX.Element {
  const [clients, setClients] = useState<string[]>([]);
  const [form, setForm] = useState<ProspectFormState>(initialForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submittedProfile, setSubmittedProfile] =
    useState<SubmittedProfile | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadMeta() {
      try {
        const response = await fetch("/api/meta/clients");
        const payload = (await response.json()) as MetaResponse;
        setClients(payload.clients ?? []);
      } catch {
        setClients([]);
      }
    }

    void loadMeta();
  }, []);

  const fullName = useMemo(() => {
    if (!submittedProfile) {
      return "";
    }

    return `${submittedProfile.firstName} ${submittedProfile.lastName}`;
  }, [submittedProfile]);

  const confidenceLabel = useMemo(() => {
    if (!data) {
      return "";
    }

    if (data.confidence >= 75) {
      return "Confiance elevee";
    }

    if (data.confidence >= 55) {
      return "Confiance moyenne";
    }

    return "Confiance faible";
  }, [data]);

  const rankedRows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.rankedOffers.map((offer, index) => [
      `${index + 1}`,
      offer.offer,
      `${offer.score}%`,
      offer.rationale,
    ]);
  }, [data]);

  const handleFormValue = (
    field: keyof ProspectFormState,
    value: string,
  ): void => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateForm(form);
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    if (clients.length === 0) {
      setError("Les donnees de recommandation sont indisponibles.");
      setData(null);
      return;
    }

    const mappedClientId = mapPhoneToClientId(form.phone, clients);
    if (!mappedClientId) {
      setError("Impossible d'associer ce profil aux donnees disponibles.");
      setData(null);
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(
        `/api/recommendation?clientId=${encodeURIComponent(mappedClientId)}`,
      );

      if (!response.ok) {
        setError("Echec de generation de la recommandation. Reessayez.");
        setLoading(false);
        return;
      }

      const payload = (await response.json()) as RecommendationResponse;
      setSubmittedProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        mappedClientId,
      });
      setData(payload);
    } catch {
      setError("Echec de generation de la recommandation. Reessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="dashboard-page">
      <section className="hero" data-reveal>
        <p className="eyebrow">Module 05 - Recommandation Commerciale</p>
        <h1>Moteur central de recommandation d'offres Tunisie Telecom</h1>
        <p>
          Cette page est le coeur du projet PFE: calcul de score multi-offres,
          classement des meilleures propositions et justification metier.
        </p>
      </section>

      <section className="recommendation-workspace delay-1" data-reveal>
        <section className="panel recommendation-form-panel">
          <div className="panel-head">
            <h2>Informations Client</h2>
          </div>
          <p className="panel-subtitle">
            Completez ce formulaire pour lancer une simulation instantanee.
          </p>

          <form className="recommendation-form" onSubmit={handleSubmit} noValidate>
            <div className="recommendation-form-grid">
              <div className="field">
                <label htmlFor="firstName">Prenom</label>
                <input
                  id="firstName"
                  value={form.firstName}
                  onChange={(event) =>
                    handleFormValue("firstName", event.target.value)
                  }
                  placeholder="ex: Fatma"
                  required
                />
                {formErrors.firstName ? (
                  <p className="error">{formErrors.firstName}</p>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="lastName">Nom</label>
                <input
                  id="lastName"
                  value={form.lastName}
                  onChange={(event) =>
                    handleFormValue("lastName", event.target.value)
                  }
                  placeholder="ex: Ben Salah"
                  required
                />
                {formErrors.lastName ? (
                  <p className="error">{formErrors.lastName}</p>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => handleFormValue("email", event.target.value)}
                  placeholder="nom@exemple.com"
                  required
                />
                {formErrors.email ? (
                  <p className="error">{formErrors.email}</p>
                ) : null}
              </div>

              <div className="field">
                <label htmlFor="phone">Numero de Telephone</label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(event) => handleFormValue("phone", event.target.value)}
                  placeholder="+216 XX XXX XXX"
                  required
                />
                {formErrors.phone ? (
                  <p className="error">{formErrors.phone}</p>
                ) : null}
              </div>
            </div>

            <button className="button" type="submit" disabled={loading}>
              {loading ? "Generation en cours..." : "Generer la recommandation"}
            </button>
          </form>
        </section>

        <section className="panel recommendation-side-panel">
          <div className="panel-head">
            <h3>Comment Ca Marche</h3>
          </div>
          <ul className="insight-list">
            <li>Le profil est mappe vers un comportement client telecom.</li>
            <li>Les metriques d'usage sont scorees sur plusieurs offres candidates.</li>
            <li>Le moteur retourne un Top 3 avec score et rationale.</li>
          </ul>
        </section>
      </section>

      {loading ? (
        <p className="panel muted delay-2" data-reveal>
          Generation des details de recommandation...
        </p>
      ) : null}
      {error ? (
        <p className="panel error delay-2" data-reveal>
          {error}
        </p>
      ) : null}

      {data && submittedProfile ? (
        <section className="panel recommendation-result delay-3" data-reveal>
          <div className="recommendation-result-head">
            <p className="eyebrow">Resultat</p>
            <h2>{fullName}, votre offre personnalisee est prete.</h2>
            <p className="panel-subtitle">
              Recommandation generee depuis le profil d'usage associe au client
              <strong>{submittedProfile.mappedClientId}</strong>.
            </p>
          </div>

          <div className="recommendation-badges">
            <span className="recommendation-badge">{submittedProfile.email}</span>
            <span className="recommendation-badge">{submittedProfile.phone}</span>
            <span className="recommendation-badge">{confidenceLabel}</span>
          </div>

          <section className="kpi-grid">
            <KpiCard label="Offre Predite" value={data.predictedOffer} />
            <KpiCard label="Offre Actuelle" value={data.currentOfferType} />
            <KpiCard
              label="Confiance"
              value={`${data.confidence}%`}
              hint="Score de confiance du MVP"
              emphasis={data.confidence >= 75 ? "ok" : "warn"}
            />
            <KpiCard label="Mois de Reference" value={data.month} />
            <KpiCard label="Version Moteur" value={data.modelVersion} />
          </section>

          <section className="delay-2" data-reveal>
            <SimpleTable
              title="Top 3 Offres Recommandees"
              columns={["Rang", "Offre", "Score", "Rationale"]}
              rows={rankedRows}
            />
          </section>

          <section className="two-columns recommendation-columns">
            <article className="panel recommendation-inner-panel">
              <div className="panel-head">
                <h3>Pourquoi Cette Recommandation</h3>
              </div>
              <ul className="insight-list">
                {data.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              <p className={data.matchesTargetOffer ? "status-ok" : "status-warn"}>
                {data.matchesTargetOffer
                  ? "La prediction est coherente avec l'offre cible du dataset."
                  : "La prediction differe de la cible, utile pour revue metier."}
              </p>
            </article>

            <article className="panel recommendation-inner-panel">
              <div className="panel-head">
                <h3>Signaux De Scoring</h3>
              </div>
              <div className="kpi-grid recommendation-signals-grid">
                <KpiCard label="ARPU" value={data.features.arpu} />
                <KpiCard label="Session MB" value={data.features.sessionVolumeMb} />
                <KpiCard label="Minutes Appels" value={data.features.callDurationMin} />
                <KpiCard label="SMS" value={data.features.smsTotal} />
                <KpiCard label="Recharge" value={data.features.amountRecharge} />
              </div>
            </article>
          </section>
        </section>
      ) : null}
    </section>
  );
}
