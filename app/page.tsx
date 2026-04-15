import Image from "next/image";
import Link from "next/link";
import { getRecommendationModelOverview } from "@/lib/recommendation";
import {
  TT_BUSINESS_SOLUTIONS,
  TT_LATEST_NEWS,
  TT_MOBILE_DATA_OFFERS,
  TT_PUBLIC_FACTS,
  TT_QUICK_SERVICES,
} from "@/lib/tunisie-telecom-info";
import TopNav from "../components/TopNav";

const modules = [
  {
    href: "/dashboard/recommendation",
    kicker: "01 Recommandation",
    title: "Moteur D'Offres",
    description:
      "Classement Top 3 des offres avec score de confiance et rationale metier.",
  },
  {
    href: "/dashboard/global",
    kicker: "02 Pilotage",
    title: "Consommation Globale",
    description:
      "Suivez les indicateurs consolides de clients actifs, ARPU et revenus par mois.",
  },
  {
    href: "/dashboard/client",
    kicker: "03 Profil Client",
    title: "Comportement Client",
    description:
      "Analysez l'usage, les recharges et l'evolution mensuelle au niveau individuel.",
  },
  {
    href: "/dashboard/packages",
    kicker: "04 Offres",
    title: "Analyse Des Forfaits",
    description:
      "Mesurez la performance des forfaits internet et mixtes selon les canaux MyTT et TT Shop.",
  },
  {
    href: "/dashboard/revenue",
    kicker: "05 Revenus",
    title: "Revenus Et Rentabilite",
    description:
      "Pilotez la valeur voix, data et SMS et identifiez les clients a forte contribution.",
  },
];

