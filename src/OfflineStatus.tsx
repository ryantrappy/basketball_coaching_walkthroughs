import { useEffect, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
export default function OfflineStatus(){
 const requestedUpdate=useRef(false),registrationRef=useRef<ServiceWorkerRegistration|null>(null);
 const [online,setOnline]=useState(navigator.onLine),[saved,setSaved]=useState(false),[failed,setFailed]=useState(false);
 const {offlineReady:[ready],needRefresh:[update],updateServiceWorker}=useRegisterSW({
  onRegisterError(){setFailed(true);},
  onRegisteredSW(_url,registration){
   registrationRef.current=registration || null;
  },
 });
 useEffect(()=>{
  const check=()=>{if(navigator.onLine)void registrationRef.current?.update().catch(()=>{});};
  window.addEventListener('focus',check);window.addEventListener('online',check);
  const reloadAfterUpdate=()=>{if(requestedUpdate.current)window.location.reload();};
  navigator.serviceWorker?.addEventListener('controllerchange',reloadAfterUpdate);
  const change=()=>setOnline(navigator.onLine);window.addEventListener('online',change);window.addEventListener('offline',change);
  if('serviceWorker' in navigator)void navigator.serviceWorker.getRegistration().then(r=>{if(r?.active)setSaved(true);});
  return()=>{window.removeEventListener('focus',check);window.removeEventListener('online',check);navigator.serviceWorker?.removeEventListener('controllerchange',reloadAfterUpdate);window.removeEventListener('online',change);window.removeEventListener('offline',change);};
 },[]);
 const applyUpdate=async()=>{
  const registration=await navigator.serviceWorker.getRegistration();
  if(!registration?.waiting){window.location.reload();return;}
  requestedUpdate.current=true;
  await updateServiceWorker(true);
 };
 if(!import.meta.env.PROD)return null;
 if(!('serviceWorker' in navigator)||!window.isSecureContext)return <div className="offline-status">Offline access is available over HTTPS or localhost.</div>;
 return <div className="offline-status" role="status"><span>{!online?(ready||saved?'Offline · saved playbook':'Offline · playbook not yet saved'):ready||saved?'Playbook saved for offline use':failed?'Offline save unavailable · reconnect and reload':'Preparing offline playbook…'}</span>{update&&<button onClick={()=>void applyUpdate()}>Update available · reload</button>}{!online&&<small>External coaching references require a connection.</small>}</div>;
}
