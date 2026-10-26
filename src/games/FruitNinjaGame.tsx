import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameProps, GameResult } from '../types';

type Fruit = {id:number;x:number;y:number;vx:number;vy:number;emoji:string;wordIndex:number;cut:boolean;radius:number};
/** Fruit-slice arcade: corta objetos reales con un gesto táctil o del ratón. */
export const FruitNinjaGame: React.FC<GameProps> = ({ words, onCorrect, onWrong, onComplete, difficulty }) => {
  const canvasRef=useRef<HTMLCanvasElement>(null),raf=useRef(0),pointer=useRef<{x:number;y:number;down:boolean}>({x:0,y:0,down:false}),trail=useRef<{x:number;y:number;life:number}[]>([]);
  const game=useRef({fruits:[] as Fruit[],last:0,spawn:0,score:0,correct:0,wrong:0,started:0,elapsed:0,done:false,cursor:0,missed:0});
  const deck=useMemo(()=>words.slice(0,Math.max(1,Math.min(words.length,12))),[words]);
  const [hud,setHud]=useState({score:0,message:'Desliza el dedo o el ratón sobre las frutas para cortarlas.'});
  const finish=useCallback(()=>{const g=game.current;if(g.done)return;g.done=true;const result:GameResult={playerId:'',gameId:'fruit',correct:g.correct,wrong:g.wrong,timeMs:Date.now()-g.started,coinsEarned:g.score+g.correct*4,wordsSeen:deck.slice(0,g.correct).map(w=>w.id)};onComplete(result)},[deck,onComplete]);
  useEffect(()=>{
    const canvas=canvasRef.current,ctx=canvas?.getContext('2d');if(!canvas||!ctx)return;
    const g=game.current;g.fruits=[];g.last=performance.now();g.spawn=0;g.score=0;g.correct=0;g.wrong=0;g.started=Date.now();g.elapsed=0;g.done=false;g.cursor=0;g.missed=0;
    const resize=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,r.width*d);canvas.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0)};resize();window.addEventListener('resize',resize);
    const coords=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
    const down=(e:PointerEvent)=>{canvas.setPointerCapture?.(e.pointerId);const p=coords(e);pointer.current={...p,down:true};trail.current.push({...p,life:180});};
    const move=(e:PointerEvent)=>{const p=coords(e);if(pointer.current.down){const prev=pointer.current;trail.current.push({...p,life:220});for(const f of g.fruits){if(f.cut)continue;const dx=p.x-prev.x,dy=p.y-prev.y,len=dx*dx+dy*dy;const t=len?Math.max(0,Math.min(1,((f.x-prev.x)*dx+(f.y-prev.y)*dy)/len)):0;const nearX=prev.x+t*dx,nearY=prev.y+t*dy;if(Math.hypot(f.x-nearX,f.y-nearY)<f.radius+10){f.cut=true;if(f.emoji==='💣'){g.wrong++;g.score=Math.max(0,g.score-10);onWrong(deck[f.wordIndex]?.id||'');setHud(v=>({...v,message:'💥 ¡Bomba! Evita las bombas.'}));}else{const word=deck[f.wordIndex];g.score+=10;g.correct++;g.cursor++;if(word)onCorrect(word.id);setHud(v=>({...v,message:word?`+10 · ${word.text} = ${word.translation}`:'+10 puntos'}));}}}pointer.current={...p,down:true};}};
    const up=()=>{pointer.current.down=false};
    canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
    let lastHud=0;
    const draw=(now:number)=>{
      const dt=Math.min(34,now-g.last);g.last=now;const w=canvas.clientWidth,h=canvas.clientHeight;
      if(!g.done){g.elapsed+=dt;g.spawn-=dt;if(g.spawn<=0){const count=Math.random()<.2?2:1;for(let i=0;i<count;i++){const bomb=Math.random()<.13;const wi=g.cursor%deck.length;g.fruits.push({id:Math.random(),x:45+Math.random()*(w-90),y:h+30,vx:(Math.random()-.5)*.22,vy:-(.45+Math.random()*.18+difficulty*.035),emoji:bomb?'💣':['🍉','🍎','🍓','🍌','🍊','🍍','🥝','🍒'][Math.floor(Math.random()*8)],wordIndex:wi,cut:false,radius:bomb?23:25})}g.spawn=Math.max(420,950-difficulty*90)}
        for(const f of g.fruits){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=.00072*dt;if(f.y>h+60&&!f.cut&&f.emoji!=='💣'){g.missed++;if(g.missed>=5)finish();f.cut=true}}
        g.fruits=g.fruits.filter(f=>!f.cut&&f.y<h+80);trail.current=trail.current.map(p=>({...p,life:p.life-dt})).filter(p=>p.life>0);if(g.elapsed>45000)finish();}
      const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#064e3b');bg.addColorStop(.58,'#022c22');bg.addColorStop(1,'#020617');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
      for(let i=0;i<28;i++){ctx.fillStyle='rgba(74,222,128,.08)';ctx.beginPath();ctx.arc((i*71)%w,(i*97+g.elapsed*.03)%h,2+(i%3),0,Math.PI*2);ctx.fill()}
      for(const f of g.fruits){ctx.save();ctx.translate(f.x,f.y);ctx.font=`${f.radius*1.8}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor=f.emoji==='💣'?'#fb7185':'#4ade80';ctx.shadowBlur=15;ctx.fillText(f.emoji,0,0);ctx.shadowBlur=0;if(f.emoji!=='💣'){const word=deck[f.wordIndex];ctx.font='bold 11px system-ui';const label=(word?.text||'').slice(0,13);const tw=ctx.measureText(label).width+12;ctx.fillStyle='rgba(2,6,23,.82)';ctx.beginPath();ctx.roundRect(-tw/2,f.radius+4,tw,22,7);ctx.fill();ctx.fillStyle='#d9f99d';ctx.fillText(label,0,f.radius+15)}ctx.restore()}
      for(let i=1;i<trail.current.length;i++){const a=trail.current[i-1],b=trail.current[i];ctx.strokeStyle=`rgba(103,232,249,${Math.min(1,b.life/150)})`;ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
      ctx.fillStyle='rgba(2,6,23,.72)';ctx.beginPath();ctx.roundRect(12,12,w-24,42,13);ctx.fill();ctx.fillStyle='white';ctx.font='900 13px system-ui';ctx.textAlign='left';ctx.fillText(`🍉 ${Math.floor(g.elapsed/1000)}s   ⭐ ${g.score}`,24,38);ctx.textAlign='right';ctx.fillText(`❌ ${g.missed}/5`,w-24,38);
      if(g.done){ctx.fillStyle='rgba(2,6,23,.72)';ctx.fillRect(0,0,w,h);ctx.fillStyle='white';ctx.textAlign='center';ctx.font='900 25px system-ui';ctx.fillText(g.missed>=5?'¡FIN DE LA PARTIDA!':'¡BUEN CORTE!',w/2,h/2)}
      if(now-lastHud>250){setHud(v=>({...v,score:g.score}));lastHud=now}if(!g.done)raf.current=requestAnimationFrame(draw);
    };raf.current=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(raf.current);window.removeEventListener('resize',resize);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up)};
  },[deck,difficulty,finish,onCorrect,onWrong]);
  return <div className="w-full max-w-2xl mx-auto p-3 text-white select-none"><div className="flex justify-between items-center mb-3"><div><p className="text-xs uppercase tracking-widest font-black text-lime-300">FAYMA SLICE · ARCADE</p><h2 className="text-xl font-black">¡Corta las frutas!</h2></div><div className="rounded-xl bg-slate-900 px-3 py-2 font-black">⭐ {hud.score}</div></div><canvas ref={canvasRef} className="w-full h-[min(58vh,440px)] min-h-[320px] rounded-3xl border border-lime-300/30 touch-none cursor-crosshair" aria-label="Corta frutas deslizando el dedo o el ratón"/><p className="text-center text-xs text-slate-300 mt-3">Desliza por las frutas para cortarlas. Evita las bombas y las frutas que caen. Cada fruta muestra una palabra para aprender mientras juegas.</p><p className="text-center text-sm font-bold text-lime-200 mt-2 min-h-5">{hud.message}</p></div>;
};
