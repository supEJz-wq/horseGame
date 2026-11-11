export const horses = [
 {name:'Thunderbolt',color:'#353338',gear:'#e4b342',odds:4.5,speed:87,acc:85,stamina:87,trait:'The all-rounder'},
 {name:'Crimson Dash',color:'#a74930',gear:'#f27464',odds:6,speed:84,acc:98,stamina:78,trait:'Quick off the mark'},
 {name:'Golden Comet',color:'#ce9148',gear:'#f5d563',odds:5,speed:94,acc:76,stamina:87,trait:'The late challenger'},
 {name:'Shadow Runner',color:'#57585d',gear:'#e1e0d3',odds:8,speed:89,acc:85,stamina:83,trait:'Expect the unexpected'},
 {name:'Blue Lightning',color:'#353e54',gear:'#72b9e0',odds:3.5,speed:98,acc:84,stamina:78,trait:'Built for pure speed'},
 {name:'Emerald Storm',color:'#855236',gear:'#72b886',odds:7,speed:82,acc:81,stamina:99,trait:'Goes the distance'},
 {name:'Midnight Blaze',color:'#302d38',gear:'#b797de',odds:9,speed:89,acc:99,stamina:74,trait:'An explosive starter'},
 {name:'Silver Phantom',color:'#a7aaa3',gear:'#d6dce3',odds:5.5,speed:91,acc:83,stamina:92,trait:'Quietly unstoppable'}
];
export type Kind='Win'|'Place'|'Show'|'Exacta'|'Quinella';
export type Bet={id:number;horses:number[];kind:Kind;amount:number;odds:number};
export const rules:Record<Kind,string>={Win:'Your horse must finish 1st.',Place:'Your horse must finish in the top 2.',Show:'Your horse must finish in the top 3.',Exacta:'Pick 1st and 2nd in the correct order.',Quinella:'Pick the top 2 in either order.'};
export function oddsFor(kind:Kind,ids:number[]){if(!ids.length)return 0;const a=horses[ids[0]].odds;if(kind==='Win')return a;if(kind==='Place')return +(1+(a-1)*.4).toFixed(2);if(kind==='Show')return +(1+(a-1)*.22).toFixed(2);if(ids.length<2)return 0;return +(a*horses[ids[1]].odds*(kind==='Exacta'?.65:.35)).toFixed(2)}
export function validate(kind:Kind,ids:number[],amount:number,balance:number){if(ids.length!==(kind==='Exacta'||kind==='Quinella'?2:1))return 'Select '+(kind==='Exacta'||kind==='Quinella'?'two different horses.':'one horse.');if(new Set(ids).size!==ids.length||ids.some(i=>i<0||i>7))return 'Invalid horse selection.';if(!Number.isFinite(amount)||amount<1||!Number.isInteger(amount))return 'Enter a whole-credit stake of at least 1.';if(amount>balance)return 'Not enough credits for this bet.';return ''}
export function payout(b:Bet,order:number[]){const [a,c]=b.horses;const p=order.indexOf(a);const win=b.kind==='Win'?p===0:b.kind==='Place'?p<2:b.kind==='Show'?p<3:b.kind==='Exacta'?order[0]===a&&order[1]===c:order.slice(0,2).includes(a)&&order.slice(0,2).includes(c);return win?Math.round(b.amount*b.odds):0}
export function rng(seed:number){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
export type Race={frames:number[][];order:number[];times:number[]};
export function simulate(seed:number):Race{const rand=rng(seed),pos=horses.map(()=>0),vel=horses.map(()=>0),form=horses.map((_,i)=>.88+rand()*(i===3?.3:.22)),times=horses.map(()=>Infinity),frames=[pos.slice()];let t=0;while(times.some(x=>!isFinite(x))&&t<35){t+=.05;horses.forEach((h,i)=>{if(pos[i]>=100)return;const target=(6.5+h.speed*.025)*form[i]*(1-Math.max(0,t-6)*(100-h.stamina)*.0005)+(pos[i]>72?(h.stamina/100)*.65:0);vel[i]+= (target-vel[i])*(.035+h.acc*.0004);pos[i]=Math.min(100,pos[i]+vel[i]*.05*(.96+rand()*.08));if(pos[i]>=100)times[i]=t});frames.push(pos.slice())}return {frames,order:times.map((_,i)=>i).sort((a,b)=>times[a]-times[b]||a-b),times}}
