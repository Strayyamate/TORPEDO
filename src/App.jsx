import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Clock, Share2, RefreshCw, Volume2, VolumeX, Search, ChevronRight } from 'lucide-react';

class SoundEngine {
  constructor() { this.ctx = null; this.muted = false; }
  init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
  playKick() {
    if (this.muted) return; this.init();
    const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(1, this.ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.15);
  }
  playGoal() {
    if (this.muted) return; this.init();
    const now = this.ctx.currentTime;
    [261.63, 329.63, 392.00, 523.25].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.frequency.value = freq; gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.3);
      osc.connect(gain); gain.connect(this.ctx.destination); osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.3);
    });
  }
  playTurnover() {
    if (this.muted) return; this.init();
    const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(180, now); osc.frequency.linearRampToValueAtTime(90, now + 0.25);
    gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(now + 0.25);
  }
}

const sounds = new SoundEngine();

const AFL_PLAYERS = [
  { id: "p1", name: "Lance Franklin", clubs: ["HAW", "SYD"], games: 354, goals: 1066, jumpers: [23], debut: 2005, prem: true, aa: true },
  { id: "p2", name: "Patrick Dangerfield", clubs: ["ADE", "GEL"], games: 337, goals: 332, jumpers: [32, 35], debut: 2008, prem: true, aa: true },
  { id: "p3", name: "Dustin Martin", clubs: ["RCH"], games: 302, goals: 338, jumpers: [4], debut: 2010, prem: true, aa: true },
  { id: "p4", name: "Scott Pendlebury", clubs: ["COL"], games: 403, goals: 191, jumpers: [10], debut: 2006, prem: true, aa: true },
  { id: "p5", name: "Gary Ablett Jr.", clubs: ["GEL", "GCS"], games: 357, goals: 445, jumpers: [29, 9], debut: 2002, prem: true, aa: true },
  { id: "p6", name: "Nat Fyfe", clubs: ["FRE"], games: 242, goals: 178, jumpers: [7], debut: 2010, prem: false, aa: true },
  { id: "p7", name: "Marcus Bontempelli", clubs: ["WB"], games: 240, goals: 220, jumpers: [4], debut: 2014, prem: true, aa: true },
  { id: "p8", name: "Toby Greene", clubs: ["GWS"], games: 232, goals: 362, jumpers: [4], debut: 2012, prem: false, aa: true },
  { id: "p9", name: "Charlie Curnow", clubs: ["CAR"], games: 138, goals: 285, jumpers: [30], debut: 2016, prem: false, aa: true },
  { id: "p10", name: "Jordan De Goey", clubs: ["COL"], games: 182, goals: 202, jumpers: [2], debut: 2015, prem: true, aa: false },
  { id: "p11", name: "Trent Ormond-Allen", clubs: ["MEL", "ADE"], games: 104, goals: 34, jumpers: [11, 23], debut: 1997, prem: true, aa: false },
  { id: "p12", name: "Rohan Welsh", clubs: ["CAR"], games: 42, goals: 45, jumpers: [21], debut: 1992, prem: false, aa: false },
  { id: "p13", name: "Lachie Henderson", clubs: ["BL", "CAR", "GEL"], games: 206, goals: 116, jumpers: [14, 23, 40], debut: 2008, prem: false, aa: false },
  { id: "p14", name: "Relton Roberts", clubs: ["RCH"], games: 2, goals: 0, jumpers: [38], debut: 2010, prem: false, aa: false },
  { id: "p15", name: "Claye Beams", clubs: ["BL"], games: 54, goals: 27, jumpers: [17], debut: 2011, prem: false, aa: false },
  { id: "p16", name: "Zac Dawson", clubs: ["HAW", "SKT", "FRE"], games: 166, goals: 7, jumpers: [26, 3], debut: 2005, prem: false, aa: false },
  { id: "p17", name: "Ty Zantuck", clubs: ["RCH", "ESS"], games: 77, goals: 22, jumpers: [24, 21], debut: 2000, prem: false, aa: false },
  { id: "p18", name: "Shane Morrison", clubs: ["BL", "RCH"], games: 13, goals: 8, jumpers: [31, 29], debut: 2001, prem: false, aa: false },
  { id: "p19", name: "Kieran Harper", clubs: ["NME"], games: 40, goals: 35, jumpers: [23], debut: 2011, prem: false, aa: false },
  { id: "p20", name: "Setanta O'hAilpin", clubs: ["CAR", "GWS"], games: 88, goals: 82, jumpers: [8], debut: 2005, prem: false, aa: false }
];

const PROMPTS = [
  { id: 1, title: "Played for 2+ AFL Clubs", check: (p) => p.clubs.length >= 2 },
  { id: 2, title: "Kicked 300+ Career Goals", check: (p) => p.goals >= 300 },
  { id: 3, title: "Won an AFL Premiership", check: (p) => p.prem === true },
  { id: 4, title: "Wore Jumper #20 or higher", check: (p) => p.jumpers.some(j => j >= 20) },
  { id: 5, title: "Played fewer than 50 AFL Games", check: (p) => p.games < 50 },
  { id: 6, title: "All-Australian Player", check: (p) => p.aa === true },
  { id: 7, title: "Debut between 2000 and 2010", check: (p) => p.debut >= 2000 && p.debut <= 2010 }
];

