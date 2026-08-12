/**
 * Direction artistique — Carnet de confiance.
 * Cette page traduit les contraintes métier de TontineBJ en une expérience lisible :
 * montants entiers en XOF, statuts vérifiables, actions mobiles et ton de proximité.
 */
import { Button } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Copy,
  CreditCard,
  Download,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Language = "fr" | "fon" | "yor";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const translations = {
  fr: {
    eyebrow: "La tontine numérique pensée au Bénin",
    title: "On avance mieux quand chacun tient sa part.",
    intro:
      "TontineBJ rend les contributions de groupe simples à rejoindre, claires à suivre et sûres à confirmer — directement depuis votre téléphone.",
    primary: "Explorer la démo",
    secondary: "Rejoindre la liste d’attente",
    dashboard: "Voir le tableau de bord",
  },
  fon: {
    eyebrow: "Tontine numérique ɖo Benɛ̃",
    title: "Mí ɖo ŋu ɖo nu, éɖe nɔ wá xɔ.",
    intro: "TontineBJ ɖo wémà kpo wémà ɖe asi, bo ɖo xɔxɔ ɖe wémà.",
    primary: "Nɔ dɔ̀n demo",
    secondary: "Nɔ ɖo listɛ",
    dashboard: "Nɔ dashboard",
  },
  yor: {
    eyebrow: "Tontine oni-nọmba ti a ṣe ni Benin",
    title: "A nlọ siwaju nigbati gbogbo eniyan ba ṣe tirẹ.",
    intro: "TontineBJ jẹ ki awọn idasi ẹgbẹ rọrun, han gbangba ati ailewu lati jẹrisi.",
    primary: "Wo demo",
    secondary: "Darapọ mọ atokọ",
    dashboard: "Wo dashboard",
  },
} as const;

const groups = [
  { name: "Famille Houédo", detail: "12 membres · Chaque semaine", amount: "8 500 XOF", progress: 76, tone: "green" },
  { name: "Cercle Akpakpa", detail: "8 membres · Chaque mois", amount: "15 000 XOF", progress: 42, tone: "yellow" },
  { name: "Les entrepreneures", detail: "10 membres · Tous les 15 jours", amount: "25 000 XOF", progress: 91, tone: "coral" },
];

const formatXof = (value: number) => `${new Intl.NumberFormat("fr-FR").format(value)} XOF`;

