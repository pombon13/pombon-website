import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// AUDIO ENGINE — Web Audio synth music + SFX
// ═══════════════════════════════════════════════════════
const AudioEngine = (() => {
  let ctx = null, gainNode = null, musicNodes = [], musicPlaying = false, muted = false;
  const getCtx = () => {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = ctx.createGain(); gainNode.gain.value = 0.18;
      gainNode.connect(ctx.destination);
    }
    return ctx;
  };
  const playNote = (freq, dur, type="sine", vol=0.3, delay=0) => {
    try {
      const c = getCtx();
      const o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(0, c.currentTime + delay);
      g.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
      o.connect(g); g.connect(gainNode);
      o.start(c.currentTime + delay); o.stop(c.currentTime + delay + dur);
    } catch(e){}
  };
  const sfx = {
    found: () => { [523,659,784,1047].forEach((f,i) => playNote(f, 0.15, "sine", 0.4, i*0.08)); },
    wrong: () => { playNote(150, 0.3, "sawtooth", 0.3); playNote(100, 0.3, "sawtooth", 0.2, 0.1); },
    combo: () => { [784,988,1175,1568].forEach((f,i) => playNote(f, 0.12, "triangle", 0.5, i*0.06)); },
    levelUp: () => { [392,523,659,784,1047].forEach((f,i) => playNote(f, 0.2, "sine", 0.45, i*0.1)); },
    hint: () => { playNote(440, 0.1, "sine", 0.2); playNote(554, 0.1, "sine", 0.2, 0.1); },
    tick: () => { playNote(880, 0.05, "square", 0.15); },
    gameOver: () => { [392,349,311,262].forEach((f,i) => playNote(f, 0.4, "sawtooth", 0.3, i*0.15)); },
  };
  // Catchy looping bgm pattern
  const melody = [523,587,659,698,784,698,659,587,523,494,440,494,523,523,523,0,
                   659,698,784,880,988,880,784,698,659,587,523,587,659,659,659,0];
  const bass =   [262,0,262,0,220,0,220,0,196,0,196,0,196,0,196,0,
                  262,0,262,0,247,0,247,0,220,0,220,0,220,0,220,0];
  let beatIdx = 0, beatTimer = null;
  const startMusic = () => {
    if (musicPlaying || muted) return;
    musicPlaying = true;
    const bpm = 138, beat = 60/bpm;
    const tick = () => {
      if (!musicPlaying) return;
      const i = beatIdx % melody.length;
      if (melody[i]) playNote(melody[i], beat*0.7, "triangle", 0.22);
      if (bass[i]) playNote(bass[i], beat*0.9, "sine", 0.18);
      if (i % 4 === 0) playNote(80, beat*0.1, "square", 0.08); // kick
      if (i % 4 === 2) playNote(200, beat*0.08, "square", 0.06); // snare
      beatIdx++;
      beatTimer = setTimeout(tick, beat * 1000);
    };
    tick();
  };
  const stopMusic = () => { musicPlaying = false; clearTimeout(beatTimer); };
  const toggleMute = () => { muted = !muted; muted ? stopMusic() : startMusic(); return muted; };
  return { sfx, startMusic, stopMusic, toggleMute, isMuted: () => muted };
})();

