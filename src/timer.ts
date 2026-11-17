import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from './data';
export interface Timer {id:string;mode:'Focus'|'Short break'|'Long break';duration:number;remaining:number;deadline:number|null;startedAt:number|null;courseId:string;taskId:string;cycles:number; configure:(mode:Timer['mode'],minutes:number)=>void;start:()=>void;pause:()=>void;reset:()=>void;setAssociation:(courseId:string,taskId:string)=>void;finish:(skip?:boolean)=>Promise<void>}
export function remainingAt(t:Pick<Timer,'deadline'|'remaining'>,now=Date.now()){return t.deadline===null?t.remaining:Math.max(0,t.deadline-now);}
let finishing=false;
export const useTimer=create<Timer>()(persist((set,get)=>({id:crypto.randomUUID(),mode:'Focus',duration:1500000,remaining:1500000,deadline:null,startedAt:null,courseId:'',taskId:'',cycles:0,
 configure:(mode,minutes)=>set({id:crypto.randomUUID(),mode,duration:minutes*60000,remaining:minutes*60000,deadline:null,startedAt:null}),
 start:()=>{const t=get();if(!t.deadline&&t.remaining>0)set({deadline:Date.now()+t.remaining,startedAt:t.startedAt??Date.now()});},
 pause:()=>set({remaining:remainingAt(get()),deadline:null}),
 reset:()=>set({id:crypto.randomUUID(),remaining:get().duration,deadline:null,startedAt:null}),
 setAssociation:(courseId,taskId)=>set({courseId,taskId}),
 finish:async(skip=false)=>{if(finishing)return;finishing=true;try{const t=get();if(!t.startedAt)return;const seconds=Math.floor((t.duration-remainingAt(t))/1000);if(t.mode==='Focus'&&seconds>0){await db.transaction('rw',db.sessions,db.tasks,async()=>{if(await db.sessions.get(t.id))return;await db.sessions.put({id:t.id,createdAt:Date.now(),updatedAt:Date.now(),title:skip?'Partial focus session':'Focus session',courseId:t.courseId,taskId:t.taskId,start:t.startedAt!,end:t.deadline?Math.min(Date.now(),t.deadline):Date.now(),seconds});if(t.taskId)await db.tasks.where('id').equals(t.taskId).modify(task=>{task.actual+=seconds/60;task.updatedAt=Date.now();});});}set({id:crypto.randomUUID(),remaining:t.duration,deadline:null,startedAt:null,cycles:t.cycles+(t.mode==='Focus'?1:0)});}finally{finishing=false;}}
}),{name:'acadora-timer-v1'}));
