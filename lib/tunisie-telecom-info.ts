export interface TunisieTelecomInfoItem {
  title: string;
  detail: string;
  url: string;
}

export const TT_PUBLIC_FACTS: ReadonlyArray<{ label: string; value: string }> = [
  {
    label: "Creation officielle",
    value: "17 avril 1995 (Office national des telecommunications)",
  },
  {
    label: "Premiere ligne GSM",
    value: "20 mars 1998",
  },
  {
    label: "Signature de marque",
    value: "La vie est emotions (identite visuelle depuis 2016)",
  },
  {
    label: "Assistance Particulier",
    value: "1298 / 71 001 298",
  },
  {
    label: "Assistance Entreprise",
    value: "1288 / 71 001 288",
  },
];

export const TT_QUICK_SERVICES: ReadonlyArray<TunisieTelecomInfoItem> = [
  {
    title: "Achat Internet",
    detail: "Achat de forfait internet mobile",
    url: "https://mytt.tunisietelecom.tn/internet/achat-forfait",
  },
  {
    title: "Recharge TT Cash",
    detail: "Recharge et operations via TT Cash",
    url: "https://mytt.tunisietelecom.tn/anonymous/ttcash#",
  },
  {
    title: "Ehdia Net",
    detail: "Transfert de forfait internet entre clients",
    url: "https://mytt.tunisietelecom.tn/topup-options/hdianet-option#",
  },
  {
    title: "Internet Sabba",
    detail: "Options internet flexibles",
    url: "https://mytt.tunisietelecom.tn/topup/sabba#",
  },
  {
    title: "Paiement Factures",
    detail: "Paiement en ligne des factures",
    url: "https://mytt.tunisietelecom.tn/anonymous/paiement-facture#",
  },
];

export const TT_MOBILE_DATA_OFFERS: ReadonlyArray<TunisieTelecomInfoItem> = [
  {
    title: "200 Go",
    detail: "100 DT - validite 60 jours",
    url: "https://mytt.tunisietelecom.tn/internet/achat-forfait",
  },
  {
    title: "45 Go",
    detail: "50 DT - validite 30 jours",
    url: "https://mytt.tunisietelecom.tn/internet/achat-forfait",
  },
  {
    title: "25 Go",
    detail: "30 DT - validite 30 jours",
    url: "https://mytt.tunisietelecom.tn/internet/achat-forfait",
  },
  {
    title: "4 Go",
    detail: "10 DT - validite 30 jours",
    url: "https://mytt.tunisietelecom.tn/internet/achat-forfait",
  },
  {
    title: "1.5 Go",
    detail: "6 DT - validite 30 jours",
    url: "https://mytt.tunisietelecom.tn/internet/achat-forfait",
  },
  {
    title: "650 Mo",
    detail: "3 DT - validite 7 jours",
    url: "https://mytt.tunisietelecom.tn/internet/achat-forfait",
  },
];

export const TT_BUSINESS_SOLUTIONS: ReadonlyArray<TunisieTelecomInfoItem> = [
  {
    title: "Smart Lights",
    detail: "Solution de pilotage d'eclairage connecte",
    url: "https://www.tunisietelecom.tn/entreprise/smart-solutions/smart-solutions/smartlights/",
  },
  {
    title: "TT Cloud PBX",
    detail: "Telephonie cloud pour entreprises",
    url: "https://www.tunisietelecom.tn/entreprise/business-solutions/fixe/professionnel/cloudpbx/",
  },
  {
    title: "Business Tawa",
    detail: "Offre business digitale pour pros",
    url: "https://www.tunisietelecom.tn/entreprise/business-tawa/infos-actualites/",
  },
];

export const TT_LATEST_NEWS: ReadonlyArray<TunisieTelecomInfoItem> = [
  {
    title: "Lancement Kashy",
    detail: "18/03/2026 - nouvelle application de paiement mobile",
    url: "https://www.tunisietelecom.tn/particulier/actualite/tunisie-telecom-lance-kashy/",
  },
  {
    title: "Resultats offres de recrutement",
    detail: "10/03/2026 - listes complementaires",
    url: "https://www.tunisietelecom.tn/particulier/actualite/offre24/",
  },
  {
    title: "Club Pionnier 2.0",
    detail: "05/03/2026 - participation transformation numerique",
    url: "https://www.tunisietelecom.tn/particulier/actualite/tunisie-telecom-participe-au-club-pionnier-20-de-transformation-numerique/",
  },
];
