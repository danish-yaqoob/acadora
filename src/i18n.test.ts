import { afterEach, expect, it } from 'vitest';
import Dexie from 'dexie';
import { AcadoraDB, defaults, settingsSchema, backupSchema } from './data';
import { tr, useLocale, formatDate } from './i18n';
afterEach(()=>useLocale.setState({language:'en'}));
it('translates UI messages, dates, dynamic labels, and switches back',()=>{
 useLocale.setState({language:'zh-CN'});
 expect(tr('Dashboard')).toBe('概览');expect(tr('High')).toBe('高');
 expect(tr('Complete My own task')).toBe('完成 My own task');
 expect(tr('Welcome back, Ada ☀')).toBe('欢迎回来，Ada ☀');
 expect(formatDate(new Date(2026,10,18),'MMMM yyyy')).toBe('2026年11月');
 expect(tr('A custom course title')).toBe('A custom course title');
 useLocale.setState({language:'en'});expect(tr('Dashboard')).toBe('Dashboard');
});
it('accepts legacy settings and backups with English as the default',()=>{
 const legacy={...defaults} as Partial<typeof defaults>;delete legacy.language;
 expect(settingsSchema.parse(legacy).language).toBe('en');
 const parsed=backupSchema.parse({version:1,exportedAt:new Date().toISOString(),courses:[],tasks:[],notes:[],sessions:[],plans:[],events:[],settings:legacy});
 expect(parsed.settings.language).toBe('en');
 expect(()=>settingsSchema.parse({...defaults,language:'invalid'})).toThrow();
});
it('migrates an existing v1 database without losing its profile',async()=>{
 const name='acadora-migration-test';const old=new Dexie(name);
 old.version(1).stores({courses:'id,archived',tasks:'id,courseId,status,due',sessions:'id,courseId,taskId,start',plans:'id,courseId,start',events:'id,courseId,start',notes:'id,courseId,updatedAt',settings:'id'});
 const legacy={...defaults} as Partial<typeof defaults>;delete legacy.language;await old.table('settings').put({...legacy,name:'Existing student'});old.close();
 const migrated=new AcadoraDB(name);try{expect(await migrated.settings.get('profile')).toMatchObject({name:'Existing student',language:'en'});}finally{await migrated.delete();}
});
