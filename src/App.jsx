import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';

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

function MatchBox({ id, t1, t2, scores, up, color }) {
  return (
    <div className="relative mb-4 w-52 flex-shrink-0 text-left">
      <div className={`bg-gray-900 border-l-4 ${color} rounded-xl shadow-2xl border border-white/5`}>
        <div className="bg-black/60 text-[8px] px-3 py-1 text-gray-400 font-black uppercase tracking-widest flex justify-between">
          <span>Match {id}</span>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex justify-between items-center gap-2">
            <span className="text-[10px] font-black text-white uppercase truncate flex-1 italic">{t1}</span>
            <input type="number" value={scores[`m${id}s1`] ?? ""} onChange={(e) => up(`m${id}s1`, e.target.value)} className="w-9 h-8 bg-black border border-gray-700 rounded text-center text-sm font-bold text-white outline-none focus:border-emerald-500" />
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-[10px] font-black text-white uppercase truncate flex-1 italic">{t2}</span>
            <input type="number" value={scores[`m${id}s2`] ?? ""} onChange={(e) => up(`m${id}s2`, e.target.value)} className="w-9 h-8 bg-black border border-gray-700 rounded text-center text-sm font-bold text-white outline-none focus:border-emerald-500" />
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

  const loadCloudData = async () => {
    try {
      const { data } = await supabase.from('predictions').select('*');
      if (data) setAllPredictions(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadCloudData(); }, []);

  const saveToCloud = async () => {
    if (!currentUser) return alert("Inscris ton nom !");
    setLoading(true);
    const { error } = await supabase.from('predictions').upsert({ 
      user_name: currentUser, 
      match_data: scores,
      winner_name: "À déterminer"
    }, { onConflict: 'user_name' });
    if (error) alert(error.message);
    else { alert("Pronos sauvegardés !"); loadCloudData(); }
    setLoading(false);
  };

  const up = (k, v) => {
    const val = v === "" ? undefined : parseInt(v, 10);
    setScores(p => ({ ...p, [k]: val }));
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
    const hasScores = Object.keys(scores).some(k => k.startsWith(`g${groupId}`));
    return hasScores ? ranking[rang].name : `${rang + 1}${groupId}`;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 font-sans text-center overflow-x-hidden">
      <header className="mb-6">
        <h1 className="text-3xl font-black italic text-emerald-400 uppercase tracking-tighter">CDM 2026</h1>
        {currentUser && (
          <button onClick={saveToCloud} disabled={loading} className="mt-4 bg-emerald-500 text-black px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
            {loading ? "..." : `☁️ ENREGISTRER (${currentUser})`}
          </button>
        )}
      </header>

      <nav className="flex justify-center mb-10 bg-gray-900 w-fit mx-auto p-1 rounded-xl border border-gray-800 shadow-xl">
        <button onClick={() => setTab('poules')} className={`px-5 py-2 rounded-lg text-xs font-bold transition ${tab === 'poules' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400'}`}>GROUPES</button>
        <button onClick={() => setTab('tableau')} className={`px-5 py-2 rounded-lg text-xs font-bold transition ${tab === 'tableau' ? 'bg-purple-500 text-black shadow-md' : 'text-gray-400'}`}>FINALES</button>
        <button onClick={() => setTab('classement')} className={`px-5 py-2 rounded-lg text-xs font-bold transition ${tab === 'classement' ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400'}`}>PARTICIPANTS</button>
      </nav>

      {tab === 'poules' && (
        <div className="relative max-w-7xl mx-auto">
          <button onClick={() => scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' })} className="absolute -left-2 top-1/2 z-10 bg-emerald-500 text-black w-10 h-10 rounded-full hidden md:flex items-center justify-center font-black shadow-xl">❮</button>
          <button onClick={() => scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' })} className="absolute -right-2 top-1/2 z-10 bg-emerald-500 text-black w-10 h-10 rounded-full hidden md:flex items-center justify-center font-black shadow-xl">❯</button>
          
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-10 px-4 scrollbar-hide snap-x transition-all">
            {CONFIG_GROUPES.map(g => {
              const matches = [
                  { t1: g.equipes[0], t2: g.equipes[1], n1: 1, n2: 2 },
                  { t1: g.equipes[2], t2: g.equipes[3], n1: 3, n2: 4 },
                  { t1: g.equipes[0], t2: g.equipes[2], n1: 5, n2: 6 },
                  { t1: g.equipes[1], t2: g.equipes[3], n1: 7, n2: 8 },
                  { t1: g.equipes[3], t2: g.equipes[0], n1: 9, n2: 10 },
                  { t1: g.equipes[1], t2: g.equipes[2], n1: 11, n2: 12 },
              ];
              const mData = matches.map(m => ({ t1: m.t1, t2: m.t2, s1: scores[`g${g.id}${m.n1}`], s2: scores[`g${g.id}${m.n2}`] }));
              const ranking = getRank(mData, g.equipes);
              return (
                <div key={g.id} className={`w-72 bg-gray-900/40 p-5 rounded-3xl border-2 ${g.couleur} flex-shrink-0 snap-center backdrop-blur-sm`}>
                  <h3 className={`${g.texte} font-black mb-4 uppercase text-xs italic tracking-widest`}>{g.nom}</h3>
                  <div className="space-y-2 mb-6">
                    {matches.map((m, i) => (
                      <div key={i} className="flex items-center justify-between bg-black/30 p-2 rounded-xl border border-white/5">
                        <span className="text-[9px] font-bold w-16 truncate text-left">{m.t1}</span>
                        <div className="flex gap-1">
                          <input type="number" value={scores[`g${g.id}${m.n1}`] ?? ""} onChange={e => up(`g${g.id}${m.n1}`, e.target.value)} className="w-8 h-8 bg-black border border-gray-700 text-center rounded text-xs text-white outline-none" />
                          <input type="number" value={scores[`g${g.id}${m.n2}`] ?? ""} onChange={e => up(`g${g.id}${m.n2}`, e.target.value)} className="w-8 h-8 bg-black border border-gray-700 text-center rounded text-xs text-white outline-none" />
                        </div>
                        <span className="text-[9px] font-bold w-16 truncate text-right">{m.t2}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
                    {ranking.map((team, idx) => (
                      <div key={idx} className={`flex justify-between items-center px-4 py-1.5 text-[10px] ${idx < 2 ? 'text-emerald-400 font-black' : 'text-gray-500 font-bold'}`}>
                        <span>{idx + 1}. {team.name}</span>
                        <div className="flex gap-3">
                          <span className="w-4 text-center">{team.pts}p</span>
                          <span className="w-4 text-center">{team.diff >= 0 ? `+${team.diff}` : team.diff}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'tableau' && (
        <div className="flex gap-12 overflow-x-auto pb-20 px-10 justify-center min-w-max">
            <div className="space-y-8 flex flex-col justify-center">
              <MatchBox id="73" t1={getQualifie('A', 0)} t2={getQualifie('B', 1)} scores={scores} up={up} color="border-blue-500" />
              <MatchBox id="74" t1={getQualifie('C', 0)} t2={getQualifie('D', 1)} scores={scores} up={up} color="border-blue-500" />
            </div>
            <div className="flex flex-col justify-center">
               <div className="bg-emerald-500/10 border-2 border-emerald-500/40 p-10 rounded-full shadow-2xl animate-pulse">
                 <span className="text-emerald-400 font-black italic uppercase text-2xl">FINALE</span>
               </div>
            </div>
        </div>
      )}
{tab === 'classement' && (
  <div className="max-w-md mx-auto bg-gray-900/90 p-8 rounded-3xl border border-amber-500/20 shadow-2xl backdrop-blur-md">
    <h2 className="text-amber-500 font-black uppercase italic mb-6 tracking-widest">Tableau des Participants</h2>
    
    {!currentUser && (
      <div className="flex gap-2 mb-8">
        <input id="nInput" type="text" placeholder="TON PRÉNOM" className="flex-1 bg-black border-2 border-gray-700 rounded-xl px-4 py-3 text-white font-black uppercase outline-none focus:border-amber-500" />
        <button onClick={() => { const v = document.getElementById('nInput').value; if(v){ setCurrentUser(v.toUpperCase()); localStorage.setItem('wc_user', v.toUpperCase()); }}} className="bg-amber-500 text-black px-6 py-3 rounded-xl font-black text-xs uppercase shadow-lg shadow-amber-500/20">OK</button>
      </div>
    )}

    <div className="space-y-3">
      {allPredictions.length === 0 ? (
        <p className="text-gray-500 italic text-sm py-10">Aucun participant pour le moment...</p>
      ) : (
        allPredictions.map((u, i) => (
          <div key={i} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
            <span className="font-black uppercase text-white tracking-widest text-xs">{u.user_name}</span>
            
            <div className="flex gap-2">
              {/* BOUTON VOIR */}
              <button 
                onClick={() => { setScores(u.match_data || {}); setTab('poules'); }} 
                className="bg-white/5 hover:bg-white/10 text-[9px] font-black px-3 py-2 rounded-lg uppercase transition-all"
              >
                👀 Voir
              </button>

              {/* BOUTON SUPPRIMER (Croix rouge) */}
              <button 
                onClick={async () => {
                  if(window.confirm(`Supprimer définitivement les pronos de ${u.user_name} ?`)) {
                    const { error } = await supabase
                      .from('predictions')
                      .delete()
                      .eq('user_name', u.user_name);
                    
                    if (error) alert(error.message);
                    else {
                      alert("Participant supprimé !");
                      loadCloudData(); // Recharge la liste
                    }
                  }
                }} 
                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-[9px] font-black px-3 py-2 rounded-lg uppercase transition-all"
              >
                ✕
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
      
    </div>
  );
}