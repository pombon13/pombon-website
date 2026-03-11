import { useState, useEffect, useRef, useCallback } from "react";

const PombonSVG = ({ size = 40, disguise = "none" }) => {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 60 60">
      <circle cx="30" cy="33" r="22" fill="#F4C842" stroke="#E8A800" strokeWidth="1.5"/>
      <ellipse cx="30" cy="38" rx="12" ry="9" fill="#FDE98A"/>
      <ellipse cx="16" cy="14" rx="7" ry="10" fill="#F4C842" stroke="#E8A800" strokeWidth="1.2" transform="rotate(-15 16 14)"/>
      <ellipse cx="16" cy="14" rx="4" ry="6" fill="#F9A8C9" transform="rotate(-15 16 14)"/>
      <ellipse cx="44" cy="14" rx="7" ry="10" fill="#F4C842" stroke="#E8A800" strokeWidth="1.2" transform="rotate(15 44 14)"/>
      <ellipse cx="44" cy="14" rx="4" ry="6" fill="#F9A8C9" transform="rotate(15 44 14)"/>
      <circle cx="22" cy="30" r="7" fill="white" stroke="#333" strokeWidth="1"/>
      <circle cx="38" cy="30" r="7" fill="white" stroke="#333" strokeWidth="1"/>
      <circle cx="23.5" cy="30" r="4" fill="#1a1a1a"/>
      <circle cx="39.5" cy="30" r="4" fill="#1a1a1a"/>
      <circle cx="25" cy="28" r="1.5" fill="white"/>
      <circle cx="41" cy="28" r="1.5" fill="white"/>
      <ellipse cx="30" cy="36" rx="3" ry="2" fill="#E8A800"/>
      <path d="M26 39 Q30 43 34 39" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="17" cy="36" rx="4" ry="2.5" fill="#F9A8C9" opacity="0.5"/>
      <ellipse cx="43" cy="36" rx="4" ry="2.5" fill="#F9A8C9" opacity="0.5"/>
      {disguise === "hat" && (<g><rect x="14" y="8" width="32" height="5" rx="2" fill="#333"/><rect x="18" y="0" width="24" height="10" rx="3" fill="#222"/></g>)}
      {disguise === "sunglasses" && (<g><rect x="13" y="26" width="14" height="9" rx="4" fill="#111" opacity="0.85"/><rect x="33" y="26" width="14" height="9" rx="4" fill="#111" opacity="0.85"/><line x1="27" y1="30" x2="33" y2="30" stroke="#111" strokeWidth="2"/></g>)}
      {disguise === "mustache" && (<g><path d="M20 38 Q25 34 30 38 Q35 34 40 38" stroke="#5C3317" strokeWidth="3" fill="none" strokeLinecap="round"/></g>)}
      {disguise === "bow" && (<g><path d="M20 6 L30 12 L20 18 Z" fill="#FF6B9D"/><path d="M40 6 L30 12 L40 18 Z" fill="#FF6B9D"/><circle cx="30" cy="12" r="3" fill="#FF4080"/></g>)}
      {disguise === "mask" && (<rect x="12" y="24" width="36" height="14" rx="5" fill="#4ECDC4" opacity="0.8"/>)}
    </svg>
  );
};

const DecoyA = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <circle cx="30" cy="34" r="20" fill="#A8D8A8" stroke="#5a9a5a" strokeWidth="1.5"/>
    <ellipse cx="30" cy="40" rx="11" ry="7" fill="#C8EAC8"/>
    <circle cx="22" cy="30" r="6" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="38" cy="30" r="6" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="23" cy="30" r="3.5" fill="#1a1a1a"/>
    <circle cx="39" cy="30" r="3.5" fill="#1a1a1a"/>
    <circle cx="24" cy="28.5" r="1.2" fill="white"/>
    <circle cx="40" cy="28.5" r="1.2" fill="white"/>
    <path d="M25 38 Q30 42 35 38" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <ellipse cx="30" cy="18" rx="8" ry="5" fill="#A8D8A8" stroke="#5a9a5a" strokeWidth="1.2"/>
  </svg>
);