// ═══════════════════════════════════════════════════════
// ACCURATE POMBON SVG — based on reference image
// Fluffy golden spiky Pokémon, pom on head, red nose, tongue out
// ═══════════════════════════════════════════════════════
const PombonSVG = ({ size = 50, disguise = "none", opacity = 1, tiny = false }) => {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 80 80" style={{ opacity, display:"block" }}>
      {/* Spiky fur rays around body */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const r1 = 24, r2 = 34 + (i % 3) * 3;
        const x1 = 40 + r1 * Math.cos(rad), y1 = 42 + r1 * Math.sin(rad);
        const x2 = 40 + r2 * Math.cos(rad), y2 = 42 + r2 * Math.sin(rad);
        const lx = 40 + (r2+2) * Math.cos((angle-8)*Math.PI/180);
        const ly = 42 + (r2+2) * Math.sin((angle-8)*Math.PI/180);
        const rx = 40 + (r2+2) * Math.cos((angle+8)*Math.PI/180);
        const ry = 42 + (r2+2) * Math.sin((angle+8)*Math.PI/180);
        return <polygon key={i} points={`${x1},${y1} ${lx},${ly} ${x2},${y2} ${rx},${ry}`}
          fill="#F4A800" stroke="#D4800A" strokeWidth="0.5" opacity="0.9"/>;
      })}
      {/* Main round body */}
      <circle cx="40" cy="42" r="23" fill="#F5B800" stroke="#D4900A" strokeWidth="1"/>
      {/* Belly lighter patch */}
      <ellipse cx="40" cy="46" rx="13" ry="11" fill="#FDDA6A" opacity="0.7"/>
      {/* Pom-pom on top of head */}
      <circle cx="40" cy="14" r="8" fill="#F5B800" stroke="#D4900A" strokeWidth="0.8"/>
      <circle cx="40" cy="14" r="5" fill="#FDDA6A"/>
      <circle cx="37" cy="12" r="2" fill="#F5B800"/>
      <circle cx="43" cy="11" r="1.5" fill="#F5B800"/>
      {/* Neck connector */}
      <ellipse cx="40" cy="21" rx="7" ry="5" fill="#F5B800" stroke="#D4900A" strokeWidth="0.5"/>
      {/* Left eye */}
      <circle cx="31" cy="38" r="6" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
      <circle cx="31" cy="38" r="3.8" fill="#1a1a1a"/>
      <circle cx="29.5" cy="36.5" r="1.5" fill="white"/>
      <circle cx="32.5" cy="39.5" r="0.8" fill="#333"/>
      {/* Right eye */}
      <circle cx="49" cy="38" r="6" fill="white" stroke="#1a1a1a" strokeWidth="1.2"/>
      <circle cx="49" cy="38" r="3.8" fill="#1a1a1a"/>
      <circle cx="47.5" cy="36.5" r="1.5" fill="white"/>
      <circle cx="50.5" cy="39.5" r="0.8" fill="#333"/>
      {/* Red nose */}
      <ellipse cx="40" cy="44" rx="3" ry="2.2" fill="#E8302A"/>
      <ellipse cx="39" cy="43.2" rx="1" ry="0.7" fill="#FF6B66" opacity="0.6"/>
      {/* Open mouth with tongue */}
      <path d="M33 48 Q40 55 47 48" fill="#CC2020" stroke="#991010" strokeWidth="0.8"/>
      <path d="M33 48 Q40 52 47 48 Q40 58 33 48Z" fill="#CC2020"/>
      {/* Tongue */}
      <ellipse cx="40" cy="53" rx="5" ry="3.5" fill="#FF8080"/>
      <line x1="40" y1="50" x2="40" y2="56" stroke="#E06060" strokeWidth="0.8"/>
      {/* Tiny fangs */}
      <polygon points="36,48 34,51 38,51" fill="white" opacity="0.9"/>
      <polygon points="44,48 42,51 46,51" fill="white" opacity="0.9"/>
      {/* Cheek blush */}
      <ellipse cx="25" cy="44" rx="5" ry="3" fill="#FF9966" opacity="0.35"/>
      <ellipse cx="55" cy="44" rx="5" ry="3" fill="#FF9966" opacity="0.35"/>
      {/* Tiny legs */}
      <ellipse cx="32" cy="63" rx="6" ry="4" fill="#F4A800" stroke="#D4800A" strokeWidth="0.8"/>
      <ellipse cx="48" cy="63" rx="6" ry="4" fill="#F4A800" stroke="#D4800A" strokeWidth="0.8"/>

      {/* ── DISGUISES ── */}
      {disguise === "sunglasses" && (
        <g>
          <rect x="22" y="33" width="15" height="10" rx="5" fill="#111" opacity="0.92" stroke="#444" strokeWidth="0.5"/>
          <rect x="43" y="33" width="15" height="10" rx="5" fill="#111" opacity="0.92" stroke="#444" strokeWidth="0.5"/>
          <line x1="37" y1="37" x2="43" y2="37" stroke="#333" strokeWidth="1.5"/>
          <line x1="22" y1="37" x2="18" y2="35" stroke="#333" strokeWidth="1.5"/>
          <line x1="58" y1="37" x2="62" y2="35" stroke="#333" strokeWidth="1.5"/>
        </g>
      )}
      {disguise === "hat" && (
        <g>
          <rect x="20" y="22" width="40" height="6" rx="2" fill="#1a1a1a" stroke="#333" strokeWidth="0.5"/>
          <rect x="26" y="4" width="28" height="20" rx="4" fill="#111" stroke="#333" strokeWidth="0.5"/>
          <rect x="28" y="8" width="6" height="2" rx="1" fill="#F4C842" opacity="0.5"/>
        </g>
      )}
      {disguise === "bow" && (
        <g>
          <path d="M26 8 L40 16 L26 24 Z" fill="#FF4499" stroke="#CC0066" strokeWidth="0.5"/>
          <path d="M54 8 L40 16 L54 24 Z" fill="#FF4499" stroke="#CC0066" strokeWidth="0.5"/>
          <circle cx="40" cy="16" r="4" fill="#FF0066" stroke="#CC0044" strokeWidth="0.5"/>
          <circle cx="40" cy="16" r="2" fill="#FF66AA"/>
        </g>
      )}
      {disguise === "mustache" && (
        <g>
          <path d="M27 47 Q33 42 40 47 Q47 42 53 47" stroke="#3D1F00" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
          <path d="M27 47 Q33 44 40 47 Q47 44 53 47" stroke="#5C3010" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
        </g>
      )}
      {disguise === "mask" && (
        <g>
          <rect x="22" y="41" width="36" height="18" rx="6" fill="#4ECDC4" stroke="#2AA" strokeWidth="0.8"/>
          <line x1="22" y1="50" x2="58" y2="50" stroke="#2ABAB4" strokeWidth="0.8" strokeDasharray="3,2"/>
          <ellipse cx="27" cy="50" rx="3" ry="5" fill="none" stroke="#2AA" strokeWidth="0.8"/>
          <ellipse cx="53" cy="50" rx="3" ry="5" fill="none" stroke="#2AA" strokeWidth="0.8"/>
        </g>
      )}
      {disguise === "pirate" && (
        <g>
          <path d="M18 25 Q40 18 62 25 L58 8 Q40 2 22 8 Z" fill="#1a1a1a"/>
          <polygon points="40,2 48,14 32,14" fill="#F4C842"/>
          <rect x="26" y="33" width="12" height="8" rx="2" fill="#1a1a1a" opacity="0.9"/>
          <line x1="20" y1="37" x2="38" y2="37" stroke="#1a1a1a" strokeWidth="2"/>
        </g>
      )}
      {disguise === "wizard" && (
        <g>
          <path d="M40 -2 L55 26 L25 26 Z" fill="#6B2FB3" stroke="#4A1A8A" strokeWidth="0.8"/>
          <ellipse cx="40" cy="26" rx="18" ry="5" fill="#7B3FC3" stroke="#4A1A8A" strokeWidth="0.8"/>
          {[{x:35,y:8},{x:48,y:14},{x:30,y:18}].map((p,i)=>
            <polygon key={i} points={`${p.x},${p.y} ${p.x+3},${p.y+5} ${p.x-3},${p.y+5}`} fill="#F4C842" opacity="0.8"/>
          )}
        </g>
      )}
      {disguise === "ninja" && (
        <g>
          <rect x="20" y="40" width="40" height="20" rx="4" fill="#1a1a1a" opacity="0.95"/>
          <rect x="20" y="25" width="40" height="18" rx="4" fill="#1a1a1a" opacity="0.95"/>
          <rect x="22" y="33" width="14" height="9" rx="3" fill="#CC0000" opacity="0.85"/>
          <rect x="44" y="33" width="14" height="9" rx="3" fill="#CC0000" opacity="0.85"/>
        </g>
      )}
      {disguise === "flower" && (
        <g>
          {[0,45,90,135,180,225,270,315].map((a,i)=>{
            const r=a*Math.PI/180;
            return <ellipse key={i} cx={40+14*Math.cos(r)} cy={10+14*Math.sin(r)} rx="5" ry="7"
              fill={["#FF6B9D","#FF9966","#FFDD44","#88DD44"][i%4]} opacity="0.9"
              transform={`rotate(${a} ${40+14*Math.cos(r)} ${10+14*Math.sin(r)})`}/>;
          })}
          <circle cx="40" cy="10" r="7" fill="#FFD700" stroke="#E8A800" strokeWidth="0.8"/>
        </g>
      )}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════
