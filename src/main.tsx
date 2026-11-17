import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import App from './App';
import './style.css';
class ErrorBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<div className="loading"><img src="/icon.svg" alt="Acadora"/><h2>We couldn’t open your workspace.</h2><p>Check that browser storage is enabled and there is free space on your device.</p><p>Keep your browser data intact so your records can be recovered.</p><button className="primary" onClick={()=>location.reload()}>Try again</button></div>:this.props.children;}}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><ErrorBoundary><App/></ErrorBoundary></React.StrictMode>);
