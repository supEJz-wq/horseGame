// Original procedural score: four pulse/triangle voices and a noise drum kit.
// Notes are scheduled against AudioContext time rather than animation frames.
export type AudioMode='lobby'|'race'|'results';
const hz=(m:number)=>440*Math.pow(2,(m-69)/12);
const lead=[
[76,0,79,0,81,79,76,74,72,0,76,0,79,0,74,0],
[74,0,77,0,81,0,79,77,76,0,74,0,72,0,71,0],
[72,0,76,0,79,81,84,0,83,0,81,79,76,0,79,0],
[74,0,79,0,83,0,86,84,83,81,79,0,74,0,71,0],
[76,79,84,0,83,81,79,76,79,0,81,0,84,0,79,0],
[77,81,84,0,86,84,81,77,81,0,79,77,76,0,74,0],
[76,0,79,81,84,0,83,81,79,0,76,0,74,76,79,0],
[74,0,71,74,79,0,83,0,86,84,83,79,76,74,72,0]
];
const chords=[[48,52,55],[53,57,60],[45,48,52],[43,47,50],[48,52,55],[53,57,60],[45,48,52],[43,47,50]];
export class ArcadeAudio{
 private ctx:AudioContext|null=null;private master:GainNode|null=null;private music:GainNode|null=null;private fx:GainNode|null=null;private noise:AudioBuffer|null=null;private timer:ReturnType<typeof setInterval>|null=null;private next=0;private step=0;private muted=false;private musicOn=true;private musicVolume=.38;private fxVolume=.65;private mode:AudioMode='lobby';private hidden=false;
 async unlock(){try{if(!this.ctx){const a=this.ctx=new AudioContext();const compressor=a.createDynamicsCompressor();compressor.threshold.value=-16;compressor.ratio.value=5;this.master=a.createGain();this.master.gain.value=0;this.master.connect(compressor).connect(a.destination);this.music=a.createGain();this.fx=a.createGain();this.music.connect(this.master);this.fx.connect(this.master);this.noise=a.createBuffer(1,a.sampleRate,a.sampleRate);const data=this.noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;this.next=a.currentTime+.08;this.timer=setInterval(()=>this.schedule(),25);this.apply();}if(!this.hidden)await this.ctx.resume();}catch{/* Audio remains optional on restricted devices. */}}
 configure(muted:boolean,musicOn:boolean,musicVolume:number,fxVolume:number){this.muted=muted;this.musicOn=musicOn;this.musicVolume=musicVolume;this.fxVolume=fxVolume;this.apply()}
 setMode(mode:AudioMode){this.mode=mode;this.apply()}
 setHidden(hidden:boolean){this.hidden=hidden;if(!this.ctx)return;if(hidden)void this.ctx.suspend();else{void this.ctx.resume();this.next=this.ctx.currentTime+.08}}
 private apply(){if(!this.ctx)return;const t=this.ctx.currentTime;this.master!.gain.setTargetAtTime(this.muted?0:.7,t,.04);this.music!.gain.setTargetAtTime(this.musicOn?this.musicVolume*(this.mode==='results'?.55:1):0,t,.08);this.fx!.gain.setTargetAtTime(this.fxVolume,t,.025)}
 private note(freq:number,time:number,duration:number,volume:number,type:OscillatorType,bus:GainNode,slide?:number){if(!this.ctx)return;const a=this.ctx,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(freq,time);if(slide)o.frequency.exponentialRampToValueAtTime(slide,time+duration);g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.004);g.gain.setValueAtTime(volume,time+duration*.65);g.gain.exponentialRampToValueAtTime(.0001,time+duration);o.connect(g).connect(bus);o.start(time);o.stop(time+duration+.01);o.onended=()=>{o.disconnect();g.disconnect()}}
 private hiss(time:number,duration:number,volume:number,frequency:number,bus:GainNode){if(!this.ctx||!this.noise)return;const a=this.ctx,s=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();s.buffer=this.noise;f.type='highpass';f.frequency.value=frequency;g.gain.setValueAtTime(volume,time);g.gain.exponentialRampToValueAtTime(.0001,time+duration);s.connect(f).connect(g).connect(bus);s.start(time);s.stop(time+duration);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect()}}
 private schedule(){const a=this.ctx;if(!a||a.state!=='running'||this.hidden)return;if(this.next<a.currentTime)this.next=a.currentTime+.03;while(this.next<a.currentTime+.13){const racing=this.mode==='race',sixteenth=60/(racing?154:126)/4,b=Math.floor(this.step/16)%8,s=this.step%16,ch=chords[b],t=this.next;if(!this.muted&&this.musicOn&&this.musicVolume>0){const melody=lead[b][s];if(melody)this.note(hz(melody),t,sixteenth*(s%2? .72:1.5),.08,'square',this.music!);if(s%2===0){this.note(hz(ch[s%8===4?2:0]-12),t,sixteenth*1.7,.2,'triangle',this.music!)}this.note(hz(ch[[0,1,2,1][s%4]]+12),t,sixteenth*.55,.035,'square',this.music!);if(s%4===0)this.note(135,t,.13,.24,'sine',this.music!,42);if(s===4||s===12){this.hiss(t,.11,.12,1300,this.music!);this.note(175,t,.07,.08,'triangle',this.music!,80)}if(s%2===0||racing)this.hiss(t,.024,.04,6500,this.music!)}this.step++;this.next+=sixteenth}}
 tone(freq=600,duration=.08,type:OscillatorType='square'){if(!this.ctx||this.muted)return;this.note(freq,this.ctx.currentTime+.005,duration,.07,type,this.fx!)}
 effect(name:'click'|'bet'|'error'|'count'|'go'|'hoof'|'finish'|'victory'){
 if(!this.ctx||this.muted||this.ctx.state!=='running')return;const t=this.ctx.currentTime+.005,b=this.fx!;
 if(name==='click'){this.note(700,t,.045,.065,'square',b,1050);return}
 if(name==='error'){this.note(180,t,.17,.1,'sawtooth',b,85);return}
 if(name==='bet'){[76,79,84].forEach((n,i)=>this.note(hz(n),t+i*.065,.12,.09,'square',b));return}
 if(name==='count'){this.note(660,t,.13,.11,'square',b);this.note(330,t,.1,.05,'triangle',b);return}
 if(name==='go'){[84,88,91].forEach(n=>this.note(hz(n),t,.65,.055,'square',b));this.hiss(t,.25,.06,2500,b);return}
 if(name==='hoof'){[0,.075,.17].forEach((d,i)=>{this.note(150-i*15,t+d,.045,.11,'triangle',b,55);this.hiss(t+d,.03,.035,900,b)});return}
 if(name==='finish'||name==='victory'){const seq=name==='victory'?[72,76,79,84,0,79,84,88,91,0,88,91,96]:[79,83,86,91,86,91];seq.forEach((n,i)=>{if(n)this.note(hz(n),t+i*.115,i===seq.length-1?.65:.14,.09,'square',b)});[48,55,60].forEach(n=>this.note(hz(n),t,.85,.11,'triangle',b));for(let i=0;i<12;i++)this.hiss(t+i*.09,.25,.025,900+(i%3)*700,b)}
 }
 dispose(){if(this.timer)clearInterval(this.timer);this.timer=null;void this.ctx?.close();this.ctx=null}
}
export const arcadeAudio=new ArcadeAudio();