export default async function Home() {
  const recommendationOverview = await getRecommendationModelOverview();

  return (
    <>
      <TopNav />
      <main className="page-wrap">
        <section className="hero" data-reveal>
          <div className="hero-brand">
            <Image
              src="/tunisie-telecom-logo.svg"
              alt="Tunisie Telecom logo"
              width={146}
              height={95}
              className="hero-logo"
              priority
            />
            <p className="hero-tagline">La vie est emotions</p>
          </div>

          <p className="eyebrow">Plateforme PFE - Tunisie Telecom</p>
          <h1>Cockpit BI pour piloter la performance telecom en conditions reelles.</h1>
          <p>
            Ce projet federateur consolide les donnees de consommation, de revenus et
            d'activations forfait pour reproduire un environnement d'analyse proche des
            cas d'usage Tunisie Telecom.
          </p>

          <p className="hero-note">
            References publiques utilisees: tunisietelecom.tn (offres internet mobile,
            services MyTT/TT Cash, numeros assistance 1298 et 1288).
          </p>

          <div className="hero-actions">
            <Link className="button" href="/dashboard/recommendation">
              Lancer la recommandation
            </Link>
            <Link className="button secondary" href="/dashboard/global">
              Voir les dashboards support
            </Link>
          </div>

          <div className="hero-stat-grid">
            <article className="hero-stat">
              <p className="hero-stat-label">Creation</p>
              <p className="hero-stat-value">17/04/1995</p>
            </article>
            <article className="hero-stat">
              <p className="hero-stat-label">Premiere ligne GSM</p>
              <p className="hero-stat-value">20/03/1998</p>
            </article>
            <article className="hero-stat">
              <p className="hero-stat-label">Assistance Particulier</p>
              <p className="hero-stat-value">1298 / 71 001 298</p>
            </article>
            <article className="hero-stat">
              <p className="hero-stat-label">Assistance Entreprise</p>
              <p className="hero-stat-value">1288 / 71 001 288</p>
            </article>
          </div>
        </section>

        <section className="cards delay-1" data-reveal>
          {modules.map((module) => (
            <Link className="card-link" href={module.href} key={module.href}>
              <span className="card-kicker">{module.kicker}</span>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </Link>
          ))}
        </section>

        <section className="panel recommendation-focus delay-2" data-reveal>
          <div className="panel-head">
            <h3>Performance Du Moteur De Recommandation</h3>
          </div>
          <p className="panel-subtitle">
            Indicateurs calcules sur les profils clients pour suivre la qualite du
            moteur de recommandation d'offres.
          </p>

          <section className="kpi-grid">
            <div className="kpi-card">
              <p className="kpi-label">Version Modele</p>
              <p className="kpi-value">{recommendationOverview.modelVersion}</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Clients Evalues</p>
              <p className="kpi-value">
                {recommendationOverview.evaluatedClients.toLocaleString()}
              </p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Taux Match Cible</p>
              <p className="kpi-value">{recommendationOverview.exactMatchRate}%</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Confiance Moyenne</p>
              <p className="kpi-value">{recommendationOverview.averageConfidence}%</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label">Confiance {">="} 75%</p>
              <p className="kpi-value">{recommendationOverview.highConfidenceRate}%</p>
            </div>
          </section>

          <div className="panel-head recommendation-offers-head">
            <h3>Offres Les Plus Predites Par Le Moteur</h3>
          </div>

          {recommendationOverview.topPredictedOffers.length ? (
            <div className="offer-chip-grid">
              {recommendationOverview.topPredictedOffers.map((offer) => (
                <article className="offer-chip" key={offer.offer}>
                  <p className="info-item-head">{offer.offer}</p>
                  <p className="info-item-meta">
                    {offer.count} clients ({offer.sharePercent}%)
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted">Aucune prediction disponible pour le moment.</p>
          )}

          <div className="source-links">
            <Link className="button" href="/dashboard/recommendation">
              Ouvrir le module de recommandation
            </Link>
          </div>
        </section>

        <section className="real-info-grid delay-3" data-reveal>
          <article className="panel info-card">
            <div className="panel-head">
              <h3>Faits Institutionnels</h3>
            </div>
            <ul className="info-list clean-list">
              {TT_PUBLIC_FACTS.map((fact) => (
                <li key={fact.label}>
                  <p className="info-item-head">{fact.label}</p>
                  <p className="info-item-meta">{fact.value}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel info-card">
            <div className="panel-head">
              <h3>Services Rapides MyTT</h3>
            </div>
            <ul className="info-list clean-list">
              {TT_QUICK_SERVICES.map((service) => (
                <li key={service.title}>
                  <p className="info-item-head">{service.title}</p>
                  <p className="info-item-meta">{service.detail}</p>
                  <a className="meta-link" href={service.url} target="_blank" rel="noreferrer">
                    Ouvrir le service
                  </a>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel info-card">
            <div className="panel-head">
              <h3>Forfaits Internet Mobile Publics</h3>
            </div>
            <ul className="info-list clean-list">
              {TT_MOBILE_DATA_OFFERS.map((offer) => (
                <li key={offer.title}>
                  <p className="info-item-head">{offer.title}</p>
                  <p className="info-item-meta">{offer.detail}</p>
                  <a className="meta-link" href={offer.url} target="_blank" rel="noreferrer">
                    Voir le forfait
                  </a>
                </li>
              ))}
            </ul>
          </article>

          <article className="panel info-card">
            <div className="panel-head">
              <h3>Solutions Entreprise</h3>
            </div>
            <ul className="info-list clean-list">
              {TT_BUSINESS_SOLUTIONS.map((solution) => (
                <li key={solution.title}>
                  <p className="info-item-head">{solution.title}</p>
                  <p className="info-item-meta">{solution.detail}</p>
                  <a className="meta-link" href={solution.url} target="_blank" rel="noreferrer">
                    Voir la solution
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="panel source-panel delay-3" data-reveal>
          <div className="panel-head">
            <h3>Actualites Tunisie Telecom 2026</h3>
          </div>
          <p className="panel-subtitle">
            Extraits des actualites publiques pour contextualiser le projet autour des
            evolutions reelles de l'operateur.
          </p>

          <ul className="info-list clean-list">
            {TT_LATEST_NEWS.map((news) => (
              <li key={news.title}>
                <p className="info-item-head">{news.title}</p>
                <p className="info-item-meta">{news.detail}</p>
                <a className="meta-link" href={news.url} target="_blank" rel="noreferrer">
                  Lire l'actualite
                </a>
              </li>
            ))}
          </ul>

          <div className="source-links">
            <a
              className="meta-link"
              href="https://www.tunisietelecom.tn/particulier/"
              target="_blank"
              rel="noreferrer"
            >
              Portail Particulier
            </a>
            <a
              className="meta-link"
              href="https://www.tunisietelecom.tn/entreprise/"
              target="_blank"
              rel="noreferrer"
            >
              Portail Entreprise
            </a>
            <a
              className="meta-link"
              href="https://www.tunisietelecom.tn/particulier/a-propos-de-tt/"
              target="_blank"
              rel="noreferrer"
            >
              A propos de TT
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
