import { create } from 'zustand';
import { format as dateFormat } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import chinese from './zh-CN.json';
export type Language = 'en' | 'zh-CN';
export const useLocale = create<{language:Language}>(()=>({language:'en'}));
const messages:Record<string,string> = chinese;
/** Translate application messages only. Academic content and database enum values remain intact. */
export function tr(value:string|undefined):string;
export function tr<T>(value:T):T;
export function tr(value:unknown):unknown {
 if(typeof value!=='string'||useLocale.getState().language==='en')return value;
 const trimmed=value.trim();
 if(messages[trimmed])return value.replace(trimmed,messages[trimmed]);
 if(messages[value])return messages[value];
 const welcome=/^Welcome(?: back, (.*))? ☀$/.exec(value);if(welcome)return welcome[1]?`欢迎回来，${welcome[1]} ☀`:'欢迎使用 ☀';
 const search=/^Search (.+?)(…)?$/.exec(value);if(search){const types:Record<string,string>={tasks:'任务',courses:'课程','my courses':'课程',notes:'笔记'};return `搜索${types[search[1]]??search[1]}${search[2]??''}`;}
 const duration=/^(Focus|Short break|Long break) \(minutes\)$/.exec(value);if(duration)return `${tr(duration[1])}（分钟）`;
 const action=/^(Complete|Reopen|Delete|Edit|Archive|Unarchive) (.+)$/.exec(value);if(action){const verbs:Record<string,string>={Complete:'完成',Reopen:'重新打开',Delete:'删除',Edit:'编辑',Archive:'归档',Unarchive:'取消归档'};return `${verbs[action[1]]} ${action[2]}`;}
 if(value.endsWith('% of all tasks completed'))return value.replace('% of all tasks completed','% 的任务已完成');
 if(value.endsWith(' focused minutes'))return value.replace(' focused minutes','分钟专注');
 if(value.endsWith(' complete'))return `${tr(value.slice(0,-9))}结束`;
 if(/: [\d.]+ minutes$/.test(value))return value.replace(' minutes','分钟');
 return value;
}
export function formatDate(date:Parameters<typeof dateFormat>[0],mask:string){
 const zh=useLocale.getState().language==='zh-CN';
 if(zh){mask=mask.replace('EEEE, MMMM d, yyyy','yyyy年M月d日 EEEE').replace('MMM d, yyyy','yyyy年M月d日').replace('MMMM yyyy','yyyy年M月').replace('MMM d','M月d日');}
 return dateFormat(date,mask,{locale:zh?zhCN:enUS});
}
