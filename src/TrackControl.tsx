import type {ReactNode} from 'react';
// These critical controls are self-styled so an old/missing theme sheet cannot
// turn them into white native buttons with unreadable inherited text.
export function TrackControl({children,label,title,active=false,variant='screen',onClick}:{children:ReactNode;label:string;title:string;active?:boolean;variant?:'chat'|'screen';onClick:()=>void}){
 const bg=variant==='chat'?(active?'#205347':'#243d51'):active?'#765038':'#193e59';
 const fg=variant==='chat'?(active?'#e5f7c5':'#d7e6ef'):'#fff0b0';
 return <button type="button" className="derby-track-control" data-track-control={variant} aria-label={label} aria-pressed={active} title={title} onClick={onClick} style={{appearance:'none',WebkitAppearance:'none',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:7,flexShrink:0,width:variant==='chat'?96:undefined,minHeight:36,minWidth:variant==='chat'?96:36,boxSizing:'border-box',padding:'8px 11px',margin:0,background:bg,backgroundImage:'none',color:fg,WebkitTextFillColor:fg,border:`2px solid ${variant==='chat'?'#88bca5':'#e8c777'}`,borderRadius:0,boxShadow:'2px 2px 0 #10263b',fontFamily:'Silkscreen, monospace',fontSize:9,fontWeight:700,lineHeight:'16px',letterSpacing:0,textShadow:'none',textDecoration:'none',opacity:1,filter:'none',whiteSpace:'nowrap',cursor:'pointer'}}><span aria-hidden="true" style={{display:'inline-flex',alignItems:'center',gap:7,color:fg,WebkitTextFillColor:fg,background:'transparent',opacity:1}}>{children}</span></button>
}
