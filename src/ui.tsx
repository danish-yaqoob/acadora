import { tr, useLocale } from './i18n';
import { cloneElement, useId, useEffect, useRef, type ReactElement, type ReactNode } from 'react';
import { X, Plus, ArrowUpRight } from 'lucide-react';
export function Modal({ title, children, close }: {
    title: string;
    children: ReactNode;
    close: () => void;
}) { useLocale(); const ref = useRef<HTMLDialogElement>(null); useEffect(() => { const d = ref.current!; d.showModal(); return () => d.close(); }, []); return <dialog ref={ref} onCancel={close} onClick={e => { if (e.target === e.currentTarget)
    close(); }}><header><h2>{tr(title)}</h2><button type="button" className="icon" aria-label={tr("Close dialog")} onClick={close}><X size={20}/></button></header>{children}</dialog>; }
export function Field({ label, children }: {
    label: string;
    children: ReactElement<{
        id?: string;
    }>;
}) { useLocale(); const id = useId(); return <div className="field"><label htmlFor={id}>{tr(label)}</label>{cloneElement(children, { id })}</div>; }
export function Empty({ title, detail, action, onClick }: {
    title: string;
    detail: string;
    action?: string;
    onClick?: () => void;
}) { useLocale(); return <div className="empty"><div className="empty-symbol">✧</div><h3>{tr(title)}</h3><p>{tr(detail)}</p>{action && <button className="secondary" onClick={onClick}><Plus size={16}/>{tr(action)}</button>}</div>; }
export function SectionTitle({ title, action, onClick }: {
    title: string;
    action?: string;
    onClick?: () => void;
}) { useLocale(); return <div className="section-title"><h2>{tr(title)}</h2>{action && <button className="link" onClick={onClick}>{tr(action)}<ArrowUpRight size={15}/></button>}</div>; }
