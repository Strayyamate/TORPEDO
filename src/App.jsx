import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Clock, Share2, RefreshCw, Volume2, VolumeX, Search, ChevronRight 
} from 'lucide-react';

// --- SYNTHESIZED AUDIO FX (Web Audio API) ---
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playKick() {
    if (this.muted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playGoal() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    [261.63, 329.63, 392.00, 523.25].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  playTurnover() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.25);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.25);
  }
}

const sounds = new SoundEngine();

// --- AFL PLAYER DATABASE (1990-2026 Sample Dataset) ---
const AFL_PLAYERS = [
  { id: "p1", name: "Lance Franklin", clubs: ["HAW", "SYD"], games: 354, goals: 1066, jumpers: [23], debut: 2005, last: 2023, prem: true, aa: true, bnf: true, brownlow: false, coleman: true },
  { id: "p2", name: "Patrick Dangerfield", clubs: ["ADE", "GEL"], games: 337, goals: 332, jumpers: [32, 35], debut: 2008, last: 2026, prem: true, aa: true, bnf: true, brownlow: true, coleman: false },
  { id: "p3", name: "Dustin Martin", clubs: ["RCH"], games: 302, goals: 338, jumpers: [4], debut: 2010, last: 2024, prem: true, aa: true, bnf: true, brownlow: true, coleman: false },
  { id: "p4", name: "Scott Pendlebury", clubs: ["COL"], games: 403, goals: 191, jumpers: [10], debut: 2006, last: 2026, prem: true, aa: true, bnf: true, brownlow: false, coleman: false },
  { id: "p5", name: "Gary Ablett Jr.", clubs: ["GEL", "GCS"], games: 357, goals: 445, jumpers: [29, 9], debut: 2002, last: 2020, prem: true, aa: true, bnf: true, brownlow: true, coleman: false },
  { id: "p6", name: "Nat Fyfe", clubs: ["FRE"], games: 242, goals: 178, jumpers: [7], debut: 2010, last: 2026, prem: false, aa: true, bnf: true, brownlow: true, coleman: false },
  { id: "p7", name: "Marcus Bontempelli", clubs: ["WB"], games: 240, goals: 220, jumpers: [4], debut: 2014, last: 2026, prem: true, aa: true, bnf: true, brownlow: false, coleman: false },
  { id: "p8", name: "Toby Greene", clubs: ["GWS"], games: 232, goals: 362, jumpers: [4], debut: 2012, last: 2026, prem: false, aa: true, bnf: true, brownlow: false, coleman: false },
  { id: "p9", name: "Charlie Curnow", clubs: ["CAR"], games: 138, goals: 285, jumpers: [30], debut: 2016, last: 2026, prem: false, aa: true, bnf: true, brownlow: false, coleman: true },
  { id: "p10", name: "Jordan De Goey", clubs: ["COL"], games: 182, goals: 202, jumpers: [2], debut: 2015, last: 2026, prem: true, aa: false, bnf: false, brownlow: false, coleman: false },
  
  // Obscure / Role Players
  { id: "p11", name: "Trent Ormond-Allen", clubs: ["MEL", "ADE"], games: 104, goals: 34, jumpers: [11, 23], debut: 1997, last: 2002, prem: true, aa: false, bnf: false, brownlow: false, coleman: false },
  {
