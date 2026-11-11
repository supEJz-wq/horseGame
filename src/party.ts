import {Bet,payout} from './game';
export type Player={id:string;name:string;balance:number};
export type PartyBet=Bet & {playerId:string};
export type PlayerResult={id:string;name:string;stake:number;returned:number;net:number};
export function settleParty(players:Player[],bets:PartyBet[],order:number[]){const results:PlayerResult[]=players.map(p=>{const own=bets.filter(b=>b.playerId===p.id),stake=own.reduce((n,b)=>n+b.amount,0),returned=own.reduce((n,b)=>n+payout(b,order),0);return {id:p.id,name:p.name,stake,returned,net:returned-stake}});return {players:players.map(p=>({...p,balance:p.balance+results.find(r=>r.id===p.id)!.returned})),results}}
export function refundBets(players:Player[],bets:PartyBet[]){return players.map(p=>({...p,balance:p.balance+bets.filter(b=>b.playerId===p.id).reduce((s,b)=>s+b.amount,0)}))}
