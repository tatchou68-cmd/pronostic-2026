import React, { useState, useEffect, useRef } from 'react';

// --- 1. CONFIGURATION DES GROUPES ---
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
  
  // Scores
  const [scores, setScores] = useState(() => {
    const s = localStorage.getItem('wc_2026_auto_v1');
    return s ? JSON.parse(s) : {};
  });

  // Participants
  const [participants, setParticipants] = useState(() => {
    const p = localStorage.getItem('wc_2026_participants');
    return p ? JSON.parse(p) : [];
  });
  const [newName, setNewName] = useState("");

  useEffect(() => { localStorage.setItem('wc_2026_auto_v1', JSON.stringify(scores)); }, [scores]);
  useEffect(() => { localStorage.setItem('wc_2026_participants', JSON.stringify(participants)); }, [participants]);

  const up = (k, v) => {
    const val = (v === "" || isNaN(parseInt(v))) ? undefined : parseInt(v, 10);
    setScores(p => ({ ...p, [k]: val }));
  };

  const addParticipant = () => {
    if (newName.trim() === "") return;
    setParticipants([...participants, { id: Date.now(), name: newName.toUpperCase() }]);
    setNewName("");
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
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
    const matchFini = m.some(match => match.s1 !== undefined && match.s2 !== undefined);
    return matchFini ? ranking[rang].name : `${rang + 1}${groupId}`;
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

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 font-sans relative overflow-x-hidden">
      <h1 className="text-2xl font-black text-center mb-8 italic text-emerald-400 uppercase tracking-tighter">
        Pronostic Coupe du Monde 2026
      </h1>

      <div className="flex justify-center mb-10 bg-gray-900 w-fit mx-auto p-1 rounded-xl border border-gray-800 shadow-2xl">
        <button onClick={() => setTab('poules')} className={`px-4 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${tab === 'poules' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-400 hover:text-white'}`}>MATCHS DE GROUPE</button>
        <button onClick={() => setTab('tableau')} className={`px-4 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${tab === 'tableau' ? 'bg-purple-500 text-black shadow-lg shadow-purple-500/20' : 'text-gray-400 hover:text-white'}`}>PHASE FINALE</button>
        <button onClick={() => setTab('participants')} className={`px-4 md:px-6 py-2 rounded-lg text-[10px] md:text-xs font-bold transition ${tab === 'participants' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-gray-400 hover:text-white'}`}>PARTICIPANTS</button>
      </div>

      <div className="relative group max-w-full">
        {tab === 'poules' && (
          <>
            <button onClick={() => handleScroll('left')} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-emerald-500 text-black w-10 h-10 rounded-full font-black opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-xl">❮</button>
            <button onClick={() => handleScroll('right')} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-emerald-500 text-black w-10 h-10 rounded-full font-black opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-xl">❯</button>
            <div ref={scrollRef} className="flex space-x-6 px-10 min-w-max pb-10 overflow-x-auto scrollbar-hide">
              {CONFIG_GROUPES.map((g) => {
                const matchs = [
                  {t1:g.equipes[0], t2:g.equipes[1], k1:`g${g.id}1`, k2:`g${g.id}2`},
                  {t1:g.equipes[2], t2:g.equipes[3], k1:`g${g.id}3`, k2:`g${g.id}4`},
                  {t1:g.equipes[0], t2:g.equipes[2], k1:`g${g.id}5`, k2:`g${g.id}6`},
                  {t1:g.equipes[1], t2:g.equipes[3], k1:`g${g.id}7`, k2:`g${g.id}8`},
                  {t1:g.equipes[3], t2:g.equipes[0], k1:`g${g.id}9`, k2:`g${g.id}10`},
                  {t1:g.equipes[1], t2:g.equipes[2], k1:`g${g.id}11`, k2:`g${g.id}12`}
                ];
                const rank = getRank(matchs.map(m => ({ t1: m.t1, t2: m.t2, s1: scores[m.k1], s2: scores[m.k2] })), g.equipes);
                return (
                  <div key={g.id} className={`w-[300px] bg-gray-900/50 p-5 rounded-2xl border ${g.couleur} flex-shrink-0`}>
                    <h3 className={`${g.texte} font-black mb-4 uppercase text-xs italic tracking-widest`}>{g.nom}</h3>
                    <div className="space-y-4 mb-6">
                      {matchs.map((m, i) => (
                        <div key={i} className="flex items-center justify-between bg-black/20 p-2 rounded">
                          <span className="text-[9px] font-bold w-12 truncate uppercase text-white">{m.t1}</span>
                          <div className="flex gap-1">
                            <input type="number" value={scores[m.k1] ?? ""} onChange={e => up(m.k1, e.target.value)} className="w-8 h-8 bg-black border border-gray-700 text-center rounded text-xs text-white outline-none" />
                            <input type="number" value={scores[m.k2] ?? ""} onChange={e => up(m.k2, e.target.value)} className="w-8 h-8 bg-black border border-gray-700 text-center rounded text-xs text-white outline-none" />
                          </div>
                          <span className="text-[9px] font-bold w-12 text-right truncate uppercase text-white">{m.t2}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden text-[10px]">
                      {rank.map((t, i) => (
                        <div key={i} className={`flex justify-between px-3 py-1.5 ${i < 2 ? 'text-emerald-400 font-bold' : 'text-gray-500'}`}>
                          <span>{i+1}. {t.name}</span>
                          <div className="flex gap-4"><span>{t.pts}</span><span>{t.diff}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'tableau' && (
          <div className="w-full overflow-x-auto pb-20 scrollbar-hide">
            <div className="min-w-max flex items-center px-10 gap-10 py-10">
              {/* AILE GAUCHE */}
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-2">
                  <MatchBox id="74" t1={getQualifie('E', 0)} t2="3ABCD" scores={scores} up={up} color="border-blue-500" />
                  <MatchBox id="77" t1="1I" t2="3CDFG" scores={scores} up={up} color="border-blue-500" />
                  <div className="h-4"></div>
                  <MatchBox id="73" t1={getQualifie('A', 1)} t2={getQualifie('B', 1)} scores={scores} up={up} color="border-blue-500" />
                  <MatchBox id="75" t1={getQualifie('F', 0)} t2={getQualifie('C', 1)} scores={scores} up={up} color="border-blue-500" />
                  <div className="h-8"></div>
                  <MatchBox id="83" t1={getQualifie('K', 1)} t2={getQualifie('L', 1)} scores={scores} up={up} color="border-emerald-500" />
                  <MatchBox id="84" t1={getQualifie('H', 0)} t2={getQualifie('J', 1)} scores={scores} up={up} color="border-emerald-500" />
                  <div className="h-4"></div>
                  <MatchBox id="81" t1={getQualifie('D', 0)} t2="3BEFI" scores={scores} up={up} color="border-emerald-500" />
                  <MatchBox id="82" t1={getQualifie('G', 0)} t2="3AEHI" scores={scores} up={up} color="border-emerald-500" />
                </div>
                <div className="flex flex-col gap-32">
                  <MatchBox id="89" t1={getWinner("74", getQualifie('E', 0), "3ABCD", "W74")} t2={getWinner("77", "1I", "3CDFG", "W77")} scores={scores} up={up} color="border-blue-400" />
                  <MatchBox id="90" t1={getWinner("73", getQualifie('A', 1), getQualifie('B', 1), "W73")} t2={getWinner("75", getQualifie('F', 0), getQualifie('C', 1), "W75")} scores={scores} up={up} color="border-blue-400" />
                  <div className="h-20"></div>
                  <MatchBox id="93" t1={getWinner("83", getQualifie('K', 1), getQualifie('L', 1), "W83")} t2={getWinner("84", getQualifie('H', 0), getQualifie('J', 1), "W84")} scores={scores} up={up} color="border-emerald-400" />
                  <MatchBox id="94" t1={getWinner("81", getQualifie('D', 0), "3BEFI", "W81")} t2={getWinner("82", getQualifie('G', 0), "3AEHI", "W82")} scores={scores} up={up} color="border-emerald-400" />
                </div>
                <div className="flex flex-col gap-64">
                   <MatchBox id="97" t1={getWinner("89", "V. 89", "V. 89", "W89")} t2={getWinner("90", "V. 90", "V. 90", "W90")} scores={scores} up={up} color="border-blue-300" />
                   <MatchBox id="98" t1={getWinner("93", "V. 93", "V. 93", "W93")} t2={getWinner("94", "V. 94", "V. 94", "W94")} scores={scores} up={up} color="border-emerald-300" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-10">
                <MatchBox id="101" t1="V. 97" t2="V. 98" scores={scores} up={up} color="border-amber-500" />
                <div className="bg-amber-500/10 border-2 border-amber-500 p-10 rounded-full text-center shadow-2xl"><div className="text-amber-500 font-black text-4xl italic uppercase">Final</div></div>
                <MatchBox id="102" t1="V. 99" t2="V. 100" scores={scores} up={up} color="border-amber-500" />
              </div>
              {/* AILE DROITE */}
              <div className="flex flex-row-reverse items-center gap-8">
                <div className="flex flex-col gap-2">
                  <MatchBox id="76" t1={getQualifie('C', 0)} t2={getQualifie('F', 1)} scores={scores} up={up} color="border-green-500" />
                  <MatchBox id="78" t1={getQualifie('E', 1)} t2="2I" scores={scores} up={up} color="border-green-500" />
                  <div className="h-4"></div>
                  <MatchBox id="79" t1={getQualifie('A', 0)} t2="3CEHI" scores={scores} up={up} color="border-green-500" />
                  <MatchBox id="80" t1={getQualifie('L', 0)} t2="3BHIJ" scores={scores} up={up} color="border-green-500" />
                  <div className="h-8"></div>
                  <MatchBox id="86" t1={getQualifie('J', 0)} t2={getQualifie('H', 1)} scores={scores} up={up} color="border-red-500" />
                  <MatchBox id="88" t1={getQualifie('D', 1)} t2={getQualifie('G', 1)} scores={scores} up={up} color="border-red-500" />
                  <div className="h-4"></div>
                  <MatchBox id="85" t1={getQualifie('B', 0)} t2="3EFGI" scores={scores} up={up} color="border-red-500" />
                  <MatchBox id="87" t1={getQualifie('K', 0)} t2="3DBJL" scores={scores} up={up} color="border-red-500" />
                </div>
                <div className="flex flex-col gap-32">
                  <MatchBox id="91" t1="W76" t2="W78" scores={scores} up={up} color="border-green-400" />
                  <MatchBox id="92" t1="W79" t2="W80" scores={scores} up={up} color="border-green-400" />
                  <div className="h-20"></div>
                  <MatchBox id="95" t1="W86" t2="W88" scores={scores} up={up} color="border-red-400" />
                  <MatchBox id="96" t1="W85" t2="W87" scores={scores} up={up} color="border-red-400" />
                </div>
                <div className="flex flex-col gap-64">
                   <MatchBox id="99" t1="W91" t2="W92" scores={scores} up={up} color="border-green-300" />
                   <MatchBox id="100" t1="W95" t2="W96" scores={scores} up={up} color="border-red-300" />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'participants' && (
          <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-gray-900/80 border border-amber-500/20 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-amber-500 font-black italic uppercase text-xl mb-6 tracking-widest border-b border-amber-500/10 pb-4 text-center">Gestion des Pronostiqueurs</h2>
              
              <div className="flex gap-4 mb-10">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                  placeholder="NOM DU JOUEUR..." 
                  className="flex-1 bg-black border border-gray-700 rounded-xl px-5 py-3 text-white outline-none focus:border-amber-500 transition-all font-bold uppercase placeholder:text-gray-600"
                />
                <button 
                  onClick={addParticipant} 
                  className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-amber-500/20"
                >
                  AJOUTER
                </button>
              </div>

              <div className="space-y-3">
                {participants.length === 0 ? (
                  <div className="text-center text-gray-500 py-10 italic border-2 border-dashed border-gray-800 rounded-2xl font-semibold">Aucun participant enregistré.</div>
                ) : (
                  participants.map(p => (
                    <div key={p.id} className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-amber-500/30 transition group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 font-black text-xs border border-amber-500/20">
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-black text-white uppercase tracking-wider">{p.name}</span>
                      </div>
                      <button 
                        onClick={() => removeParticipant(p.id)} 
                        className="text-gray-600 hover:text-red-500 font-bold text-xs p-2 transition-colors uppercase tracking-widest"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}