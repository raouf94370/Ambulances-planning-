"use client";

import { useMemo, useState } from "react";
import {
  Ambulance, Bell, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight,
  Clock3, Filter, LayoutDashboard, Menu, Plus, Search, Settings,
  Stethoscope, Users, X, MapPin, Repeat2, AlertTriangle, LucideIcon
} from "lucide-react";

type Status = "À planifier" | "Planifié" | "En route" | "Patient pris en charge" | "En attente" | "Terminé" | "Annulé";
type Transport = {
  id: string; time: string; patient: string; origin: string; destination: string;
  ambulance: string; driver: string; status: Status; type: string;
};

const ambulances = ["Ambulance 1", "Ambulance 2", "Ambulance 3", "Ambulance 4", "Ambulance 5"];
const drivers = ["Karim Ben Ali", "Sofiane Martin", "Nicolas Petit", "Yassine Haddad", "Julien Morel"];

const initialTransports: Transport[] = [
  { id:"T-001", time:"07:45", patient:"Mme Marie Dupont", origin:"Domicile • Créteil", destination:"Hôpital Henri-Mondor", ambulance:"Ambulance 1", driver:"Karim Ben Ali", status:"Terminé", type:"Consultation" },
  { id:"T-002", time:"08:30", patient:"M. Jean Martin", origin:"Clinique de Choisy", destination:"Hôpital Bicêtre", ambulance:"Ambulance 2", driver:"Sofiane Martin", status:"En route", type:"Hospitalisation" },
  { id:"T-003", time:"09:15", patient:"Mme Sarah Ben Amar", origin:"Domicile • Vitry", destination:"Centre de radiologie", ambulance:"Ambulance 3", driver:"Nicolas Petit", status:"Planifié", type:"Imagerie" },
  { id:"T-004", time:"10:00", patient:"M. Ahmed Khelifi", origin:"Hôpital Bicêtre", destination:"Domicile • Choisy", ambulance:"Ambulance 4", driver:"Yassine Haddad", status:"Patient pris en charge", type:"Retour" },
  { id:"T-005", time:"10:45", patient:"Mme Claire Robert", origin:"Domicile • Alfortville", destination:"Hôpital Mondor", ambulance:"Ambulance 5", driver:"Julien Morel", status:"Planifié", type:"Consultation" },
  { id:"T-006", time:"12:00", patient:"M. Paul Garcia", origin:"Domicile • Créteil", destination:"Kinésithérapie", ambulance:"Ambulance 1", driver:"Karim Ben Ali", status:"À planifier", type:"Soins" },
  { id:"T-007", time:"14:00", patient:"Mme Nadia Saïd", origin:"Hôpital Mondor", destination:"Domicile • Saint-Maur", ambulance:"Ambulance 2", driver:"Sofiane Martin", status:"Planifié", type:"Retour" }
];

const statusClass: Record<Status,string> = {
  "À planifier":"status-todo","Planifié":"status-planned","En route":"status-route",
  "Patient pris en charge":"status-pickup","En attente":"status-wait","Terminé":"status-done","Annulé":"status-cancelled"
};

function todayLabel() {
  return new Intl.DateTimeFormat("fr-FR", { weekday:"long", day:"numeric", month:"long", year:"numeric" }).format(new Date());
}