const DecoyB = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <ellipse cx="30" cy="36" rx="22" ry="18" fill="#C4A8E8" stroke="#8B5CBF" strokeWidth="1.5"/>
    <circle cx="30" cy="22" r="10" fill="#D4B8F0" stroke="#8B5CBF" strokeWidth="1.2"/>
    <circle cx="22" cy="31" r="6" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="38" cy="31" r="6" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="22" cy="31" r="3.5" fill="#5C3A8B"/>
    <circle cx="38" cy="31" r="3.5" fill="#5C3A8B"/>
    <circle cx="23" cy="29.5" r="1.2" fill="white"/>
    <circle cx="39" cy="29.5" r="1.2" fill="white"/>
    <path d="M26 40 Q30 37 34 40" stroke="#333" strokeWidth="1.2" fill="none"/>
  </svg>
);

const DecoyC = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <circle cx="30" cy="32" r="21" fill="#F4A460" stroke="#C67C2A" strokeWidth="1.5"/>
    <ellipse cx="30" cy="38" rx="12" ry="8" fill="#FAC88A"/>
    <circle cx="22" cy="28" r="7" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="38" cy="28" r="7" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="23" cy="29" r="4" fill="#1a1a1a"/>
    <circle cx="39" cy="29" r="4" fill="#1a1a1a"/>
    <circle cx="24.5" cy="27" r="1.5" fill="white"/>
    <circle cx="40.5" cy="27" r="1.5" fill="white"/>
    <ellipse cx="30" cy="34" rx="3" ry="2" fill="#C67C2A"/>
    <path d="M26 38 Q30 44 34 38" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <line x1="20" y1="16" x2="14" y2="6" stroke="#C67C2A" strokeWidth="2"/>
    <line x1="30" y1="12" x2="30" y2="2" stroke="#C67C2A" strokeWidth="2"/>
    <line x1="40" y1="16" x2="46" y2="6" stroke="#C67C2A" strokeWidth="2"/>
  </svg>
);

const DecoyD = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <rect x="10" y="20" width="40" height="32" rx="8" fill="#87CEEB" stroke="#4A9EC5" strokeWidth="1.5"/>
    <rect x="20" y="10" width="20" height="15" rx="4" fill="#A0D8F0" stroke="#4A9EC5" strokeWidth="1.2"/>
    <circle cx="22" cy="32" r="6" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="38" cy="32" r="6" fill="white" stroke="#333" strokeWidth="1"/>
    <circle cx="22" cy="32" r="3.5" fill="#1a6a8a"/>
    <circle cx="38" cy="32" r="3.5" fill="#1a6a8a"/>
    <circle cx="23.5" cy="30.5" r="1.2" fill="white"/>
    <circle cx="39.5" cy="30.5" r="1.2" fill="white"/>
    <path d="M24 42 Q30 46 36 42" stroke="#333" strokeWidth="1.2" fill="none"/>
  </svg>
);