// DECOY CREATURES — visually similar but distinctly NOT Pombon
// ═══════════════════════════════════════════════════════
const Decoy1 = ({ size }) => ( // Round blue creature
  <svg width={size} height={size} viewBox="0 0 80 80">
    {[0,40,80,120,160,200,240,300].map((a,i)=>{
      const r=a*Math.PI/180,r1=20,r2=30+(i%2)*4;
      const x1=40+r1*Math.cos(r),y1=42+r1*Math.sin(r);
      const x2=40+r2*Math.cos(r),y2=42+r2*Math.sin(r);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5588CC" strokeWidth="4" strokeLinecap="round"/>;
    })}
    <circle cx="40" cy="42" r="22" fill="#6699DD" stroke="#4477BB" strokeWidth="1"/>
    <ellipse cx="40" cy="47" rx="12" ry="9" fill="#88AAEE" opacity="0.6"/>
    <circle cx="32" cy="38" r="6" fill="white" stroke="#333" strokeWidth="1"/><circle cx="48" cy="38" r="6" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="32" cy="38" r="3.5" fill="#1155AA"/><circle cx="48" cy="38" r="3.5" fill="#1155AA"/>
    <circle cx="30.5" cy="36.5" r="1.3" fill="white"/><circle cx="46.5" cy="36.5" r="1.3" fill="white"/>
    <ellipse cx="40" cy="44" rx="2.5" ry="1.8" fill="#4466AA"/>
    <path d="M34 48 Q40 52 46 48" stroke="#334" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <ellipse cx="28" cy="44" rx="4" ry="2.5" fill="#AABBFF" opacity="0.4"/>
    <ellipse cx="52" cy="44" rx="4" ry="2.5" fill="#AABBFF" opacity="0.4"/>
  </svg>
);
const Decoy2 = ({ size }) => ( // Purple spiky (similar shape — tricky!)
  <svg width={size} height={size} viewBox="0 0 80 80">
    {[15,55,95,135,175,215,255,295,335].map((a,i)=>{
      const r=a*Math.PI/180,r1=22,r2=31+(i%3)*3;
      const x1=40+r1*Math.cos(r),y1=42+r1*Math.sin(r);
      const lx=40+(r2+2)*Math.cos((a-7)*Math.PI/180),ly=42+(r2+2)*Math.sin((a-7)*Math.PI/180);
      const rx=40+(r2+2)*Math.cos((a+7)*Math.PI/180),ry=42+(r2+2)*Math.sin((a+7)*Math.PI/180);
      const x2=40+r2*Math.cos(r),y2=42+r2*Math.sin(r);
      return <polygon key={i} points={`${x1},${y1} ${lx},${ly} ${x2},${y2} ${rx},${ry}`} fill="#9966CC" stroke="#7744AA" strokeWidth="0.4"/>;
    })}
    <circle cx="40" cy="42" r="22" fill="#AA77DD" stroke="#8855BB" strokeWidth="1"/>
    <ellipse cx="40" cy="47" rx="12" ry="9" fill="#CC99EE" opacity="0.6"/>
    <circle cx="32" cy="37" r="6" fill="white" stroke="#333" strokeWidth="1"/><circle cx="48" cy="37" r="6" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="32" cy="37" r="3.5" fill="#6633AA"/><circle cx="48" cy="37" r="3.5" fill="#6633AA"/>
    <circle cx="30.5" cy="35.5" r="1.3" fill="white"/><circle cx="46.5" cy="35.5" r="1.3" fill="white"/>
    <ellipse cx="40" cy="43" rx="2.5" ry="1.8" fill="#8855BB"/>
    <path d="M34 47 Q40 44 46 47" stroke="#554" strokeWidth="1.2" fill="none"/>
    <ellipse cx="28" cy="43" rx="4" ry="2.5" fill="#DDBBFF" opacity="0.35"/>
    <ellipse cx="52" cy="43" rx="4" ry="2.5" fill="#DDBBFF" opacity="0.35"/>
    <circle cx="40" cy="14" r="7" fill="#AA77DD" stroke="#8855BB" strokeWidth="0.7"/>
    <circle cx="40" cy="14" r="4.5" fill="#CC99EE"/>
  </svg>
);
const Decoy3 = ({ size }) => ( // Orange round no spikes
  <svg width={size} height={size} viewBox="0 0 80 80">
    <circle cx="40" cy="42" r="26" fill="#FF8844" stroke="#CC5522" strokeWidth="1.2"/>
    <ellipse cx="40" cy="50" rx="16" ry="10" fill="#FFAA77" opacity="0.6"/>
    <circle cx="30" cy="36" r="7" fill="white" stroke="#333" strokeWidth="1"/><circle cx="50" cy="36" r="7" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="30" cy="36" r="4.5" fill="#331100"/><circle cx="50" cy="36" r="4.5" fill="#331100"/>
    <circle cx="28" cy="34" r="1.8" fill="white"/><circle cx="48" cy="34" r="1.8" fill="white"/>
    <ellipse cx="40" cy="44" rx="3" ry="2" fill="#CC4411"/>
    <path d="M32 50 Q40 56 48 50" stroke="#221" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="24" cy="46" rx="5" ry="3" fill="#FFCCAA" opacity="0.4"/>
    <ellipse cx="56" cy="46" rx="5" ry="3" fill="#FFCCAA" opacity="0.4"/>
    <path d="M28 18 Q40 10 52 18 L50 28 Q40 22 30 28 Z" fill="#FF8844" stroke="#CC5522" strokeWidth="0.8"/>
  </svg>
);
const Decoy4 = ({ size }) => ( // Green creature with antenna
  <svg width={size} height={size} viewBox="0 0 80 80">
    <line x1="40" y1="8" x2="40" y2="22" stroke="#338833" strokeWidth="2.5"/>
    <circle cx="40" cy="6" r="4" fill="#55AA55" stroke="#338833" strokeWidth="0.8"/>
    <circle cx="40" cy="42" r="24" fill="#55BB44" stroke="#338833" strokeWidth="1.2"/>
    <ellipse cx="40" cy="49" rx="14" ry="10" fill="#88DD66" opacity="0.6"/>
    <circle cx="31" cy="37" r="6.5" fill="white" stroke="#333" strokeWidth="1"/><circle cx="49" cy="37" r="6.5" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="31" cy="37" r="4" fill="#115511"/><circle cx="49" cy="37" r="4" fill="#115511"/>
    <circle cx="29.5" cy="35.5" r="1.5" fill="white"/><circle cx="47.5" cy="35.5" r="1.5" fill="white"/>
    <ellipse cx="40" cy="44" rx="3" ry="2" fill="#227722"/>
    <path d="M33 49 Q40 55 47 49" stroke="#332" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <ellipse cx="25" cy="45" rx="4.5" ry="2.5" fill="#AAFFAA" opacity="0.35"/>
    <ellipse cx="55" cy="45" rx="4.5" ry="2.5" fill="#AAFFAA" opacity="0.35"/>
  </svg>
);
const Decoy5 = ({ size }) => ( // Pink fluffy similar to Pombon but wrong color
  <svg width={size} height={size} viewBox="0 0 80 80">
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>{
      const r=a*Math.PI/180,r1=22,r2=32+(i%3)*3;
      const x1=40+r1*Math.cos(r),y1=42+r1*Math.sin(r);
      const lx=40+(r2+2)*Math.cos((a-7)*Math.PI/180),ly=42+(r2+2)*Math.sin((a-7)*Math.PI/180);
      const rx=40+(r2+2)*Math.cos((a+7)*Math.PI/180),ry=42+(r2+2)*Math.sin((a+7)*Math.PI/180);
      const x2=40+r2*Math.cos(r),y2=42+r2*Math.sin(r);
      return <polygon key={i} points={`${x1},${y1} ${lx},${ly} ${x2},${y2} ${rx},${ry}`} fill="#FF88AA" stroke="#DD5588" strokeWidth="0.4"/>;
    })}
    <circle cx="40" cy="42" r="22" fill="#FFAABB" stroke="#DD6688" strokeWidth="1"/>
    <ellipse cx="40" cy="47" rx="12" ry="9" fill="#FFCCDD" opacity="0.6"/>
    <circle cx="40" cy="14" r="7" fill="#FFAABB" stroke="#DD6688" strokeWidth="0.7"/>
    <circle cx="40" cy="14" r="4.5" fill="#FFCCDD"/>
    <circle cx="31" cy="38" r="6" fill="white" stroke="#333" strokeWidth="1"/><circle cx="49" cy="38" r="6" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="31" cy="38" r="3.8" fill="#AA1144"/><circle cx="49" cy="38" r="3.8" fill="#AA1144"/>
    <circle cx="29.5" cy="36.5" r="1.4" fill="white"/><circle cx="47.5" cy="36.5" r="1.4" fill="white"/>
    <ellipse cx="40" cy="44" rx="2.8" ry="2" fill="#CC2255"/>
    <path d="M33 49 Q40 56 47 49" fill="#AA1133" stroke="#880022" strokeWidth="0.7"/>
    <ellipse cx="40" cy="52" rx="4.5" ry="3" fill="#FF9999"/>
    <ellipse cx="26" cy="44" rx="4.5" ry="3" fill="#FFBBCC" opacity="0.4"/>
    <ellipse cx="54" cy="44" rx="4.5" ry="3" fill="#FFBBCC" opacity="0.4"/>
  </svg>
);
const Decoy6 = ({ size }) => ( // Yellow round (very similar — hardest decoy)
  <svg width={size} height={size} viewBox="0 0 80 80">
    {[20,60,100,140,180,220,260,300,340].map((a,i)=>{
      const r=a*Math.PI/180;
      return <ellipse key={i} cx={40+26*Math.cos(r)} cy={42+26*Math.sin(r)} rx="5" ry="8"
        fill="#F0B000" stroke="#C89000" strokeWidth="0.5"
        transform={`rotate(${a} ${40+26*Math.cos(r)} ${42+26*Math.sin(r)})`}/>;
    })}
    <circle cx="40" cy="42" r="22" fill="#F2C200" stroke="#C8A000" strokeWidth="1"/>
    <ellipse cx="40" cy="48" rx="12" ry="9" fill="#F8DC60" opacity="0.7"/>
    <circle cx="31" cy="37" r="6" fill="white" stroke="#222" strokeWidth="1"/><circle cx="49" cy="37" r="6" fill="white" stroke="#222" strokeWidth="1"/>
    <circle cx="31" cy="37" r="3.8" fill="#1a1a1a"/><circle cx="49" cy="37" r="3.8" fill="#1a1a1a"/>
    <circle cx="29.5" cy="35.5" r="1.4" fill="white"/><circle cx="47.5" cy="35.5" r="1.4" fill="white"/>
    <ellipse cx="40" cy="44" rx="2.8" ry="2" fill="#C89000"/>
    <path d="M34 48 Q40 45 46 48" stroke="#443" strokeWidth="1.2" fill="none"/>
    <ellipse cx="26" cy="44" rx="4" ry="2.5" fill="#FFEE88" opacity="0.35"/>
    <ellipse cx="54" cy="44" rx="4" ry="2.5" fill="#FFEE88" opacity="0.35"/>
    <circle cx="40" cy="16" r="6" fill="#F2C200" stroke="#C8A000" strokeWidth="0.7"/>
  </svg>
);