export default function Home() {
  const [section, setSection] = useState("Planning");
  const [transports, setTransports] = useState(initialTransports);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Status | "Tous">("Tous");
  const [modal, setModal] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [view, setView] = useState<"jour"|"semaine">("jour");

  const filtered = useMemo(() => transports.filter(t => {
    const q = query.toLowerCase();
    const matchesQ = !q || [t.patient,t.origin,t.destination,t.ambulance,t.driver,t.id,t.type].join(" ").toLowerCase().includes(q);
    return matchesQ && (selectedStatus === "Tous" || t.status === selectedStatus);
  }), [transports, query, selectedStatus]);

const stats: [string, number, LucideIcon][] = [    ["Transports aujourd’hui", transports.length, CalendarDays],
    ["En cours", transports.filter(t=>["En route","Patient pris en charge","En attente"].includes(t.status)).length, Clock3],
    ["Terminés", transports.filter(t=>t.status==="Terminé").length, CheckCircle2],
    ["À planifier", transports.filter(t=>t.status==="À planifier").length, AlertTriangle],
  ];

  function changeStatus(id:string, status:Status) {
    setTransports(ts => ts.map(t => t.id===id ? {...t,status} : t));
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "open":""}`}>
        <div className="brand">
          <div className="brand-mark"><Ambulance size={24}/></div>
          <div><strong>Ambulances</strong><span>PLANNING</span></div>
        </div>
        <div className="nav-label">RÉGULATION</div>
        {[
          ["Tableau de bord",LayoutDashboard],["Planning",CalendarDays],["Transports",Stethoscope],
          ["Patients",Users],["Ambulances",Ambulance],["Chauffeurs",Users]
        ].map(([label,Icon]) => (
          <button key={label as string} className={`nav-item ${section===label ? "active":""}`} onClick={()=>{setSection(label as string);setMobileNav(false)}}>
            <Icon size={20}/><span>{label as string}</span>
          </button>
        ))}
        <div className="sidebar-bottom">
          <button className="nav-item"><Settings size={20}/><span>Paramètres</span></button>
          <div className="operator"><div className="avatar">RA</div><div><b>Régulation</b><small>Administrateur</small></div></div>
        </div>
      </aside>

      {mobileNav && <div className="overlay" onClick={()=>setMobileNav(false)}/>}

      <section className="content">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={()=>setMobileNav(true)}><Menu/></button>
          <div className="top-title"><span>Régulation</span><h1>{section}</h1></div>
          <div className="top-actions">
            <div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher patient, transport, chauffeur…"/></div>
            <button className="icon-button"><Bell size={19}/><i/></button>
            <button className="primary" onClick={()=>setModal(true)}><Plus size={19}/> Nouveau transport</button>
          </div>
        </header>

        <div className="page">
          <div className="date-row">
            <div><h2>{section === "Planning" ? "Planning des transports" : section}</h2><p className="muted">{todayLabel()}</p></div>
            <div className="date-controls">
              <button className="secondary"><ChevronLeft size={18}/></button>
              <button className="secondary date-current">Aujourd’hui</button>
              <button className="secondary"><ChevronRight size={18}/></button>
              <div className="segmented"><button className={view==="jour"?"selected":""} onClick={()=>setView("jour")}>Jour</button><button className={view==="semaine"?"selected":""} onClick={()=>setView("semaine")}>Semaine</button></div>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map(([label,value,Icon]) => <div className="stat-card" key={label as string}><div className="stat-icon"><Icon size={20}/></div><div><span>{label as string}</span><strong>{value as number}</strong></div></div>)}
          </div>

          <div className="toolbar">
            <div className="filter-group"><Filter size={17}/><select value={selectedStatus} onChange={e=>setSelectedStatus(e.target.value as Status|"Tous")}><option>Tous</option>{Object.keys(statusClass).map(s=><option key={s}>{s}</option>)}</select></div>
            <span className="result-count">{filtered.length} transport{filtered.length>1?"s":""}</span>
          </div>

          <div className="planning-card">
            <div className="planning-head"><div><b>Vue régulation</b><span>5 véhicules • {filtered.length} transports</span></div><div className="legend"><span><i className="dot green"/>Disponible</span><span><i className="dot orange"/>En mission</span><span><i className="dot gray"/>Terminé</span></div></div>
            <div className="board-wrap">
              <div className="time-col"><div className="corner"/>{["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"].map(t=><div className="time" key={t}>{t}</div>)}</div>
              <div className="lanes">
                {ambulances.map(a=>{
                  const items=filtered.filter(t=>t.ambulance===a);
                  return <div className="lane" key={a}>
                    <div className="lane-head"><div className="ambulance-title"><span className="vehicle-dot"/><b>{a.replace("Ambulance ","Amb. ")}</b></div><span className="lane-count">{items.length}</span></div>
                    <div className="lane-body">
                      {["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"].map(t=><div className="grid-line" key={t}/>)}
                      {items.map(t=>{
                        const [hours, minutes] = t.time.split(":").map(Number);
const top = Math.max(0, ((hours - 7) * 60 + minutes) * 1.02);
                        return <div className={`transport-card ${statusClass[t.status]}`}  onClick={() => setSelectedTransport(t)} style={{top:`${top}px`}} key={t.id}>>
                          <div className="transport-time">{t.time} <span>{t.type}</span></div>
                          <b>{t.patient}</b><div className="transport-route"><MapPin size={12}/>{t.origin} → {t.destination}</div>
                          <div className="transport-footer"><span>{t.driver}</span><select value={t.status} onChange={e=>changeStatus(t.id,e.target.value as Status)}><option>{t.status}</option>{Object.keys(statusClass).filter(s=>s!==t.status).map(s=><option key={s}>{s}</option>)}</select></div>
                        </div>
                      })}
                    </div>
                  </div>
                })}
              </div>
            </div>
          </div>

          <div className="mobile-list">
            <div className="list-title"><b>Transports du jour</b><span>Appuyez sur un transport pour modifier son statut</span></div>
            {filtered.map(t=><div className="list-card" key={t.id}><div className="list-time">{t.time}</div><div className="list-main"><b>{t.patient}</b><span>{t.origin} → {t.destination}</span><small>{t.ambulance} • {t.driver}</small></div><span className={`status ${statusClass[t.status]}`}>{t.status}</span></div>)}
          </div>

          <div className="quick-actions">
            <button onClick={()=>setModal(true)}><Plus size={18}/> Ajouter un transport</button>
            <button><Repeat2 size={18}/> Transport récurrent</button>
            <button><Users size={18}/> Nouveau patient</button>
          </div>
        </div>
      </section>

      {modal && <NewTransportModal onClose={()=>setModal(false)} onCreate={(t)=>{setTransports(ts=>[...ts,t]);setModal(false)}}/>}
  {selectedTransport && (
  <TransportDetailsModal
    transport={selectedTransport}
    onClose={() => setSelectedTransport(null)}
  />
)}  </main>
  );
}

function NewTransportModal({onClose,onCreate}:{onClose:()=>void,onCreate:(t:Transport)=>void}) {
  const [patient,setPatient]=useState("");
  const [time,setTime]=useState("15:00");
  const [origin,setOrigin]=useState("");
  const [destination,setDestination]=useState("");
  const [ambulance,setAmbulance]=useState(ambulances[0]);
  const [driver,setDriver]=useState(drivers[0]);
  const [type,setType]=useState("Consultation");
  return <div className="modal-backdrop"><div className="modal">
    <div className="modal-head"><div><span className="eyebrow">NOUVEAU</span><h3>Créer un transport</h3></div><button className="icon-button" onClick={onClose}><X/></button></div>
    <div className="form-grid">
      <label>Patient<input autoFocus value={patient} onChange={e=>setPatient(e.target.value)} placeholder="Nom et prénom"/></label>
      <label>Heure<input type="time" value={time} onChange={e=>setTime(e.target.value)}/></label>
      <label>Lieu de prise en charge<input value={origin} onChange={e=>setOrigin(e.target.value)} placeholder="Domicile, hôpital…"/></label>
      <label>Destination<input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Établissement…"/></label>
      <label>Ambulance<select value={ambulance} onChange={e=>setAmbulance(e.target.value)}>{ambulances.map(a=><option key={a}>{a}</option>)}</select></label>
      <label>Chauffeur<select value={driver} onChange={e=>setDriver(e.target.value)}>{drivers.map(d=><option key={d}>{d}</option>)}</select></label>
      <label>Type<select value={type} onChange={e=>setType(e.target.value)}><option>Consultation</option><option>Hospitalisation</option><option>Imagerie</option><option>Soins</option><option>Retour</option></select></label>
    </div>
    <div className="modal-foot"><button className="secondary" onClick={onClose}>Annuler</button><button className="primary" disabled={!patient||!origin||!destination} onClick={()=>onCreate({id:`T-${Date.now().toString().slice(-4)}`,time,patient,origin,destination,ambulance,driver,status:"Planifié",type})}>Créer le transport</button></div>
  </div></div>
}
function TransportDetailsModal({
  transport,
  onClose,
}: {
  transport: Transport;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">TRANSPORT</span>
            <h3>{transport.id}</h3>
          </div>
        </div>

        <div className="form-grid">
          <label>Patient
            <input value={transport.patient} readOnly />
          </label>

          <label>Heure
            <input value={transport.time} readOnly />
          </label>

          <label>Lieu de prise en charge
            <input value={transport.origin} readOnly />
          </label>

          <label>Destination
            <input value={transport.destination} readOnly />
          </label>

          <label>Ambulance
            <input value={transport.ambulance} readOnly />
          </label>

          <label>Chauffeur
            <input value={transport.driver} readOnly />
          </label>

          <label>Type
            <input value={transport.type} readOnly />
          </label>

          <label>Statut
            <input value={transport.status} readOnly />
          </label>
        </div>

        <div className="modal-foot">
          <button className="secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