const scenes = [
  { id:0, name:"🌊 Underwater Market", bg:["#0a2a4a","#0d3d6b","#1a5276"],
    description:"Pombon is hiding among the sea creatures in the deep ocean market!",
    pombon:{ x:62, y:28, size:44, disguise:"sunglasses" },
    decoys:[{C:DecoyA,x:12,y:20,size:42},{C:DecoyB,x:35,y:15,size:38},{C:DecoyC,x:78,y:18,size:40},{C:DecoyD,x:22,y:55,size:36},{C:DecoyA,x:50,y:60,size:44},{C:DecoyB,x:82,y:55,size:38},{C:DecoyC,x:8,y:65,size:36},{C:DecoyD,x:68,y:65,size:42}],
    decorations:[{type:"bubble",x:15,y:40,r:4},{type:"bubble",x:45,y:30,r:6},{type:"bubble",x:70,y:45,r:3},{type:"seaweed",x:5,y:80},{type:"seaweed",x:30,y:75},{type:"seaweed",x:55,y:82},{type:"seaweed",x:90,y:78},{type:"fish",x:40,y:48},{type:"fish",x:75,y:38},{type:"coral",x:20,y:85},{type:"coral",x:60,y:88}],
  },
  { id:1, name:"🏙️ Neon City Street", bg:["#0d0221","#1a0535","#2d0a4e"],
    description:"Pombon snuck into the neon-lit city! Find it among the street characters!",
    pombon:{ x:38, y:55, size:46, disguise:"hat" },
    decoys:[{C:DecoyB,x:10,y:15,size:40},{C:DecoyC,x:55,y:12,size:38},{C:DecoyD,x:80,y:20,size:42},{C:DecoyA,x:18,y:50,size:40},{C:DecoyC,x:60,y:48,size:36},{C:DecoyB,x:85,y:55,size:44},{C:DecoyD,x:25,y:75,size:38},{C:DecoyA,x:70,y:72,size:40}],
    decorations:[{type:"neon",x:5,y:25,label:"OPEN"},{type:"neon",x:40,y:20,label:"GANG"},{type:"neon",x:68,y:30,label:"DEEP"},{type:"window",x:8,y:5},{type:"window",x:28,y:8},{type:"window",x:50,y:3},{type:"window",x:72,y:6},{type:"star",x:15,y:60},{type:"star",x:45,y:70},{type:"star",x:92,y:40}],
  },
  { id:2, name:"🌸 Pokemon Meadow", bg:["#87CEEB","#a8d8ea","#c8ead8"],
    description:"Pombon is disguised in the meadow among wild Pokémon!",
    pombon:{ x:72, y:45, size:48, disguise:"bow" },
    decoys:[{C:DecoyA,x:8,y:30,size:44},{C:DecoyC,x:28,y:22,size:40},{C:DecoyD,x:48,y:18,size:38},{C:DecoyB,x:15,y:60,size:42},{C:DecoyA,x:42,y:55,size:46},{C:DecoyC,x:85,y:25,size:40},{C:DecoyD,x:60,y:70,size:38},{C:DecoyB,x:88,y:65,size:44}],
    decorations:[{type:"flower",x:20,y:85},{type:"flower",x:35,y:80},{type:"flower",x:55,y:87},{type:"flower",x:75,y:82},{type:"cloud",x:20,y:8},{type:"cloud",x:55,y:5},{type:"cloud",x:80,y:10},{type:"tree",x:5,y:50},{type:"tree",x:92,y:45},{type:"sun",x:90,y:8}],
  },
  { id:3, name:"🎪 Carnival Night", bg:["#1a0a2e","#2d1040","#3d1555"],
    description:"Pombon is lost in the carnival chaos! Spot the disguised Pombon!",
    pombon:{ x:22, y:38, size:50, disguise:"mustache" },
    decoys:[{C:DecoyB,x:45,y:15,size:42},{C:DecoyD,x:68,y:22,size:40},{C:DecoyA,x:85,y:35,size:38},{C:DecoyC,x:10,y:62,size:44},{C:DecoyA,x:35,y:65,size:40},{C:DecoyB,x:58,y:58,size:46},{C:DecoyD,x:78,y:65,size:38},{C:DecoyC,x:50,y:38,size:42}],
    decorations:[{type:"tent",x:10,y:5},{type:"tent",x:60,y:3},{type:"light",x:25,y:3},{type:"light",x:45,y:5},{type:"light",x:75,y:3},{type:"balloon",x:15,y:20},{type:"balloon",x:40,y:15},{type:"balloon",x:72,y:18},{type:"star",x:30,y:80},{type:"star",x:65,y:78}],
  },
  { id:4, name:"🏔️ Snowy Mountain", bg:["#c8deff","#ddeeff","#eef5ff"],
    description:"Brr! Pombon is bundled up somewhere on this icy mountain!",
    pombon:{ x:55, y:25, size:46, disguise:"mask" },
    decoys:[{C:DecoyD,x:12,y:18,size:40},{C:DecoyA,x:30,y:12,size:38},{C:DecoyC,x:75,y:15,size:42},{C:DecoyB,x:8,y:55,size:44},{C:DecoyD,x:38,y:52,size:38},{C:DecoyA,x:70,y:48,size:40},{C:DecoyC,x:88,y:58,size:36},{C:DecoyB,x:22,y:72,size:42}],
    decorations:[{type:"snowflake",x:10,y:30},{type:"snowflake",x:40,y:20},{type:"snowflake",x:65,y:40},{type:"snowflake",x:85,y:25},{type:"mountain",x:0,y:60},{type:"mountain",x:45,y:65},{type:"pine",x:5,y:75},{type:"pine",x:32,y:78},{type:"pine",x:90,y:72}],
  },
];