const DECOYS = [Decoy1, Decoy2, Decoy3, Decoy4, Decoy5, Decoy6];

// ═══════════════════════════════════════════════════════
// LEVEL CONFIG — 10 levels, getting harder
// ═══════════════════════════════════════════════════════
const LEVELS = [
  { id:1, name:"🏖️ Sunny Beach",       bg:["#87CEEB","#98D8E8","#B8E8C8"], time:40, decoys:6,  pombonSize:52, disguise:"none",        hint:3, desc:"Pombon is relaxing on the beach!" },
  { id:2, name:"🌊 Coral Reef",         bg:["#0a3a5a","#0d5080","#1a6a90"], time:38, decoys:8,  pombonSize:48, disguise:"sunglasses",  hint:3, desc:"Pombon went diving with sunglasses!" },
  { id:3, name:"🌸 Cherry Blossom",     bg:["#FFB7C5","#FFD0DC","#FFF0F4"], time:36, decoys:9,  pombonSize:46, disguise:"bow",         hint:2, desc:"Pombon is wearing a bow in the garden!" },
  { id:4, name:"🏙️ Neon City",          bg:["#0d0221","#1a0535","#2d0a4e"], time:34, decoys:10, pombonSize:44, disguise:"hat",         hint:2, desc:"Pombon snuck into the city with a hat!" },
  { id:5, name:"🎪 Wild Carnival",      bg:["#1a0a2e","#2d1040","#4d1a60"], time:32, decoys:11, pombonSize:42, disguise:"mustache",    hint:2, desc:"Pombon has a magnificent mustache!" },
  { id:6, name:"🏔️ Snowy Peak",         bg:["#c8deff","#ddeeff","#eef5ff"], time:30, decoys:12, pombonSize:40, disguise:"mask",        hint:2, desc:"Pombon is all masked up in the snow!" },
  { id:7, name:"🌋 Volcano Island",     bg:["#2a0a00","#4a1500","#6a2800"], time:28, decoys:13, pombonSize:38, disguise:"pirate",      hint:1, desc:"Ahoy! Pirate Pombon on the volcano!" },
  { id:8, name:"🔮 Magic Forest",       bg:["#0a1a0a","#0a2a0a","#1a3a10"], time:26, decoys:14, pombonSize:36, disguise:"wizard",      hint:1, desc:"Pombon cast a disguise spell!" },
  { id:9, name:"🥷 Shadow Temple",      bg:["#050505","#0a0a0a","#111111"], time:24, decoys:15, pombonSize:34, disguise:"ninja",       hint:1, desc:"Ninja Pombon blends into the darkness!" },
  { id:10,name:"🌺 Final Paradise",     bg:["#1a0535","#2d0a4e","#4a1580"], time:22, decoys:16, pombonSize:32, disguise:"flower",      hint:1, desc:"Pombon hides in paradise — final level!" },
];

