import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient'; // Importation de la connexion cloud

// --- CONFIGURATION DES GROUPES (Identique) ---
const CONFIG_GROUPES = [
  { id: 'A', nom: 'Groupe A', equipes: ['MEXIQUE', 'AFRIQUE DU SUD', 'REP. DE COREE', 'TCHEQUIE'], calendrier: ['11 juin - 21h', '12 juin - 4h', '18 juin - 18h', '19 juin - 3h', '25 juin - 3h', '25 juin - 3h'], couleur: 'border-emerald-500/20', texte: 'text-emerald-400' },
  { id: 'B', nom: 'Groupe B', equipes: ['CANADA', 'BOSNIE', 'QUATAR', 'SUISSE'], calendrier: ['12 juin - 21h', '13 juin - 21h', '18 juin - 21h', '19 juin - 00h', '24 juin - 21h', '24 juin - 21h'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'C', nom: 'Groupe C', equipes: ['BRESIL', 'MAROC', 'HAITI', 'ECOSSE'], calendrier: ['14 juin - 0h', '14 juin - 3h', '20 juin - 0h', '20 juin - 2h30', '25 juin - 0h', '25 juin - 0h'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'D', nom: 'Groupe D', equipes: ['ETATS-UNIS', 'PARAGUAY', 'AUSTRALIE', 'TURQUIE'], calendrier: ['13 juin - 3h', '14 juin - 6h', '19 juin - 21h', '20 juin - 5h', '26 juin - 4h', '26 juin - 4h'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'E', nom: 'Groupe E', equipes: ['ALLEMAGNE', 'CURACAO', 'COTE IVOIRE', 'EQUATEUR'], calendrier: ['14 juin - 19h', '15 juin - 1h', '20 juin - 22h', '21 juin - 2h', '25 juin - 22h', '25 juin - 22h'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'F', nom: 'Groupe F', equipes: ['PAYS BAS', 'JAPON', 'SUEDE', 'TUNISIE'], calendrier: ['14 juin - 22h', '15 juin - 4h', '20 juin - 19h', '21 juin - 6h', '26 juin - 1h', '26 juin - 1h'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'G', nom: 'Groupe G', equipes: ['BELGIQUE', 'EGYPTE', 'IRAN', 'NOUVELLE ZELANDE'], calendrier: ['15 juin - 21h', '16 juin - 3h', '21 juin - 21h', '22 juin - 3h', '27 juin - 5h', '27 juin - 5h'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'H', nom: 'Groupe H', equipes: ['ESPAGNE', 'CAP VERT', 'ARABIE SAOUDITE', 'URUGUAY'], calendrier: ['15 juin - 18h', '16 juin - 0h', '21 juin - 18h', '22 juin - 0h', '27 juin - 2h', '27 juin - 2h'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'I', nom: 'Groupe I', equipes: ['FRANCE', 'SENEGAL', 'IRAK', 'NORVEGE'], calendrier: ['16 juin - 21', '17 juin - 0h', '22 juin - 23h', '23 juin - 2h', '26 juin - 21h', '26 juin - 21h'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'J', nom: 'Groupe J', equipes: ['ARGENTINE', 'ALGERIE', 'AUTRICHE', 'JORDANIE'], calendrier: ['17 juin - 3h', '17 juin - 6h', '22 juin - 19h', '23 juin - 5h', '28 juin - 4h', '28 juin - 4h'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'K', nom: 'Groupe K', equipes: ['PORTUGAL', 'RD CONGO', 'OUZBEKISTAN', 'COLOMBIE'], calendrier: ['17 juin - 19h', '18 juin - 4h', '23 juin - 19h', '24 juin - 4h', '28 juin - 1h30', '28 juin - 1h30'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'L', nom: 'Groupe L', equipes: ['ANGLETERRE', 'CROATIE', 'GHANA', 'PANAMA'], calendrier: ['17 juin - 22h', '18 juin - 1h', '23 juin - 22h', '24 juin - 1h', '27 juin - 23h', '27 juin - 23h'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
];

// --- LOGIQUE DE RANG (Identique) ---
const getRank = (matches, teams) => {
  let r = teams.map(n => ({ name: n, pts: 0, diff: 0 }));
  matches.forEach(m => {
    if (m.s1 !== undefined && m.s2 !== undefined && m.s1 !== "" && m.s2 !== "") {
      const s1 = parseInt(m.s1, 10), s2 = parseInt(m.s2, 10);
      const t1 = r.find(x => x.name === m.t1), t2 = r.find(x => x.name === m.t2);
      if (t1 && t2) {
        t1.diff += (s1 - s2); t2.diff += (s2 - s1);
        if (s1 > s2) t1.pts += 3; else if (s2 > s1) t2.pts += 3; else { t1.pts += 1; t2.pts += 1; }
      }
    }
  });
  return r.sort((a, b) => b.pts - a.pts || b.diff - a.diff);
};

// --- COMPOSANT MATCH (Identique) ---
function MatchBox({ id, t1, t2, scores, up, color }) {
  const s1 = scores[`m${id}s1`];
  const s2 = scores[`m${id}s2`];
  const isDraw = s1 !== undefined && s2 !== undefined && s1 !== "" && s2 !== "" && parseInt(s1) === parseInt(s2);
  return (
    <div className="relative mb-4 w-52 flex-shrink-0">
      <div className={`bg-gray-900 border-l-4 ${color} rounded-xl shadow-2xl overflow-hidden border border-white/5`}>
        <div className="bg-black/60 text-[8px] px-3 py-1 text-gray-400 font-black uppercase tracking-widest flex justify-between">
          <span>Match {id}</span>
          {isDraw && <span className="text-amber-500 animate-pulse text-[7px] font-bold">Pénos</span>}
        </div>
        <div className="p-3">
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex justify-between items-center gap-3">
              <span className="text-[10px] font-black text-white uppercase truncate flex-1 italic">{t1}</span>
              <input type="number" value={scores[`m${id}s1`] ?? ""} onChange={(e) => up(`m${id}s1`, e.target.value)} className="w-10 h-8 bg-black border border-gray-700 rounded-lg text-center text-sm font-bold text-white outline-none focus:border-emerald-500" placeholder="-" />
            </div>
            {isDraw && (
              <div className="flex justify-end items-center gap-2 pr-1">
                <span className="text-[6px] text-amber-500 font-bold">TAB</span>
                <input type="number" value={scores[`m${id}p1`] ?? ""} onChange={(e) => up(`m${id}p1`, e.target.value)} className="w-8 h-7 bg-amber-500/5 border border-amber-500/40 text-center text-xs font-bold text-amber-500 rounded-md outline-none" placeholder="P" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center gap-3">
              <span className="text-[10px] font-black text-white uppercase truncate flex-1 italic">{t2}</span>
              <input type="number" value={scores[`m${id}s2`] ?? ""} onChange={(e) => up(`m${id}s2`, e.target.value)} className="w-10 h-8 bg-black border border-gray-700 rounded-lg text-center text-sm font-bold text-white outline-none focus:border-emerald-500" placeholder="-" />
            </div>
            {isDraw && (
              <div className="flex justify-end items-center gap-2 pr-1">
                <span className="text-[6px] text-amber-500 font-bold">TAB</span>
                <input type="number" value={scores[`m${id}p2`] ?? ""} onChange={(e) => up(`m${id}p2`, e.target.value)} className="w-8 h-7 bg-amber-500/5 border border-amber-500/40 text-center text-xs font-bold text-amber-500 rounded-md outline-none" placeholder="P" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('poules');
  const scrollRef = useRef(null);
  const [scores, setScores] = useState({});
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('wc_user') || "");
  const [allPredictions, setAllPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Charger les pronostics de TOUT LE MONDE depuis Supabase
  const loadCloudData = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('predictions').select('*');
    if (!error) setAllPredictions(data);
    setLoading(false);
  };

  useEffect(() => { loadCloudData(); }, []);

  // 2. Sauvegarder ses propres pronos dans le Cloud
  const saveToCloud = async () => {
    if (!currentUser) return alert("Choisis un nom dans l'onglet Participants d'abord !");
    setLoading(true);
    const winner = getWinner("104", "Team 1", "Team 2", "Inconnu");
    const { error } = await supabase.from('predictions').upsert({ 
      user_name: currentUser, 
      match_data: scores,
      winner_name: winner
    }, { onConflict: 'user_name' });
    
    if (error) alert("Erreur : " + error.message);
    else {
      alert("Pronostics sauvegardés dans le Cloud !");
      loadCloudData();
    }
    setLoading(false);
  };

  // 3. Voir les pronos d'un collègue
  const viewUserProno = (user) => {
    setScores(user.match_data || {});
    setTab('tableau');
    alert(`Affichage des pronostics de : ${user.user_name}`);
  };

  const up = (k, v) => {
    const val = (v === "" || isNaN(parseInt(v))) ? undefined : parseInt(v, 10);
    setScores(p => ({ ...p, [k]: val }));
  };

  const getWinner = (matchId, t1Name, t2Name, label) => {
    const s1 = scores[`m${matchId}s1`], s2 = scores[`m${matchId}s2`];
    if (s1 === undefined || s2 === undefined || s1 === "") return label;
    if (parseInt(s1) > parseInt(s2)) return t1Name;
    if (parseInt(s1) < parseInt(s2)) return t2Name;
    const p1 = scores[`m${matchId}p1`], p2 = scores[`m${matchId}p2`];
    if (p1 === undefined || p2 === undefined || p1 === p2) return label;
    return parseInt(p1) > parseInt(p2) ? t1Name : t2Name;
  };

  const getQualifie = (groupId, rang) => {
    const grp = CONFIG_GROUPES.find(g => g.id === groupId);
    const m = [
      { t1: grp.equipes[0], t2: grp.equipes[1], s1: scores[`g${groupId}1`], s2: scores[`g${groupId}2`] },
      { t1: grp.equipes[2], t2: grp.equipes[3], s1: scores[`g${groupId}3`], s2: scores[`g${groupId}4`] },
      { t1: grp.equipes[0], t2: grp.equipes[2], s1: scores[`g${groupId}5`], s2: scores[`g${groupId}6`] },
      { t1: grp.equipes[1], t2: grp.equipes[3], s1: scores[`g${groupId}7`], s2: scores[`g${groupId}8`] },
      { t1: grp.equipes[3], t2: grp.equipes[0], s1: scores[`g${groupId}9`], s2: scores[`g${groupId}10`] },
      { t1: grp.equipes[1], t2: grp.equipes[2], s1: scores[`g${groupId}11`], s2: scores[`g${groupId}12`] },
    ];
    const ranking = getRank(m, grp.equipes);
    return m.some(match => match.s1 !== undefined) ? ranking[rang].name : `${rang + 1}${groupId}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 font-sans relative overflow-x-hidden">
      
      {/* HEADER AVEC BOUTON CLOUD */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-black italic text-emerald-400 uppercase mb-4 tracking-tighter">Pronostic CDM 2026</h1>
        {currentUser && (
          <button 
            onClick={saveToCloud}
            disabled={loading}
            className="bg-emerald-500 text-black px-6 py-2 rounded-full font-black text-xs uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            {loading ? "Chargement..." : `☁️ Enregistrer pour ${currentUser}`}
          </button>
        )}
      </div>

      <div className="flex justify-center mb-10 bg-gray-900 w-fit mx-auto p-1 rounded-xl border border-gray-800">
        <button onClick={() => setTab('poules')} className={`px-6 py-2 rounded-lg text-xs font-bold transition ${tab === 'poules' ? 'bg-emerald-500 text-black' : 'text-gray-400'}`}>MATCHS DE GROUPE</button>
        <button onClick={() => setTab('tableau')} className={`px-6 py-2 rounded-lg text-xs font-bold transition ${tab === 'tableau' ? 'bg-purple-500 text-black' : 'text-gray-400'}`}>PHASE FINALE</button>
        <button onClick={() => setTab('participants')} className={`px-6 py-2 rounded-lg text-xs font-bold transition ${tab === 'participants' ? 'bg-amber-500 text-black' : 'text-gray-400'}`}>CLASSEMENT</button>
      </div>

      {tab === 'participants' ? (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="bg-gray-900/80 p-6 rounded-3xl border border-amber-500/20">
            <h2 className="text-amber-500 font-black uppercase text-center mb-6">Pronostics des Collègues</h2>
            
            {/* INPUT POUR S'INSCRIRE */}
            {!currentUser && (
              <div className="flex gap-2 mb-8">
                <input id="nameInput" type="text" placeholder="TON PRÉNOM..." className="flex-1 bg-black border border-gray-700 rounded-xl px-4 text-white font-bold uppercase outline-none focus:border-amber-500" />
                <button onClick={() => {
                  const val = document.getElementById('nameInput').value;
                  if(val) { setCurrentUser(val.toUpperCase()); localStorage.setItem('wc_user', val.toUpperCase()); }
                }} className="bg-amber-500 text-black px-6 py-3 rounded-xl font-black text-xs uppercase">OK</button>
              </div>
            )}

            <div className="space-y-3">
              {allPredictions.map((u, i) => (
                <div key={i} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 group hover:border-amber-500/30 transition-all">
                  <div>
                    <div className="font-black uppercase text-white tracking-wider">{u.user_name}</div>
                    <div className="text-[10px] text-amber-500/70 font-bold uppercase italic">Champion : {u.winner_name || "?"}</div>
                  </div>
                  <button onClick={() => viewUserProno(u)} className="bg-white/5 hover:bg-white/10 text-[10px] font-black px-4 py-2 rounded-lg uppercase transition-all">👀 Voir</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ... Reste de l'affichage (Poules ou Tableau) ... */
        /* Note: J'ai raccourci ici pour le message, mais garde ton code d'affichage des MatchBox et Groupes tel quel */
        <div className="relative group max-w-full overflow-x-auto pb-20">
           {/* Ton code existant pour le rendu des poules et du tableau vient ici */}
           <p className="text-center text-gray-500 text-xs italic">Utilise ton code d'affichage habituel ici</p>
        </div>
      )}
    </div>
  );
}