export default function Home() {
  const [language, setLanguage] = useState<Language>("fr");
  const [menuOpen, setMenuOpen] = useState(false);
  const [contribution, setContribution] = useState(68000);
  const [demoOpen, setDemoOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const dashboardRef = useRef<HTMLElement>(null);
  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language === "fr" ? "fr" : language === "fon" ? "fon" : "yo";
  }, [language]);

  useEffect(() => {
    const safariNavigator = window.navigator as Navigator & { standalone?: boolean };
    const standalone = window.matchMedia("(display-mode: standalone)").matches || safariNavigator.standalone === true;
    setIsStandalone(standalone);

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setIsStandalone(true);
      toast.success("TontineBJ est installée", { description: "Retrouvez la plateforme depuis votre écran d’accueil." });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const openDemo = () => {
    setDemoOpen(true);
    window.setTimeout(() => dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const simulateContribution = () => {
    setContribution((current) => Math.min(current + 8500, 102000));
    toast.success("Contribution simulée", {
      description: "Le statut passe en vérification avant confirmation par l’opérateur.",
    });
  };

  const handleInstall = async () => {
    if (isStandalone) return;
    if (!installPrompt) {
      toast.info("Installer TontineBJ", {
        description: "Sur Android : menu ⋮ puis « Installer l’application ». Sur iPhone : Partager puis « Sur l’écran d’accueil ».",
      });
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      toast.success("Installation lancée", { description: "TontineBJ sera bientôt disponible comme une application." });
    }
    setInstallPrompt(null);
  };

  const handleWaitlist = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      toast.error("Adresse à vérifier", { description: "Entrez une adresse e-mail valide pour continuer." });
      return;
    }
    setJoined(true);
    toast.success("Vous êtes sur la liste", { description: "Nous vous préviendrons avant la bêta à Parakou." });
  };

  return (
    <div className="site-shell">
      <div className="top-note">
        <span className="top-note__dot" />
        <span>Bêta fermée en préparation · Parakou</span>
        <button className="top-note__link" onClick={() => setWaitlistOpen(true)} type="button">
          Recevoir une invitation <ArrowRight size={14} />
        </button>
      </div>

      <header className="site-header">
        <a className="brand" href="#accueil" aria-label="TontineBJ, retour à l’accueil">
          <span className="brand__mark"><span>3</span></span>
          <span className="brand__name">Tontine<span>BJ</span></span>
        </a>
        <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`} aria-label="Navigation principale">
          <a href="#comment-ca-marche" onClick={() => setMenuOpen(false)}>Comment ça marche</a>
          <a href="#confiance" onClick={() => setMenuOpen(false)}>Notre promesse</a>
          <a href="#securite" onClick={() => setMenuOpen(false)}>Sécurité</a>
        </nav>
        <div className="header-actions">
          <label className="language-select">
            <span className="sr-only">Choisir la langue</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>
              <option value="fr">FR</option>
              <option value="fon">FON</option>
              <option value="yor">YOR</option>
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </label>
          {!isStandalone && <button className="install-button" onClick={handleInstall} type="button"><Download size={15} /><span>Installer</span></button>}
          <Button className="header-cta" onClick={() => setWaitlistOpen(true)}>Demander un accès</Button>
          <button className="menu-trigger" aria-label="Ouvrir le menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} type="button">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main id="accueil">
        <div className="journey-rail" aria-hidden="true"><span>01</span><i /><span>02</span><i /><span>03</span><i /><span>04</span></div>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow__line" />{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="hero-intro">{t.intro}</p>
            <div className="hero-actions">
              <Button className="button-primary" onClick={openDemo}>{t.primary}<ArrowDownRight size={18} /></Button>
              <button className="text-link" onClick={() => setWaitlistOpen(true)} type="button">{t.secondary}<ArrowRight size={17} /></button>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack" aria-hidden="true"><span>AM</span><span>KA</span><span>SD</span><span>+8</span></div>
              <p><strong>Déjà 3 200+</strong><br />personnes intéressées à Parakou</p>
            </div>
            <div className="hero-ledger"><span className="bj-seal bj-seal--tiny"><span>bj</span></span><div><span>Preuve de clarté</span><strong>Prochaine échéance · 8 500 XOF</strong></div><span className="ledger-status"><Check size={12} /> confirmée</span></div>
          </div>
          <div className="hero-art" aria-label="Illustration d’un carnet et d’un téléphone TontineBJ">
            <img src="/manus-storage/tontinebj-hero_b8217858.jpg" alt="Carnet, téléphone et objets du quotidien autour d’une tontine" />
            <div className="hero-art__caption"><span>01</span><span>Un même cercle.<br />Des objectifs qui avancent.</span></div>
            <div className="hero-art__stamp"><span>bj</span><small>confiance</small></div>
          </div>
          <div className="hero-side-note"><span>Scroll pour découvrir</span><ArrowDownRight size={17} /></div>
        </section>

        <section className="signal-strip" aria-label="Parcours TontineBJ">
          <div><span className="signal-number">01</span><strong>Rejoindre</strong><span>Un code, un cercle.</span></div>
          <div><span className="signal-number">02</span><strong>Suivre</strong><span>Une échéance lisible.</span></div>
          <div><span className="signal-number">03</span><strong>Confirmer</strong><span>Un statut vérifié.</span></div>
          <div><span className="signal-number">04</span><strong>Inviter</strong><span>Un groupe qui grandit.</span></div>
        </section>

        <section className="dashboard-section" id="comment-ca-marche" ref={dashboardRef}>
          <div className="section-kicker"><span>Une vue sur le quotidien</span><span className="kicker-line" /></div>
          <div className="dashboard-intro">
            <div>
              <h2>Votre groupe,<br /><em>enfin lisible.</em></h2>
            </div>
            <div className="dashboard-description"><p>Plus besoin de fouiller des messages pour savoir qui a payé. Le cycle, la prochaine échéance et votre part sont réunis sur un écran.</p><button className="arrow-button" onClick={() => setDemoOpen(true)} type="button">Ouvrir la démo <ArrowRight size={17} /></button></div>
          </div>

          <div className="dashboard-layout">
            <div className="phone-wrap">
              <div className="phone-top-label"><span className="live-dot" /> Démo interactive</div>
              <div className="phone-device">
                <div className="phone-camera" />
                <div className="phone-screen">
                  <div className="app-bar"><span className="bj-seal bj-seal--small"><span>bj</span></span><span>Mon espace</span><Bell size={17} /></div>
                  <div className="hello-row"><div><small>Bonjour, Aïcha</small><strong>On avance ensemble.</strong></div><div className="mini-avatar">AK</div></div>
                  <div className="balance-card"><div className="balance-top"><span>Dans mes groupes</span><MoreHorizontal size={17} /></div><strong>{formatXof(contribution)}</strong><div className="balance-bottom"><span>+ 8 500 XOF ce mois-ci</span><span className="positive">+14,2%</span></div></div>
                  <div className="phone-block-head"><strong>Prochaine échéance</strong><span>Voir tout</span></div>
                  <div className="due-card"><div className="due-icon"><Clock3 size={17} /></div><div><strong>Famille Houédo</strong><span>Vendredi 23 août · 8 500 XOF</span></div><span className="bj-seal bj-seal--micro"><span>bj</span></span><ArrowRight size={17} /></div>
                  <div className="phone-block-head"><strong>Activité récente</strong><span>Cette semaine</span></div>
                  <div className="activity"><div className="activity-icon activity-icon--green"><span className="activity-seal"><Check size={12} /></span></div><div><strong>Contribution confirmée</strong><span>Famille Houédo · Aujourd’hui</span></div><b>+8 500</b></div>
                  <div className="activity"><div className="activity-icon activity-icon--yellow"><Users size={16} /></div><div><strong>Nouveau membre</strong><span>Cercle Akpakpa · Hier</span></div><b className="muted">—</b></div>
                  <nav className="phone-nav"><span className="phone-nav__active"><WalletCards size={18} /><small>Accueil</small></span><span><Users size={18} /><small>Groupes</small></span><span><CreditCard size={18} /><small>Paiements</small></span><span><CircleHelp size={18} /><small>Aide</small></span></nav>
                </div>
              </div>
            </div>
            <div className="dashboard-content">
              <div className="dashboard-image-card"><img src="/manus-storage/tontinebj-phone_a87d308c.jpg" alt="Aperçu abstrait de l’application mobile TontineBJ" /><div className="image-card-note"><span className="note-pin" />Une interface pensée pour les écrans du quotidien.</div></div>
              <div className="group-list-card"><div className="card-heading"><div><span className="card-label">Mes cercles actifs</span><h3>Les groupes qui avancent</h3></div><button type="button" onClick={() => toast.info("La création de groupe arrive bientôt.")} aria-label="Ajouter un groupe"><Plus size={19} /></button></div>{groups.map((group) => <div className="group-row" key={group.name}><div className={`group-avatar group-avatar--${group.tone}`}>{group.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}</div><div className="group-row__main"><div className="group-row__title"><strong>{group.name}</strong><span>{group.amount}</span></div><span className="group-row__detail">{group.detail}</span><div className="progress-track"><span className={`progress-fill progress-fill--${group.tone}`} style={{ width: `${group.progress}%` }} /></div></div><span className="group-percent">{group.progress}%</span></div>)}</div>
            </div>
          </div>
          <div className="demo-actions"><Button className="button-primary button-primary--small" onClick={simulateContribution}><Sparkles size={16} />Simuler une contribution</Button><span>La simulation ne déclenche aucun paiement réel.</span></div>
        </section>

        <section className="trust-section" id="confiance">
          <div className="trust-art"><img src="/manus-storage/tontinebj-community_ccefad2e.jpg" alt="Des proches réunis autour d’un objectif commun" /><div className="trust-art__badge"><span className="bj-seal bj-seal--medium"><span>bj</span></span><span>Confiance<br /><strong>visible</strong></span></div></div>
          <div className="trust-copy"><div className="section-kicker"><span>Notre promesse</span><span className="kicker-line" /></div><h2>La technologie<br />ne remplace pas<br /><em>la confiance.</em></h2><p>Elle lui donne simplement un endroit où se voir. Chaque membre sait ce qui est attendu, ce qui est confirmé et ce qui vient ensuite.</p><div className="trust-points"><div><span>01</span><p><strong>Pas de solde hébergé</strong><br />Les transferts restent directs entre opérateurs.</p></div><div><span>02</span><p><strong>Un statut qui veut dire quelque chose</strong><br />La confirmation arrive après vérification.</p></div></div><button className="text-link text-link--dark" onClick={() => document.getElementById("securite")?.scrollIntoView({ behavior: "smooth" })} type="button">Comprendre notre sécurité <ArrowRight size={17} /></button></div>
        </section>

        <section className="security-section" id="securite">
          <div className="security-heading"><div className="section-kicker"><span>Conçue pour durer</span><span className="kicker-line" /></div><h2>Une petite équipe.<br /><em>Des garde-fous sérieux.</em></h2></div>
          <div className="security-grid"><div className="security-card security-card--highlight"><span className="security-seal">bj</span><LockKeyhole size={21} /><span className="security-index">01 / Paiements</span><h3>Chaque transaction laisse une trace vérifiable.</h3><p>Un identifiant unique et une confirmation opérateur protègent chaque contribution.</p><a href="#accueil">Notre approche <ArrowRight size={16} /></a></div><div className="security-card"><span className="security-seal">bj</span><ShieldCheck size={21} /><span className="security-index">02 / Données</span><h3>Vos informations restent à leur place.</h3><p>Les numéros sont chiffrés et jamais exposés dans les journaux techniques.</p><a href="#accueil">En savoir plus <ArrowRight size={16} /></a></div><div className="security-card"><span className="security-seal">bj</span><Download size={21} /><span className="security-index">03 / Offline</span><h3>Lire même quand le réseau hésite.</h3><p>Les informations essentielles restent disponibles pendant 24 h, en lecture seule.</p><a href="#accueil">Voir le fonctionnement <ArrowRight size={16} /></a></div></div>
        </section>

        <section className="waitlist-section"><div className="waitlist-content"><div className="waitlist-sun" /><span className="waitlist-label">Prochaine étape</span><h2>Votre cercle existe déjà.<br /><em>Donnez-lui un rythme.</em></h2><p>Rejoignez la liste d’attente et recevez une invitation pour la bêta à Parakou.</p><Button className="button-dark" onClick={() => setWaitlistOpen(true)}>Demander une invitation <ArrowRight size={18} /></Button></div><div className="waitlist-stamp"><span>bj</span><small>ensemble<br />c’est plus clair</small></div></section>
      </main>

      <footer className="site-footer"><a className="brand brand--footer" href="#accueil"><span className="brand__mark"><span>3</span></span><span className="brand__name">Tontine<span>BJ</span></span></a><p>La tontine numérique pensée au Bénin.</p><div className="footer-links"><a href="#comment-ca-marche">Comment ça marche</a><a href="#securite">Sécurité</a><a href="#accueil">Mentions légales</a></div><span className="footer-copy">© 2026 TontineBJ</span></footer>

      {waitlistOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setWaitlistOpen(false); }}><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="waitlist-title"><button className="modal-close" aria-label="Fermer" onClick={() => setWaitlistOpen(false)} type="button"><X size={19} /></button><span className="modal-kicker">Bêta TontineBJ</span><h2 id="waitlist-title">Un pas avant le premier cercle.</h2><p>Laissez votre e-mail. Nous vous écrirons quand les premiers groupes pourront ouvrir leur cycle.</p>{joined ? <div className="joined-state"><span><Check size={19} /></span><strong>Demande enregistrée.</strong><p>À bientôt autour d’une contribution.</p></div> : <form onSubmit={handleWaitlist}><label htmlFor="email">Votre adresse e-mail</label><div className="email-field"><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com" autoFocus /><button type="submit" aria-label="Envoyer ma demande"><ArrowRight size={19} /></button></div><small>Pas de spam. Une invitation quand ce sera votre tour.</small></form>}<div className="modal-note"><LockKeyhole size={14} /> Vos données restent confidentielles.</div></div></div>}
      {demoOpen && <button className="demo-pill" onClick={() => setDemoOpen(false)} type="button"><span className="live-dot" /> Démo active <X size={14} /></button>}
    </div>
  );
}
