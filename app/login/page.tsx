"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState("/");

  useEffect(() => {
    const queryNext = new URLSearchParams(window.location.search).get("next");
    if (queryNext && queryNext.startsWith("/")) {
      setNextPath(queryNext);
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(payload.error ?? "Login failed.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-wrap">
      <section className="login-shell" data-reveal>
        <aside className="login-brand">
          <Image
            src="/tunisie-telecom-logo.svg"
            alt="Tunisie Telecom logo"
            width={146}
            height={95}
            className="login-logo"
            priority
          />
          <p className="eyebrow">Tunisie Telecom - Zone securisee</p>
          <h1>Acces au cockpit BI PFE pour le pilotage telecom.</h1>
          <p>
            Connectez-vous pour analyser les usages clients, la performance des
            forfaits internet/mobile et les tendances de revenu voix-data-SMS.
          </p>

          <ul className="login-points">
            <li>Suivi des KPIs ARPU, volume data et transactions</li>
            <li>Analyse des offres TT (forfaits internet et mixte)</li>
            <li>Recommandation d'offre avec score de confiance</li>
          </ul>
        </aside>

        <section className="login-panel">
          <p className="eyebrow">Acces Operateur</p>
          <h2>Connexion a la plateforme</h2>
          <p className="muted">
            Saisissez vos identifiants pour acceder a l'espace d'analyse TT.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error ? <p className="error">{error}</p> : null}

            <button className="button full" disabled={loading} type="submit">
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <p className="login-meta">Utilisez les identifiants definis dans .env.local.</p>
        </section>
      </section>
    </main>
  );
}
