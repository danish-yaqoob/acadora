import { tr, useLocale } from './i18n';
import { useEffect, useState } from 'react';
import { useTimer } from './timer';
import { Download, Upload, ShieldCheck, Trash2 } from 'lucide-react';
import { backup, restore, db, defaults, download, csv, dayKey, settingsSchema, type UserSettings } from './data';
import { Field, SectionTitle } from './ui';
export function Preferences({ settings, onChange }: {
    settings: UserSettings;
    onChange: (s: UserSettings) => void;
}) { useLocale(); return <><div className="form-grid"><Field label={tr("Language")}><select value={settings.language??'en'} onChange={e=>onChange({...settings,language:e.target.value as UserSettings['language']})}><option value="en" lang="en">English</option><option value="zh-CN" lang="zh-CN">简体中文</option></select></Field><Field label={tr("Preferred name")}><input value={settings.name} maxLength={100} onChange={e => onChange({ ...settings, name: e.target.value })}/></Field><Field label={tr("Academic level")}><select value={settings.level} onChange={e => onChange({ ...settings, level: e.target.value })}>{['Undergraduate', 'Master’s', 'PhD', 'Medical student', 'Independent learner', 'Other'].map(v => <option key={v} value={v}>{tr(v)}</option>)}</select></Field><Field label={tr("Daily study goal (minutes)")}><input type="number" min="1" max="1440" value={settings.goal} onChange={e => onChange({ ...settings, goal: +e.target.value })}/></Field><Field label={tr("Appearance")}><select value={settings.theme} onChange={e => onChange({ ...settings, theme: e.target.value as UserSettings['theme'] })}><option value="system">{tr("System")}</option><option value="light">{tr("Light")}</option><option value="dark">{tr("Dark")}</option></select></Field><Field label={tr("Time format")}><select value={settings.timeFormat} onChange={e => onChange({ ...settings, timeFormat: e.target.value as '12' | '24' })}><option value="24">{tr("24 hour")}</option><option value="12">{tr("12 hour")}</option></select></Field><Field label={tr("Week starts on")}><select value={settings.weekStart} onChange={e => onChange({ ...settings, weekStart: +e.target.value as 0 | 1 })}><option value="1">{tr("Monday")}</option><option value="0">{tr("Sunday")}</option></select></Field></div></>; }
export default function Settings({ settings, notify }: {
    settings: UserSettings;
    notify: (s: string) => void;
}) { useLocale(); const [draft, setDraft] = useState(settings), [busy, setBusy] = useState(false); useEffect(() => setDraft(settings), [settings]); return <div className="settings-layout"><section className="panel"><SectionTitle title={tr("Make yourself at home")}/><p className="muted">{tr("Small preferences that make your workspace yours.")}</p><form onSubmit={async (e) => { e.preventDefault(); try {
    await db.settings.put(settingsSchema.parse(draft));
    notify(tr('Preferences saved'));
}
catch {
    notify(tr('Check your preferences. Durations must be positive and within the displayed limits.'));
} }}><Preferences settings={draft} onChange={setDraft}/><h3>{tr("Focus & breaks")}</h3><div className="form-grid">{(['focus', 'short', 'long'] as const).map(k => <Field key={k} label={tr(`${k === 'focus' ? 'Focus' : k === 'short' ? 'Short break' : 'Long break'} (minutes)`)}><input required type="number" min="1" max={k === 'focus' ? 180 : k === 'short' ? 60 : 90} value={draft[k]} onChange={e => setDraft({ ...draft, [k]: +e.target.value })}/></Field>)}</div><label className="check-label"><input type="checkbox" checked={draft.notifications} onChange={async (e) => { const checked = e.target.checked; if (checked && 'Notification' in window) {
    const permission = await Notification.requestPermission();
    setDraft({ ...draft, notifications: permission === 'granted' });
    if (permission !== 'granted')
        notify(tr('Notifications were not permitted. In-app completion messages still work.'));
}
else if (checked)
    notify(tr('This browser does not support desktop notifications.'));
else
    setDraft({ ...draft, notifications: false }); }}/>{tr("Desktop notifications when a session finishes")}</label><button className="primary">{tr("Save preferences")}</button></form></section><section className="panel"><SectionTitle title={tr("Your data belongs to you")}/><div className="privacy-box"><ShieldCheck size={24}/><div><strong>{tr("Private by design")}</strong><p>{tr("Your academic data stays in this browser. No account, ads, tracking, or cloud synchronization. Clearing browser storage or changing devices can lose your data. Keep regular backups.")}</p></div></div><div className="data-actions"><button className="secondary" onClick={async () => { download(`acadora-backup-${dayKey()}.json`, JSON.stringify(await backup(), null, 2), 'application/json'); notify(tr('Backup downloaded')); }}><Download size={16}/>{tr("Download complete JSON backup")}</button><label className="secondary upload"><Upload size={16}/>{busy ? tr('Validating…') : tr('Restore JSON backup')}<input type="file" accept="application/json,.json" disabled={busy} onChange={async (e) => { const file = e.target.files?.[0]; if (!file)
    return; setBusy(true); try {
    if (file.size > 20000000)
        throw Error('Backup exceeds 20 MB');
    const input = JSON.parse(await file.text());
    const { validateBackup } = await import('./data');
    validateBackup(input);
    if (confirm(tr('Replace all local data with this backup? Download a current backup first if needed.'))) {
        await restore(input);
        useTimer.getState().reset();
        useTimer.getState().setAssociation('', '');
        notify(tr('Backup restored'));
    }
}
catch (error) {
    notify(error instanceof Error ? tr(error.message) : tr('Could not restore this backup'));
}
finally {
    setBusy(false);
    e.target.value = '';
} }}/></label><button className="secondary" onClick={async () => download('acadora-tasks.csv', csv(await db.tasks.toArray()), 'text/csv')}><Download size={16}/>{tr("Export tasks as CSV")}</button><button className="secondary" onClick={async () => download('acadora-study-sessions.csv', csv(await db.sessions.toArray()), 'text/csv')}><Download size={16}/>{tr("Export study sessions as CSV")}</button></div><hr /><h3>{tr("Delete local data")}</h3><p className="muted">{tr("Permanently remove courses, tasks, notes, and study history from this browser.")}</p><button className="danger secondary" onClick={async () => { if (prompt(tr('This cannot be undone. Type DELETE to erase all Acadora data.')) === 'DELETE') {
    await db.transaction('rw', db.tables, async () => { for (const t of db.tables)
        await t.clear(); await db.settings.put(defaults); });
    localStorage.removeItem('acadora-timer-v1');
    location.reload();
} }}><Trash2 size={16}/>{tr("Delete all data")}</button></section></div>; }
