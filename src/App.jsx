import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

// --- CONFIGURATION DES GROUPES ---
const CONFIG_GROUPES = [
  { id: 'A', nom: 'Groupe A', equipes: ['MEXIQUE', 'AFRIQUE DU SUD', 'REP. DE COREE', 'TCHEQUIE'], couleur: 'border-emerald-500/20', texte: 'text-emerald-400' },
  { id: 'B', nom: 'Groupe B', equipes: ['CANADA', 'BOSNIE', 'QUATAR', 'SUISSE'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'C', nom: 'Groupe C', equipes: ['BRESIL', 'MAROC', 'HAITI', 'ECOSSE'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'D', nom: 'Groupe D', equipes: ['ETATS-UNIS', 'PARAGUAY', 'AUSTRALIE', 'TURQUIE'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'E', nom: 'Groupe E', equipes: ['ALLEMAGNE', 'CURACAO', 'COTE IVOIRE', 'EQUATEUR'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'F', nom: 'Groupe F', equipes: ['PAYS BAS', 'JAPON', 'SUEDE', 'TUNISIE'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'G', nom: 'Groupe G', equipes: ['BELGIQUE', 'EGYPTE', 'IRAN', 'NOUVELLE ZELANDE'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'H', nom: 'Groupe H', equipes: ['ESPAGNE', 'CAP VERT', 'ARABIE SAOUDITE', 'URUGUAY'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'I', nom: 'Groupe I', equipes: ['FRANCE', 'SENEGAL', 'IRAK', 'NORVEGE'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'J', nom: 'Groupe J', equipes: ['ARGENTINE', 'ALGERIE', 'AUTRICHE', 'JORDANIE'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'K', nom: 'Groupe K', equipes: ['PORTUGAL', 'RD CONGO', 'OUZBEKISTAN', 'COLOMBIE'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
  { id: 'L', nom: 'Groupe L', equipes: ['ANGLETERRE', 'CROATIE', 'GHANA', 'PANAMA'], couleur: 'border-blue-500/20', texte: 'text-blue-400' },
];

// --- LOGIQUE DE CALCUL DU CLASSEMENT ---
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

// --- COMPOSANT MATCH PHASE FINALE ---
function MatchBox({ id, t1, t2, scores, up, color }) {
  const s1 = scores[`m${id}s1`];
  const s2 = scores[`m${id}s2`];
  const isDraw = s1 !== undefined && s2 !== undefined && s1 !== "" && s2 !== "" && parseInt(s1) === parseInt(s2);
  
  return (
    <div className="relative mb-4 w-52 flex-shrink-0 text-left">
      <div className={`bg-gray-900 border-l-4 ${color} rounded-xl shadow-2xl border border-white/5`}>
        <div className="bg-black/60 text-[8px] px-3 py-1 text-gray-400 font-black uppercase tracking-widest flex justify-between">
          <span>Match {id}</span>
          {isDraw && <span className="text-amber-500 animate-pulse text-[7px] font-bold italic">TAB</span>}
        </div>
        <div className="p-3 space-y-2">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[10px] font-black text-white uppercase truncate flex-1 italic">{t1}</span>
              <input type="number" value={scores[`m${id}s1`] ?? ""} onChange={(e) => up(`m${id}s1`, e.target.value)} className="w-9 h-8 bg-black border border-gray-700 rounded text-center text-sm font-bold text-white outline-none focus:border-emerald-500" placeholder="-" />
            </div>
            {isDraw && <input type="number" value={scores[`m${id}p1`] ?? ""} onChange={(e) => up(`m${id}p1`, e.target.value)} className="w-8 h-7 bg-amber-500/5 border border-amber-500/40 text-center text-xs font-bold text-amber-500 rounded ml-auto" placeholder="P" />}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[10px] font-black text-white uppercase truncate flex-1 italic">{t2}</span>
              <input type="number" value={scores[`m${id}s2`] ?? ""} onChange={(e) => up(`m${id}s2`, e.target.value)} className="w-9 h-8 bg-black border border-gray-700 rounded text-center text-sm font-bold text-white outline-none focus:border-emerald-500" placeholder="-" />
            </div>
            {isDraw && <input type="number" value={scores[`m${id}p2`] ?? ""} onChange={(e) => up(`m${id}p2`, e.target.value)} className="w-8 h-7 bg-amber-500/5 border border-amber-500/40 text-center text-xs font-bold text-amber-500 rounded ml-auto" placeholder="P" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('poules');
  const [scores, setScores] = useState({});
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('wc_user') || "");
  const [allPredictions, setAllPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // --- CHARGEMENT DES DONNÉES CLOUD ---
  const loadCloudData = async () => {
    try {
      const { data, error } = await supabase.from('predictions').select('*');
      if (data) setAllPredictions(data);
    } catch (e) { console.error("Erreur de chargement", e); }
  };

  useEffect(() => { loadCloudData(); }, []);

  // --- SAUVEGARDE CLOUD ---
  const saveToCloud = async () => {
    if (!currentUser) return alert("Inscris ton nom dans 'Classement' !");
    setLoading(true);
    const { error } = await supabase.from('predictions').upsert({ 
      user_name: currentUser, 
      match_data: scores,
      winner_name: "À déterminer"
    }, { onConflict: 'user_name' });
    
    if (error) alert(error.message);
    else { alert("Pronostics sauvegardés avec succès !"); loadCloudData(); }
    setLoading(false);
  };

  const up = (k, v) => {
    const val = v === "" ? undefined : parseInt(v, 10);
    setScores(p => ({ ...p, [k]: val }));
  };

  const getQualifie = (groupId, rang) => {
    const grp = CONFIG_GROUPES.find(g => g.id === groupId);
    const matches = [
      { t1: grp.equipes[0], t2: grp.equipes[1], s1: scores[`g${groupId}1`], s2: scores[`g${groupId}2`] },
      { t1: grp.equipes[2], t2: grp.equipes[3], s1: scores[`g${groupId}3`], s2: scores[`g${groupId}4`] },
    ];
    const ranking = getRank(matches, grp.equipes);
    return ranking[rang].name;
  };

  const handleScroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 font-sans text-center selection:bg-emerald-500 selection:text-black">
      
      <header className="mb-8">
        <h1 className="text-3xl font-black italic text-emerald-400 uppercase tracking-tighter mb-2">Pronostic CDM 2026</h1>
        {currentUser && (
          <button onClick={saveToCloud} disabled={loading} className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
            {loading ? "Chargement..." : `☁️ Enregistrer (Session : ${currentUser})`}
          </button>
        )}
      </header>

      {/* NAVIGATION PRINCIPALE */}
      <nav className="flex justify-center mb-10 bg-gray-900 w-fit mx-auto p-1 rounded-xl border border-gray-800 shadow-2xl">
        <button onClick={() => setTab('poules')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'poules' ? 'bg-emerald-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>MATCHS DE GROUPE</button>
        <button onClick={() => setTab('tableau')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'tableau' ? 'bg-purple-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>PHASE FINALE</button>
        <button onClick={() => setTab('classement')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'classement' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>CLASSEMENT</button>
      </nav>

      <main className="max-w-full">
        {/* ONGLET 1 : GROUPES */}
        {tab === 'poules' && (
          <div className="relative group">
            <button onClick={() => handleScroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-3 rounded-full hidden md:block">❮</button>
            <button onClick={() => handleScroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-3 rounded-full hidden md:block">❯</button>
            <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-10 px-4 scrollbar-hide">
              {CONFIG_GROUPES.map(g => (
                <div key={g.id} className={`w-72 bg-gray-900/40 p-5 rounded-3xl border-2 ${g.couleur} flex-shrink-0 backdrop-blur-sm`}>
                  <h3 className={`${g.texte} font-black mb-4 uppercase text-xs italic tracking-widest`}>{g.nom}</h3>
                  <div className="space-y-3">
                    {[1, 3, 5, 7, 9, 11].map((n, i) => (
                      <div key={n} className="flex items-center justify-between bg-black/30 p-2 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold w-12 truncate text-left">{g.equipes[i % 4]}</span>
                        <div className="flex gap-1">
                          <input type="number" value={scores[`g${g.id}${n}`] ?? ""} onChange={e => up(`g${g.id}${n}`, e.target.value)} className="w-8 h-8 bg-black border border-gray-700 text-center rounded text-xs text-white" />
                          <input type="number" value={scores[`g${g.id}${n+1}`] ?? ""} onChange={e => up(`g${g.id}${n+1}`, e.target.value)} className="w-8 h-8 bg-black border border-gray-700 text-center rounded text-xs text-white" />
                        </div>
                        <span className="text-[9px] font-bold w-12 truncate text-right">{g.equipes[(i+1) % 4]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 2 : PHASE FINALE */}
        {tab === 'tableau' && (
          <div className="flex gap-12 overflow-x-auto pb-20 px-10 justify-start md:justify-center min-w-max">
            <div className="space-y-8 flex flex-col justify-center">
              <MatchBox id="73" t1={getQualifie('A', 0)} t2="2B" scores={scores} up={up} color="border-blue-500" />
              <MatchBox id="74" t1={getQualifie('C', 0)} t2="2D" scores={scores} up={up} color="border-blue-500" />
            </div>
            <div className="flex flex-col justify-center">
              <MatchBox id="89" t1="V. 73" t2="V. 74" scores={scores} up={up} color="border-purple-500" />
            </div>
            <div className="flex flex-col justify-center items-center gap-6">
               <div className="bg-amber-500/10 border-2 border-amber-500 p-8 rounded-full shadow-2xl">
                 <span className="text-amber-500 font-black italic uppercase text-2xl">FINALE</span>
               </div>
               <MatchBox id="104" t1="Finaliste 1" t2="Finaliste 2" scores={scores} up={up} color="border-amber-500" />
            </div>
          </div>
        )}

        {/* ONGLET 3 : CLASSEMENT */}
        {tab === 'classement' && (
          <div className="max-w-md mx-auto bg-gray-900/90 p-8 rounded-3xl border border-amber-500/20 shadow-2xl backdrop-blur-md">
            <h2 className="text-amber-500 font-black uppercase italic mb-6 tracking-widest">Tableau des Participants</h2>
            
            {!currentUser && (
              <div className="flex gap-2 mb-8 animate-bounce">
                <input id="nameInput" type="text" placeholder="ENTRE TON NOM..." className="flex-1 bg-black border-2 border-gray-700 rounded-xl px-4 py-3 text-white font-black uppercase outline-none focus:border-amber-500 transition-all" />
                <button onClick={() => {
                  const val = document.getElementById('nameInput').value;
                  if(val) { setCurrentUser(val.toUpperCase()); localStorage.setItem('wc_user', val.toUpperCase()); }
                }} className="bg-amber-500 text-black px-6 py-3 rounded-xl font-black text-xs uppercase shadow-lg shadow-amber-500/20">OK</button>
              </div>
            )}

            <div className="space-y-3">
              {allPredictions.length === 0 ? (
                <p className="text-gray-500 italic text-sm py-10">Aucun prono enregistré pour le moment...</p>
              ) : (
                allPredictions.map((u, i) => (
                  <div key={i} className={`flex justify-between items-center bg-black/40 p-4 rounded-2xl border transition-all ${currentUser === u.user_name ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/5'}`}>
                    <div className="text-left">
                      <div className="font-black uppercase text-white tracking-widest text-xs">{u.user_name}</div>
                      <div className="text-[8px] text-gray-500 font-bold uppercase">Aujourd'hui à {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </div>
                    <button 
                      onClick={() => { setScores(u.match_data || {}); setTab('tableau'); alert(`Affichage des pronostics de ${u.user_name}`); }} 
                      className="bg-white/5 hover:bg-white/10 text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-tighter transition-all"
                    >
                      👀 Voir ses pronos
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-10 pb-10 opacity-30 text-[8px] font-bold uppercase tracking-[0.5em]">
        World Cup Predictor &copy; 2026 - Powered by Supabase & Vercel
      </footer>
    </div>
  );
}