// Generate random positions (no overlap)
const genPositions = (count, pombonPos) => {
  const positions = [];
  const minDist = 14;
  const all = [pombonPos];
  let attempts = 0;
  while (positions.length < count && attempts < 500) {
    attempts++;
    const x = 5 + Math.random() * 88;
    const y = 8 + Math.random() * 80;
    const ok = all.every(p => Math.hypot(p.x-x, p.y-y) > minDist);
    if (ok) { positions.push({ x, y }); all.push({ x, y }); }
  }
  return positions;
};

// Scene decoration components
const SceneDeco = ({ level, idx }) => {
  const decos = {
    1: [
      <svg key={idx} style={{position:"absolute",left:`${(idx*17+5)%90}%`,top:`${(idx*23+70)%20+75}%`,pointerEvents:"none",opacity:0.7}} width="20" height="15"><ellipse cx="10" cy="10" rx="9" ry="5" fill="#F4D03F"/><polygon points="0,8 3,10 0,12" fill="#F4D03F"/></svg>,
      <div key={idx} style={{position:"absolute",left:`${(idx*13+3)%85}%`,top:`${(idx*19+5)%15+3}%`,width:40,height:25,borderRadius:"50%",background:"rgba(255,255,255,0.7)",pointerEvents:"none"}}/>,
    ],
    2: [<svg key={idx} style={{position:"absolute",left:`${(idx*19+4)%88}%`,top:`${(idx*11+72)%22+72}%`,pointerEvents:"none",opacity:0.6}} width="14" height="28"><path d="M7 28 Q2 20 7 14 Q12 8 7 0" stroke="#2ecc71" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>],
    3: [<svg key={idx} style={{position:"absolute",left:`${(idx*22+6)%90}%`,top:`${(idx*17+72)%20+75}%`,pointerEvents:"none",opacity:0.8}} width="18" height="18" viewBox="0 0 18 18">{[0,60,120,180,240,300].map(a=><ellipse key={a} cx={9+4*Math.cos(a*Math.PI/180)} cy={9+4*Math.sin(a*Math.PI/180)} rx="3" ry="5" fill="#FF69B4" opacity="0.9" transform={`rotate(${a} ${9+4*Math.cos(a*Math.PI/180)} ${9+4*Math.sin(a*Math.PI/180)})`}/>)}<circle cx="9" cy="9" r="3" fill="#FFD700"/></svg>],
    4: [<div key={idx} style={{position:"absolute",left:`${(idx*14+3)%85}%`,top:`${(idx*21+4)%20+4}%`,background:"rgba(255,0,255,0.15)",border:"1px solid rgba(255,0,255,0.6)",color:"#ff00ff",fontSize:9,fontFamily:"monospace",fontWeight:900,padding:"1px 5px",borderRadius:2,textShadow:"0 0 6px #ff00ff",pointerEvents:"none"}}>{"NEON"[idx%4]||"LED"}</div>],
    5: [<svg key={idx} style={{position:"absolute",left:`${(idx*18+8)%88}%`,top:`${(idx*14+5)%25+3}%`,pointerEvents:"none",opacity:0.7}} width="20" height="28"><ellipse cx="10" cy="10" rx="9" ry="11" fill={["#FF6B6B","#4ECDC4","#FFD93D","#6BCB77"][idx%4]}/><line x1="10" y1="21" x2="10" y2="28" stroke="#888" strokeWidth="1"/></svg>],
    6: [<svg key={idx} style={{position:"absolute",left:`${(idx*23+5)%90}%`,top:`${(idx*17+10)%30+8}%`,pointerEvents:"none",opacity:0.6}} width="14" height="14" viewBox="0 0 14 14">{[0,60,120].map(a=><line key={a} x1={7+6*Math.cos(a*Math.PI/180)} y1={7+6*Math.sin(a*Math.PI/180)} x2={7-6*Math.cos(a*Math.PI/180)} y2={7-6*Math.sin(a*Math.PI/180)} stroke="white" strokeWidth="1.5" opacity="0.7"/>)}</svg>],
    7: [<svg key={idx} style={{position:"absolute",left:`${(idx*16+4)%88}%`,top:`${(idx*22+65)%25+68}%`,pointerEvents:"none",opacity:0.5}} width="16" height="30"><line x1="8" y1="0" x2="8" y2="30" stroke="#FF4400" strokeWidth="3"/><ellipse cx="8" cy="3" rx="6" ry="4" fill="#FF6600"/></svg>],
    8: [<div key={idx} style={{position:"absolute",left:`${(idx*21+3)%88}%`,top:`${(idx*13+5)%25+5}%`,width:6,height:6,borderRadius:"50%",background:["#FF6B6B","#4ECDC4","#FFD700","#AA66FF"][idx%4],boxShadow:`0 0 10px ${["#FF6B6B","#4ECDC4","#FFD700","#AA66FF"][idx%4]}`,pointerEvents:"none"}}/>],
    9: [<div key={idx} style={{position:"absolute",left:`${(idx*17+5)%88}%`,top:`${(idx*23+5)%80+5}%`,width:30,height:30,background:"rgba(0,0,0,0.5)",borderRadius:2,pointerEvents:"none",border:"1px solid rgba(255,255,255,0.03)"}}/>],
    10:[<svg key={idx} style={{position:"absolute",left:`${(idx*19+4)%88}%`,top:`${(idx*11+70)%22+72}%`,pointerEvents:"none",opacity:0.8}} width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill={["#FF6B9D","#FF9966","#FFDD44","#88DD44","#66BBFF"][idx%5]} opacity="0.7"/></svg>],
  };
  const arr = decos[level] || decos[1];
  return arr[idx % arr.length];
};

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function FindPombon() {
  const [screen, setScreen] = useState("menu"); // menu|game|levelComplete|gameOver|victory
  const [levelIdx, setLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [hints, setHints] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [positions, setPositions] = useState({ pombon: {x:50,y:50}, decoys: [] });
  const [decoyTypes, setDecoyTypes] = useState([]);
  const [wrongFx, setWrongFx] = useState(null);
  const [foundFx, setFoundFx] = useState(false);
  const [shake, setShake] = useState(false);
  const [muted, setMuted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem("pombonHS")||"0"));
  const timerRef = useRef(null);
  const level = LEVELS[levelIdx];

  // Setup level
  const setupLevel = useCallback((idx) => {
    const lv = LEVELS[idx];
    const px = 8 + Math.random() * 82;
    const py = 10 + Math.random() * 76;
    const dp = genPositions(lv.decoys, {x:px,y:py});
    const dt = dp.map(() => DECOYS[Math.floor(Math.random()*DECOYS.length)]);
    setPositions({ pombon:{x:px,y:py}, decoys:dp });
    setDecoyTypes(dt);
    setTimeLeft(lv.time);
    setHints(lv.hint);
    setShowHint(false);
    setFoundFx(false);
    setShake(false);
  }, []);

  // Timer
  useEffect(() => {
    if (screen !== "game") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          AudioEngine.sfx.gameOver();
          setLives(l => {
            const nl = l - 1;
            if (nl <= 0) { setScreen("gameOver"); AudioEngine.stopMusic(); }
            else {
              setShake(true);
              setTimeout(() => { setShake(false); setupLevel(levelIdx); }, 700);
            }
            return nl;
          });
          return 0;
        }
        if (t <= 6) AudioEngine.sfx.tick();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, levelIdx, setupLevel]);

  const startGame = () => {
    setLevelIdx(0); setScore(0); setLives(3); setCombo(0); setStreak(0);
    setupLevel(0); setScreen("game");
    AudioEngine.startMusic();
  };

  const foundPombon = () => {
    if (screen !== "game") return;
    clearInterval(timerRef.current);
    const newCombo = combo + 1;
    const timeBonus = timeLeft * 3;
    const comboBonus = newCombo >= 3 ? newCombo * 50 : 0;
    const pts = 300 + timeBonus + comboBonus;
    const newScore = score + pts;
    const newStreak = streak + 1;
    setCombo(newCombo);
    setScore(newScore);
    setStreak(newStreak);
    setFoundFx(true);
    if (newCombo >= 3) AudioEngine.sfx.combo();
    else AudioEngine.sfx.found();
    setTimeout(() => {
      const nextIdx = levelIdx + 1;
      if (nextIdx >= LEVELS.length) {
        const finalScore = newScore;
        setTotalScore(finalScore);
        if (finalScore > highScore) { setHighScore(finalScore); localStorage.setItem("pombonHS", finalScore); }
        setScreen("victory"); AudioEngine.stopMusic();
      } else {
        AudioEngine.sfx.levelUp();
        setLevelIdx(nextIdx);
        setupLevel(nextIdx);
        setScreen("levelComplete");
        setTimeout(() => { setScreen("game"); AudioEngine.startMusic(); }, 2200);
      }
    }, 900);
  };

  const wrongClick = (e) => {
    if (screen !== "game") return;
    e.stopPropagation();
    setCombo(0);
    setWrongFx({ x: e.clientX, y: e.clientY, id: Date.now() });
    AudioEngine.sfx.wrong();
    setTimeout(() => setWrongFx(null), 700);
  };

  const useHint = () => {
    if (hints <= 0 || showHint || screen !== "game") return;
    AudioEngine.sfx.hint();
    setHints(h => h - 1);
    setShowHint(true);
    setTimeout(() => setShowHint(false), 2500);
  };

  const toggleMute = () => {
    const m = AudioEngine.toggleMute();
    setMuted(m);
  };

  const timerPct = (timeLeft / level.time) * 100;
  const timerCol = timerPct > 55 ? "#4ade80" : timerPct > 25 ? "#fbbf24" : "#f87171";

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;800;900&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a0014;font-family:'Nunito',sans-serif;overflow-x:hidden}
    @keyframes pomFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes shakeX{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-7px)}80%{transform:translateX(7px)}}
    @keyframes wrongPop{0%{opacity:1;transform:scale(1) translate(-50%,-50%)}100%{opacity:0;transform:scale(3) translate(-50%,-50%)}}
    @keyframes foundPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
    @keyframes hintRing{0%,100%{box-shadow:0 0 20px #F4C842,0 0 40px #F4C842}50%{box-shadow:0 0 40px #F4C842,0 0 80px #F4C842,0 0 120px #F4A800}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
    @keyframes comboFlash{0%{opacity:0;transform:scale(0.5)}50%{opacity:1;transform:scale(1.3)}100%{opacity:0;transform:scale(1)}}
    @keyframes starSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes heartbeat{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
    .btn{background:linear-gradient(135deg,#F4C842,#E8A800);color:#1a0a00;border:none;padding:14px 40px;border-radius:50px;font-size:16px;font-weight:900;cursor:pointer;font-family:'Nunito',sans-serif;box-shadow:0 4px 24px #F4C84244;transition:all 0.15s;letter-spacing:0.04em}
    .btn:hover{transform:translateY(-2px) scale(1.03);box-shadow:0 6px 32px #F4C84466}
    .btn:active{transform:scale(0.97)}
    .btn-ghost{background:transparent;color:#aaa;border:1px solid #333;padding:12px 28px;border-radius:50px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif;transition:all 0.15s}
    .btn-ghost:hover{border-color:#666;color:#fff}
  `;

  // ── MENU ────────────────────────────────────────────────────────
  if (screen === "menu") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0a0014,#0d1a3a,#0a1a08)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      {/* Floating bg pombons */}
      {[12,28,55,72,88,40].map((x,i)=>(
        <div key={i} style={{position:"absolute",left:`${x}%`,top:`${[8,20,55,15,70,40][i]}%`,opacity:0.06,animation:`pomFloat ${2.5+i*0.4}s ease-in-out infinite`,animationDelay:`${i*0.35}s`,pointerEvents:"none"}}>
          <PombonSVG size={50+i*12}/>
        </div>
      ))}
      <div style={{background:"radial-gradient(ellipse at center, rgba(244,200,66,0.08) 0%, transparent 70%)",position:"absolute",inset:0,pointerEvents:"none"}}/>

      <div style={{animation:"pomFloat 2.5s ease-in-out infinite",marginBottom:20,filter:"drop-shadow(0 0 20px rgba(244,200,66,0.4))"}}>
        <PombonSVG size={110}/>
      </div>

      <h1 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(36px,9vw,72px)",color:"#F4C842",textAlign:"center",lineHeight:1,marginBottom:8,textShadow:"0 0 40px rgba(244,200,66,0.35)"}}>
        Find Pombon!
      </h1>
      <p style={{color:"#8899AA",fontSize:"clamp(13px,2vw,16px)",marginBottom:10,textAlign:"center"}}>
        The world's fluffiest hide-and-seek game 🐾
      </p>

      {highScore > 0 && (
        <div style={{background:"rgba(244,200,66,0.1)",border:"1px solid rgba(244,200,66,0.3)",borderRadius:12,padding:"8px 20px",marginBottom:16,fontSize:13,color:"#F4C842",fontWeight:800}}>
          🏆 Best Score: {highScore.toLocaleString()}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:28,maxWidth:380,width:"100%"}}>
        {[["🎮","10 Levels","Getting harder"],["❤️","3 Lives","Don't waste them"],["🥇","Combos","Chain finds!"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"14px 10px",textAlign:"center"}}>
            <div style={{fontSize:24,marginBottom:4}}>{e}</div>
            <div style={{fontSize:12,fontWeight:900,color:"#F4C842"}}>{t}</div>
            <div style={{fontSize:11,color:"#556",marginTop:2}}>{d}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        <button className="btn" onClick={startGame} style={{fontSize:18,padding:"16px 52px"}}>
          🔍 Play Now!
        </button>
        <button className="btn-ghost" onClick={toggleMute}>
          {muted ? "🔇 Muted" : "🔊 Sound On"}
        </button>
      </div>

      <div style={{marginTop:32,display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}}>
        {LEVELS.slice(0,5).map((lv,i)=>(
          <div key={i} style={{background:`linear-gradient(135deg,${lv.bg[0]},${lv.bg[1]})`,borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700,color:"rgba(255,255,255,0.85)",border:"1px solid rgba(255,255,255,0.1)"}}>
            {lv.name}
          </div>
        ))}
        <div style={{color:"#444",fontSize:12,fontWeight:700,padding:"6px 14px"}}>+5 more...</div>
      </div>
    </div>
  );

  // ── LEVEL COMPLETE TRANSITION ──────────────────────────────────
  if (screen === "levelComplete") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0014,#1a1a00)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif",padding:24,animation:"slideIn 0.4s ease"}}>
      <style>{CSS}</style>
      <div style={{fontSize:64,marginBottom:8,animation:"heartbeat 0.6s ease infinite"}}>✨</div>
      <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(28px,6vw,48px)",color:"#4ade80",marginBottom:6,textAlign:"center"}}>
        Pombon Found!
      </h2>
      {combo >= 3 && (
        <div style={{background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",color:"white",padding:"8px 24px",borderRadius:50,fontWeight:900,fontSize:18,marginBottom:12,animation:"comboFlash 0.8s ease"}}>
          🔥 {combo}x COMBO!
        </div>
      )}
      <div style={{fontSize:36,fontWeight:900,color:"#F4C842",marginBottom:4}}>{score.toLocaleString()}</div>
      <div style={{color:"#556",fontSize:13,marginBottom:16}}>Score so far</div>
      <div style={{color:"#888",fontSize:14}}>
        Next: <strong style={{color:"#F4C842"}}>{LEVELS[levelIdx]?.name}</strong>
      </div>
    </div>
  );

  // ── GAME OVER ──────────────────────────────────────────────────
  if (screen === "gameOver") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1a0000,#2d0000)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif",padding:24,animation:"fadeUp 0.5s ease"}}>
      <style>{CSS}</style>
      <div style={{fontSize:72,marginBottom:12,opacity:0.6}}>💀</div>
      <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(28px,6vw,48px)",color:"#f87171",marginBottom:8,textAlign:"center"}}>Time's Up!</h2>
      <p style={{color:"#778",marginBottom:24,textAlign:"center"}}>Pombon escaped... this time.</p>
      <div style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",borderRadius:16,padding:"20px 40px",textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:44,fontWeight:900,color:"#f87171"}}>{score.toLocaleString()}</div>
        <div style={{color:"#556",fontSize:13}}>Final Score</div>
        <div style={{marginTop:8,color:"#666",fontSize:12}}>Reached Level {levelIdx+1} · {streak} levels completed</div>
        {score > highScore && <div style={{color:"#F4C842",fontWeight:900,fontSize:13,marginTop:6}}>🏆 New High Score!</div>}
      </div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        <button className="btn" onClick={startGame}>🔄 Try Again</button>
        <button className="btn-ghost" onClick={()=>setScreen("menu")}>🏠 Menu</button>
      </div>
    </div>
  );

  // ── VICTORY ────────────────────────────────────────────────────
  if (screen === "victory") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#0a0535,#0d2a0a,#1a0535)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito',sans-serif",padding:24,animation:"fadeUp 0.5s ease",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      {[...Array(12)].map((_,i)=>(
        <div key={i} style={{position:"absolute",left:`${(i*8+5)%92}%`,top:`${(i*7+5)%88}%`,fontSize:20,animation:`starSpin ${2+i%3}s linear infinite`,opacity:0.4,pointerEvents:"none"}}>⭐</div>
      ))}
      <div style={{animation:"pomFloat 2s ease-in-out infinite",marginBottom:16,filter:"drop-shadow(0 0 30px gold)"}}>
        <PombonSVG size={120}/>
      </div>
      <h1 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(28px,7vw,60px)",color:"#F4C842",textAlign:"center",marginBottom:8,textShadow:"0 0 30px #F4C84266"}}>
        You're a Legend! 🏆
      </h1>
      <p style={{color:"#a0b0c0",marginBottom:24,textAlign:"center",fontSize:15}}>
        You found Pombon through all 10 levels!
      </p>
      <div style={{background:"rgba(244,200,66,0.1)",border:"2px solid #F4C842",borderRadius:20,padding:"28px 48px",textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:56,fontWeight:900,color:"#F4C842"}}>{totalScore.toLocaleString()}</div>
        <div style={{color:"#888",fontSize:14,marginBottom:12}}>FINAL SCORE</div>
        {totalScore >= highScore && <div style={{color:"#4ade80",fontWeight:900,fontSize:14}}>🎉 NEW HIGH SCORE!</div>}
        <div style={{display:"flex",gap:24,justifyContent:"center",marginTop:12}}>
          {[["🎮","10","Levels"],["🔥",Math.max(combo,streak),"Best Combo"],["❤️",3-lives+1,"Lives Used"]].map(([e,v,l])=>(
            <div key={l}><div style={{color:"#F4C842",fontWeight:800,fontSize:20}}>{e} {v}</div><div style={{color:"#556",fontSize:11}}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        <button className="btn" onClick={startGame}>🔄 Play Again</button>
        <button className="btn-ghost" onClick={()=>setScreen("menu")}>🏠 Menu</button>
      </div>
    </div>
  );

  // ── MAIN GAME SCREEN ───────────────────────────────────────────
  const bgGrad = `linear-gradient(160deg,${level.bg[0]},${level.bg[1]},${level.bg[2]})`;

  return (
    <div style={{minHeight:"100vh",background:"#050010",display:"flex",flexDirection:"column",fontFamily:"'Nunito',sans-serif"}}>
      <style>{CSS}</style>

      {/* HUD */}
      <div style={{background:"rgba(0,0,0,0.92)",backdropFilter:"blur(12px)",padding:"10px 16px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",borderBottom:"1px solid rgba(255,255,255,0.06)",zIndex:100,position:"sticky",top:0}}>
        {/* Lives */}
        <div style={{display:"flex",gap:3}}>
          {[...Array(3)].map((_,i)=>(
            <span key={i} style={{fontSize:18,opacity:i<lives?1:0.2,animation:i<lives?"heartbeat 1.5s ease-in-out infinite":"none",animationDelay:`${i*0.2}s`}}>❤️</span>
          ))}
        </div>
        {/* Level */}
        <div style={{fontSize:12,fontWeight:900,color:"#F4C842",minWidth:50}}>LV {level.id}/10</div>
        <div style={{fontSize:11,color:"#667",flex:1,minWidth:60,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{level.name}</div>
        {/* Timer bar */}
        <div style={{width:100,background:"#1a1a2e",borderRadius:20,height:9,overflow:"hidden"}}>
          <div style={{width:`${timerPct}%`,height:"100%",background:timerCol,transition:"width 1s linear",borderRadius:20,boxShadow:`0 0 8px ${timerCol}`}}/>
        </div>
        <div style={{fontSize:15,fontWeight:900,color:timerCol,minWidth:28,textAlign:"right"}}>{timeLeft}</div>
        {/* Score */}
        <div style={{fontSize:13,color:"#888"}}>🎯<span style={{color:"#F4C842",fontWeight:800,marginLeft:2}}>{score.toLocaleString()}</span></div>
        {/* Combo */}
        {combo >= 2 && (
          <div style={{background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",color:"white",padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:900,animation:"heartbeat 0.5s ease infinite"}}>
            🔥{combo}x
          </div>
        )}
        {/* Hint */}
        <button onClick={useHint} disabled={hints<=0||showHint} style={{background:hints>0?"rgba(244,200,66,0.12)":"rgba(50,50,50,0.2)",color:hints>0?"#F4C842":"#333",border:`1px solid ${hints>0?"rgba(244,200,66,0.3)":"#1a1a1a"}`,padding:"4px 10px",borderRadius:20,fontSize:11,cursor:hints>0?"pointer":"default",fontWeight:800,fontFamily:"inherit"}}>
          💡{hints}
        </button>
        {/* Mute */}
        <button onClick={toggleMute} style={{background:"transparent",border:"1px solid #1a1a2e",color:"#556",padding:"4px 8px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
          {muted?"🔇":"🔊"}
        </button>
      </div>

      {/* Hint bar */}
      <div style={{background:"rgba(244,200,66,0.06)",padding:"5px 16px",fontSize:11,color:"#889",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
        {level.desc} · <strong style={{color:"#F4C842"}}>Look for the golden spiky Pokémon with red nose!</strong>
      </div>

      {/* Scene */}
      <div style={{flex:1,position:"relative",overflow:"hidden",background:bgGrad,minHeight:440,animation:shake?"shakeX 0.5s ease":"none"}}>

        {/* Background decorations */}
        {[...Array(Math.min(level.decoys+4, 14))].map((_,i)=>(
          <SceneDeco key={i} level={level.id} idx={i}/>
        ))}

        {/* Wrong click FX */}
        {wrongFx && (
          <div style={{position:"fixed",left:wrongFx.x,top:wrongFx.y,fontSize:26,animation:"wrongPop 0.7s ease forwards",pointerEvents:"none",zIndex:9999,transform:"translate(-50%,-50%)"}}>❌</div>
        )}

        {/* Hint glow ring */}
        {showHint && (
          <div style={{position:"absolute",left:`${positions.pombon.x}%`,top:`${positions.pombon.y}%`,width:level.pombonSize+24,height:level.pombonSize+24,borderRadius:"50%",border:"3px solid #F4C842",transform:"translate(-50%,-50%)",animation:"hintRing 0.5s ease-in-out infinite",pointerEvents:"none",zIndex:20}}/>
        )}

        {/* Decoys */}
        {positions.decoys.map((pos, i) => {
          const DC = decoyTypes[i] || Decoy1;
          const sz = level.pombonSize * (0.75 + (i%3)*0.1);
          return (
            <div key={i} onClick={wrongClick}
              style={{position:"absolute",left:`${pos.x}%`,top:`${pos.y}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:5,transition:"transform 0.1s"}}
              onMouseEnter={e=>e.currentTarget.style.transform="translate(-50%,-50%) scale(1.06)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translate(-50%,-50%)"}>
              <DC size={sz}/>
            </div>
          );
        })}

        {/* POMBON */}
        <div onClick={foundPombon}
          style={{position:"absolute",left:`${positions.pombon.x}%`,top:`${positions.pombon.y}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:6,animation:foundFx?"foundPulse 0.4s ease":"none",transition:"transform 0.1s"}}
          onMouseEnter={e=>{if(!foundFx)e.currentTarget.style.transform="translate(-50%,-50%) scale(1.06)"}}
          onMouseLeave={e=>e.currentTarget.style.transform="translate(-50%,-50%)"}>
          <PombonSVG size={level.pombonSize} disguise={level.disguise}/>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{background:"rgba(0,0,0,0.9)",padding:"7px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,color:"#333"}}>
        <span>Tap Pombon (the golden spiky one!) · ❌ = wrong</span>
        <span style={{color:"#F4C842",fontWeight:700}}>💡 hint = 2.5s glow</span>
      </div>
    </div>
  );
}