export default function App() {
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [timer, setTimer] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [usedPlayerIds, setUsedPlayerIds] = useState(new Set());
  const [gameComplete, setGameComplete] = useState(false);
  const [muted, setMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isActive && timer > 0 && !gameComplete) {
      timerRef.current = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && isActive && !gameComplete) {
      sounds.playTurnover();
      recordTurnover("Out of Time!");
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timer, gameComplete]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      setSuggestions(AFL_PLAYERS.filter(p => p.name.toLowerCase().includes(q) && !usedPlayerIds.has(p.id)).slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, usedPlayerIds]);

  const startGame = () => {
    setIsActive(true); setTimer(25); setGameComplete(false); setGameHistory([]); setUsedPlayerIds(new Set()); setCurrentPromptIdx(0);
  };

  const calculateDistance = (player) => {
    if (player.games > 300 || player.goals > 500) return 18;
    if (player.games > 200) return 28;
    if (player.games > 100) return 42;
    if (player.games > 30) return 56;
    return 68;
  };

  const submitAnswer = (player) => {
    sounds.playKick();
    const prompt = PROMPTS[currentPromptIdx];
    if (prompt.check(player)) {
      sounds.playGoal();
      const meters = calculateDistance(player);
      setGameHistory(prev => [...prev, { promptTitle: prompt.title, playerName: player.name, isGoal: true, meters, rarity: meters > 50 ? "SUPER RARE" : "COMMON" }]);
    } else {
      sounds.playTurnover();
      recordTurnover(`Invalid: ${player.name}`);
    }
    setUsedPlayerIds(prev => new Set(prev).add(player.id));
    nextTurn();
  };

  const recordTurnover = (reason) => {
    const prompt = PROMPTS[currentPromptIdx];
    setGameHistory(prev => [...prev, { promptTitle: prompt.title, playerName: reason, isGoal: false, meters: 0, rarity: "RUSHED" }]);
    nextTurn();
  };

  const nextTurn = () => {
    setSearchQuery(''); setSuggestions([]);
    if (currentPromptIdx + 1 < PROMPTS.length) {
      setCurrentPromptIdx(prev => prev + 1); setTimer(25);
    } else {
      setIsActive(false); setGameComplete(true);
    }
  };

  const getTotalDistance = () => gameHistory.reduce((acc, curr) => acc + curr.meters, 0);

  const copyShare = () => {
    const goals = gameHistory.filter(h => h.isGoal).length;
    const icons = gameHistory.map(h => h.isGoal ? `🟢 ${h.meters}m` : `🔴 Rushed`).join('\n');
    navigator.clipboard.writeText(`TORPEDO (AFL Longshots) 🏉\n🎯 ${goals}/7 Goals | 🏆 Distance: ${getTotalDistance()}m\n\n${icons}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-500 text-slate-950 px-2 py-1 rounded font-black text-lg">🏉 TORPEDO</div>
        </div>
        <button onClick={() => { sounds.muted = !muted; setMuted(!muted); }} className="p-2 text-slate-400">
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </header>

      <main className="flex-1 max-w-xl w-full mx-auto p-4 flex flex-col justify-center">
        {!isActive && !gameComplete && (
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-black text-white">THE OBVIOUS ANSWER IS THE WORST ANSWER.</h1>
            <p className="text-slate-400 text-sm">Pick obscure AFL players to score longer goals!</p>
            <button onClick={startGame} className="w-full py-4 bg-emerald-500 text-slate-950 font-black rounded-xl">START GAME</button>
          </div>
        )}

        {isActive && !gameComplete && (
          <div className="space-y-6">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-400">PROMPT {currentPromptIdx + 1} OF 7</span>
              <span className="text-emerald-400"><Clock size={16} className="inline mr-1" />{timer}s</span>
            </div>
            <div className="bg-slate-900 border-2 border-emerald-500/40 p-6 rounded-2xl text-center">
              <div className="text-xs font-black text-emerald-400">NAME AN AFL PLAYER WHO:</div>
              <div className="text-xl font-black text-white mt-1">"{PROMPTS[currentPromptIdx].title}"</div>
            </div>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type player name..."
                className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-white"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden z-50">
                  {suggestions.map((p) => (
                    <button key={p.id} onClick={() => submitAnswer(p)} className="w-full p-3 text-left hover:bg-slate-800 text-white font-bold border-b border-slate-800 flex justify-between">
                      <span>{p.name} ({p.clubs.join(', ')})</span>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => recordTurnover("Passed")} className="w-full py-2 bg-slate-900 text-slate-500 text-xs rounded-lg">Pass Prompt</button>
          </div>
        )}

        {gameComplete && (
          <div className="space-y-6 text-center">
            <Trophy size={48} className="mx-auto text-emerald-400" />
            <h2 className="text-2xl font-black text-white">TOTAL DISTANCE: {getTotalDistance()}m</h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
              {gameHistory.map((item, idx) => (
                <div key={idx} className="p-3 flex justify-between text-sm">
                  <span className="text-white font-bold">{item.playerName}</span>
                  <span className={item.isGoal ? "text-emerald-400 font-bold" : "text-red-400"}>{item.isGoal ? `+${item.meters}m` : "Rushed"}</span>
                </div>
              ))}
            </div>
            <button onClick={copyShare} className="w-full py-4 bg-emerald-500 text-slate-950 font-black rounded-xl">
              {copied ? "COPIED!" : "SHARE SCORECARD"}
            </button>
            <button onClick={startGame} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl">PLAY AGAIN</button>
          </div>
        )}
      </main>
    </div>
  );
}