const Decoration = ({ type, x, y, r, label }) => {
  const style = { position:"absolute", left:`${x}%`, top:`${y}%`, pointerEvents:"none" };
  if (type==="bubble") return <div style={{...style,width:r*2,height:r*2,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)"}}/>;
  if (type==="seaweed") return <svg style={style} width="14" height="30" viewBox="0 0 14 30"><path d="M7 30 Q2 22 7 15 Q12 8 7 0" stroke="#2ecc71" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>;
  if (type==="fish") return <svg style={style} width="28" height="14" viewBox="0 0 28 14"><ellipse cx="14" cy="7" rx="11" ry="5" fill="#FF8C00" opacity="0.7"/><polygon points="3,3 0,7 3,11" fill="#FF8C00" opacity="0.7"/></svg>;
  if (type==="coral") return <svg style={style} width="24" height="18" viewBox="0 0 24 18"><path d="M12 18 L12 8 M12 12 L8 6 M12 10 L16 4" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round"/></svg>;
  if (type==="neon") return <div style={{...style,background:"rgba(255,0,255,0.15)",border:"1px solid rgba(255,0,255,0.6)",color:"#ff00ff",fontSize:10,fontFamily:"monospace",fontWeight:900,padding:"2px 6px",borderRadius:3,textShadow:"0 0 6px #ff00ff",whiteSpace:"nowrap"}}>{label}</div>;
  if (type==="window") return <div style={{...style,width:16,height:20,background:"rgba(255,200,100,0.25)",border:"1px solid rgba(255,200,100,0.5)",borderRadius:2}}/>;
  if (type==="star") return <svg style={style} width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 7.5,4.5 12,4.5 8.5,7.5 9.5,12 6,9 2.5,12 3.5,7.5 0,4.5 4.5,4.5" fill="gold" opacity="0.7"/></svg>;
  if (type==="flower") return <svg style={style} width="18" height="18" viewBox="0 0 18 18">{[0,60,120,180,240,300].map(a=><ellipse key={a} cx={9+4*Math.cos(a*Math.PI/180)} cy={9+4*Math.sin(a*Math.PI/180)} rx="3" ry="5" fill="#FF69B4" opacity="0.8" transform={`rotate(${a} ${9+4*Math.cos(a*Math.PI/180)} ${9+4*Math.sin(a*Math.PI/180)})`}/>)}<circle cx="9" cy="9" r="3" fill="#FFD700"/></svg>;
  if (type==="cloud") return <svg style={style} width="50" height="22" viewBox="0 0 50 22"><ellipse cx="25" cy="15" rx="20" ry="10" fill="white" opacity="0.85"/><ellipse cx="17" cy="13" rx="12" ry="9" fill="white" opacity="0.85"/><ellipse cx="35" cy="12" rx="13" ry="10" fill="white" opacity="0.85"/></svg>;
  if (type==="tree") return <svg style={style} width="28" height="50" viewBox="0 0 28 50"><rect x="11" y="35" width="6" height="15" fill="#8B4513"/><ellipse cx="14" cy="25" rx="13" ry="20" fill="#228B22"/></svg>;
  if (type==="sun") return <svg style={style} width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="9" fill="#FFD700"/>{[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={16+11*Math.cos(a*Math.PI/180)} y1={16+11*Math.sin(a*Math.PI/180)} x2={16+15*Math.cos(a*Math.PI/180)} y2={16+15*Math.sin(a*Math.PI/180)} stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>)}</svg>;
  if (type==="tent") return <svg style={style} width="50" height="35" viewBox="0 0 50 35"><polygon points="25,0 0,35 50,35" fill="#E74C3C" opacity="0.8"/><polygon points="25,0 12,35 38,35" fill="#C0392B" opacity="0.8"/></svg>;
  if (type==="balloon") return <svg style={style} width="20" height="28" viewBox="0 0 20 28"><ellipse cx="10" cy="10" rx="9" ry="11" fill={["#FF6B6B","#4ECDC4","#FFD93D","#6BCB77"][Math.floor(x)%4]}/><line x1="10" y1="21" x2="10" y2="28" stroke="#888" strokeWidth="1"/></svg>;
  if (type==="light") return <div style={{...style,width:8,height:8,borderRadius:"50%",background:["#ff6b6b","#ffd93d","#6bcb77","#4ecdc4"][Math.floor(x/25)%4],boxShadow:`0 0 8px ${["#ff6b6b","#ffd93d","#6bcb77","#4ecdc4"][Math.floor(x/25)%4]}`}}/>;
  if (type==="snowflake") return <svg style={style} width="16" height="16" viewBox="0 0 16 16">{[0,60,120].map(a=><line key={a} x1={8+7*Math.cos(a*Math.PI/180)} y1={8+7*Math.sin(a*Math.PI/180)} x2={8-7*Math.cos(a*Math.PI/180)} y2={8-7*Math.sin(a*Math.PI/180)} stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>)}</svg>;
  if (type==="mountain") return <svg style={{...style,opacity:0.6}} width="80" height="50" viewBox="0 0 80 50"><polygon points="40,0 0,50 80,50" fill="white"/><polygon points="40,0 28,20 52,20" fill="#cce0ff"/></svg>;
  if (type==="pine") return <svg style={style} width="22" height="40" viewBox="0 0 22 40"><rect x="9" y="30" width="4" height="10" fill="#8B4513"/><polygon points="11,0 0,20 22,20" fill="#2E8B57"/><polygon points="11,10 1,28 21,28" fill="#2E8B57"/></svg>;
  return null;
};

export default function App() {
  const [gameState, setGameState] = useState("menu");
  const [currentScene, setCurrentScene] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [wrongEffect, setWrongEffect] = useState(null);
  const [shake, setShake] = useState(false);
  const timerRef = useRef(null);
  const scene = scenes[currentScene];

  useEffect(() => {
    if (gameState !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setShake(true);
          setTimeout(() => { setShake(false); proceedNext(false); }, 800);
          return 0;
        }
        return t - 1;
      });
      setTotalTime(t => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameState, currentScene]);

  const proceedNext = (success = true) => {
    clearInterval(timerRef.current);
    if (currentScene >= scenes.length - 1) {
      setGameState("complete");
    } else {
      if (success) setGameState("found");
      else { setCurrentScene(c=>c+1); setTimeLeft(45); setShowHint(false); }
    }
  };

  const startGame = () => {
    setCurrentScene(0); setScore(0); setTotalTime(0);
    setTimeLeft(45); setHintsLeft(3); setWrongClicks(0);
    setShowHint(false); setGameState("playing");
  };

  const handlePombonClick = () => {
    if (gameState !== "playing") return;
    clearInterval(timerRef.current);
    const pts = Math.max(50, 200 + Math.floor(timeLeft*2) - (3-hintsLeft)*15 - wrongClicks*10);
    setScore(s => s + pts);
    setGameState("found");
  };

  const handleDecoyClick = (e) => {
    if (gameState !== "playing") return;
    e.stopPropagation();
    setWrongClicks(c => c+1);
    setWrongEffect({ x: e.clientX, y: e.clientY, id: Date.now() });
    setTimeout(() => setWrongEffect(null), 600);
  };

  const useHint = () => {
    if (hintsLeft <= 0 || showHint) return;
    setHintsLeft(h => h-1);
    setShowHint(true);
    setTimeout(() => setShowHint(false), 2000);
  };

  const goNext = () => {
    setCurrentScene(c=>c+1);
    setTimeLeft(45); setShowHint(false); setGameState("playing");
  };

  const timerPct = (timeLeft/45)*100;
  const timerColor = timerPct>60?"#4ade80":timerPct>30?"#fbbf24":"#f87171";

  const css = `
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
    @keyframes wrongPop{0%{opacity:1;transform:scale(1) translate(-50%,-50%)}100%{opacity:0;transform:scale(2.5) translate(-50%,-50%)}}
    @keyframes glow{0%,100%{box-shadow:0 0 20px #F4C842}50%{box-shadow:0 0 40px #F4C842,0 0 60px #F4C842}}
    @keyframes popIn{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#1a0535}
  `;

  if (gameState==="menu") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1a0535,#0d2a4a,#1a3d2a)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:20}}>
      <style>{css}</style>
      <div style={{animation:"float 2.5s ease-in-out infinite",marginBottom:16}}><PombonSVG size={100} disguise="sunglasses"/></div>
      <h1 style={{fontSize:"clamp(28px,7vw,56px)",color:"#F4C842",margin:"0 0 4px",fontWeight:900,textShadow:"0 0 30px #F4C84266",textAlign:"center"}}>Find Pombon!</h1>
      <p style={{color:"#a0c8e0",fontSize:15,margin:"0 0 28px",textAlign:"center",maxWidth:320}}>Pombon is hiding in disguise across <strong style={{color:"#F4C842"}}>5 wild scenes</strong>. Click the real Pombon before time runs out! 🔍</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:28,maxWidth:340}}>
        {[["⏱️","45 sec","Per scene"],["💡","3 hints","Per game"],["🎯","Score","Based on speed"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:4}}>{e}</div>
            <div style={{fontSize:12,fontWeight:700,color:"#F4C842"}}>{t}</div>
            <div style={{fontSize:11,color:"#666"}}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={startGame} style={{background:"linear-gradient(135deg,#F4C842,#E8A800)",color:"#1a0a00",border:"none",padding:"16px 52px",borderRadius:50,fontSize:18,fontWeight:900,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 0 30px #F4C84244"}}>🔍 Start Hunting!</button>
    </div>
  );

  if (gameState==="complete") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1a0535,#0d2a4a)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:20}}>
      <style>{css}</style>
      <div style={{animation:"float 2s ease-in-out infinite",marginBottom:16}}><PombonSVG size={110}/></div>
      <h1 style={{fontSize:"clamp(24px,6vw,48px)",color:"#F4C842",margin:"0 0 8px",fontWeight:900,textAlign:"center"}}>You found them all! 🎉</h1>
      <p style={{color:"#a0c8e0",marginBottom:28,textAlign:"center"}}>Pombon was no match for your detective skills!</p>
      <div style={{background:"rgba(244,200,66,0.1)",border:"2px solid #F4C842",borderRadius:20,padding:"24px 40px",textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:48,fontWeight:900,color:"#F4C842"}}>{score.toLocaleString()}</div>
        <div style={{color:"#888",fontSize:14}}>TOTAL SCORE</div>
        <div style={{marginTop:12,display:"flex",gap:24,justifyContent:"center"}}>
          <div><div style={{color:"#F4C842",fontWeight:700}}>{scenes.length}</div><div style={{color:"#666",fontSize:12}}>Scenes</div></div>
          <div><div style={{color:"#F4C842",fontWeight:700}}>{totalTime}s</div><div style={{color:"#666",fontSize:12}}>Time</div></div>
          <div><div style={{color:"#F4C842",fontWeight:700}}>{wrongClicks}</div><div style={{color:"#666",fontSize:12}}>Misses</div></div>
        </div>
      </div>
      <button onClick={startGame} style={{background:"linear-gradient(135deg,#F4C842,#E8A800)",color:"#1a0a00",border:"none",padding:"14px 44px",borderRadius:50,fontSize:16,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>🔄 Play Again</button>
    </div>
  );

  if (gameState==="found") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#1a0535,#0d2a4a)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:20}}>
      <style>{css}</style>
      <div style={{animation:"float 2s ease-in-out infinite",marginBottom:16}}><PombonSVG size={100} disguise={scene.pombon.disguise}/></div>
      <h2 style={{fontSize:"clamp(22px,5vw,40px)",color:"#4ade80",margin:"0 0 8px",fontWeight:900,textAlign:"center"}}>You found Pombon! ✨</h2>
      <p style={{color:"#a0c8e0",marginBottom:6,textAlign:"center"}}>Pombon was in <strong style={{color:"#F4C842"}}>{scene.name}</strong></p>
      <p style={{color:"#666",fontSize:13,marginBottom:24,textAlign:"center"}}>Disguise: <strong style={{color:"#F4C842"}}>{{hat:"Top Hat",sunglasses:"Sunglasses",mustache:"Mustache",bow:"Bow",mask:"Face Mask",none:"None"}[scene.pombon.disguise]}</strong></p>
      <div style={{background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",borderRadius:16,padding:"16px 32px",textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:36,fontWeight:900,color:"#4ade80"}}>{score.toLocaleString()}</div>
        <div style={{color:"#666",fontSize:13}}>Score so far</div>
      </div>
      {currentScene < scenes.length-1
        ? <button onClick={goNext} style={{background:"linear-gradient(135deg,#F4C842,#E8A800)",color:"#1a0a00",border:"none",padding:"14px 40px",borderRadius:50,fontSize:16,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>Next Scene →</button>
        : <button onClick={()=>setGameState("complete")} style={{background:"linear-gradient(135deg,#4ade80,#22c55e)",color:"#fff",border:"none",padding:"14px 40px",borderRadius:50,fontSize:16,fontWeight:900,cursor:"pointer",fontFamily:"inherit"}}>See Final Score 🏆</button>
      }
    </div>
  );

  const bgGrad = `linear-gradient(160deg,${scene.bg[0]},${scene.bg[1]},${scene.bg[2]})`;
  return (
    <div style={{minHeight:"100vh",background:"#0a0a14",fontFamily:"Georgia,serif",display:"flex",flexDirection:"column"}}>
      <style>{css}</style>
      <div style={{background:"rgba(0,0,0,0.85)",backdropFilter:"blur(10px)",padding:"10px 16px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#F4C842"}}>{scene.name}</div>
        <div style={{flex:1,background:"#1a1a2e",borderRadius:20,height:8,overflow:"hidden",minWidth:80}}>
          <div style={{width:`${timerPct}%`,height:"100%",background:timerColor,transition:"width 1s linear",borderRadius:20}}/>
        </div>
        <div style={{fontSize:14,fontWeight:900,color:timerColor,minWidth:32}}>{timeLeft}s</div>
        <div style={{fontSize:13,color:"#888"}}>🎯 <span style={{color:"#F4C842",fontWeight:700}}>{score}</span></div>
        <button onClick={useHint} disabled={hintsLeft<=0||showHint} style={{background:hintsLeft>0?"rgba(244,200,66,0.15)":"rgba(100,100,100,0.1)",color:hintsLeft>0?"#F4C842":"#444",border:`1px solid ${hintsLeft>0?"#F4C84244":"#222"}`,padding:"5px 12px",borderRadius:20,fontSize:12,fontFamily:"inherit",cursor:hintsLeft>0?"pointer":"default",fontWeight:700}}>💡 {hintsLeft}</button>
        <div style={{fontSize:12,color:"#555"}}>{currentScene+1}/{scenes.length}</div>
      </div>
      <div style={{background:"rgba(244,200,66,0.07)",padding:"7px 16px",fontSize:12,color:"#a0a0b0",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{scene.description}</div>
      <div style={{flex:1,position:"relative",overflow:"hidden",background:bgGrad,animation:shake?"shake 0.4s ease":"none",minHeight:460}}>
        {scene.decorations.map((d,i)=><Decoration key={i} {...d}/>)}
        {wrongEffect && <div style={{position:"fixed",left:wrongEffect.x,top:wrongEffect.y,fontSize:22,animation:"wrongPop 0.6s ease forwards",pointerEvents:"none",zIndex:999,transform:"translate(-50%,-50%)"}}>❌</div>}
        {showHint && <div style={{position:"absolute",left:`${scene.pombon.x}%`,top:`${scene.pombon.y}%`,width:scene.pombon.size+20,height:scene.pombon.size+20,borderRadius:"50%",border:"3px solid #F4C842",boxShadow:"0 0 30px #F4C842",transform:"translate(-50%,-50%)",animation:"glow 0.5s ease-in-out infinite",pointerEvents:"none",zIndex:20}}/>}
        {scene.decoys.map((d,i)=>{const{C,x,y,size}=d;return(<div key={i} onClick={handleDecoyClick} style={{position:"absolute",left:`${x}%`,top:`${y}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:5}}><C size={size}/></div>);})}
        <div onClick={handlePombonClick} style={{position:"absolute",left:`${scene.pombon.x}%`,top:`${scene.pombon.y}%`,transform:"translate(-50%,-50%)",cursor:"pointer",zIndex:6}}>
          <PombonSVG size={scene.pombon.size} disguise={scene.pombon.disguise}/>
        </div>
      </div>
      <div style={{background:"rgba(0,0,0,0.9)",padding:"8px 16px",fontSize:11,color:"#444",textAlign:"center"}}>Tap a character to catch Pombon · ❌ = wrong · 💡 = hint</div>
    </div>
  );
}
