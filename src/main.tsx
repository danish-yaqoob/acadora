import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import App from './App';
import './style.css';
import { tr, useLocale } from './i18n';
function StorageError(){useLocale();return <div className="loading"><img src="/icon.svg" alt="Acadora"/><h2>{tr('We couldn’t open your workspace.')}</h2><p>{tr('Check that browser storage is enabled and there is free space on your device.')}</p><p>{tr('Keep your browser data intact so your records can be recovered.')}</p><button className="primary" onClick={()=>location.reload()}>{tr('Try again')}</button></div>;}
class ErrorBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<StorageError/>:this.props.children;}}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ErrorBoundary><App/></ErrorBoundary></React.StrictMode>);
