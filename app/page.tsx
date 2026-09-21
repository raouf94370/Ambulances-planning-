"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Ambulance, Bell, CalendarDays, CheckCircle2, ChevronLeft,
  ChevronRight, Clock3, Filter, LayoutDashboard, Menu, Plus,
  Search, Settings, Stethoscope, Users, X, MapPin, Repeat2,
  AlertTriangle, LucideIcon
} from "lucide-react";

type Status =
  | "À planifier"
  | "Planifié"
  | "En route"
  | "Patient pris en charge"
  | "En attente"
  | "Terminé"
  | "Annulé";

type Transport = {
  id: string;
  date: string;
  time: string;
  patient: string;
  origin: string;
  destination: string;
  ambulance: string;
  driver: string;
  status: Status;
  type: string;
};

const ambulances = [
  "Ambulance 1",
  "Ambulance 2",
  "Ambulance 3",
  "Ambulance 4",
  "Ambulance 5"
];

const drivers = [
  "Karim Ben Ali",
  "Sofiane Martin",
  "Nicolas Petit",
  "Yassine Haddad",
  "Julien Morel"
];

function localIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateString: string, amount: number) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return localIsoDate(date);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${dateString}T12:00:00`));
}

function weekStart(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return localIsoDate(date);
}

function weekLabel(dateString: string) {
  const start = weekStart(dateString);
  const end = addDays(start, 6);

  const startText = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long"
  }).format(new Date(`${start}T12:00:00`));

  const endText = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${end}T12:00:00`));

  return `${startText} – ${endText}`;
}

const today = localIsoDate();

const initialTransports: Transport[] = [
  {
    id: "T-001",
    date: today,
    time: "07:45",
    patient: "Mme Marie Dupont",
    origin: "Domicile • Créteil",
    destination: "Hôpital Henri-Mondor",
    ambulance: "Ambulance 1",
    driver: "Karim Ben Ali",
    status: "Terminé",
    type: "Consultation"
  },
  {
    id: "T-002",
    date: today,
    time: "08:30",
    patient: "M. Jean Martin",
    origin: "Clinique de Choisy",
    destination: "Hôpital Bicêtre",
    ambulance: "Ambulance 2",
    driver: "Sofiane Martin",
    status: "En route",
    type: "Hospitalisation"
  },
  {
    id: "T-003",
    date: today,
    time: "09:15",
    patient: "Mme Sarah Ben Amar",
    origin: "Domicile • Vitry",
    destination: "Centre de radiologie",
    ambulance: "Ambulance 3",
    driver: "Nicolas Petit",
    status: "Planifié",
    type: "Imagerie"
  },
  {
    id: "T-004",
    date: today,
    time: "10:00",
    patient: "M. Ahmed Khelifi",
    origin: "Hôpital Bicêtre",
    destination: "Domicile • Choisy",
    ambulance: "Ambulance 4",
    driver: "Yassine Haddad",
    status: "Patient pris en charge",
    type: "Retour"
  },
  {
    id: "T-005",
    date: today,
    time: "10:45",
    patient: "Mme Claire Robert",
    origin: "Domicile • Alfortville",
    destination: "Hôpital Mondor",
    ambulance: "Ambulance 5",
    driver: "Julien Morel",
    status: "Planifié",
    type: "Consultation"
  },
  {
    id: "T-006",
    date: today,
    time: "12:00",
    patient: "M. Paul Garcia",
    origin: "Domicile • Créteil",
    destination: "Kinésithérapie",
    ambulance: "Ambulance 1",
    driver: "Karim Ben Ali",
    status: "À planifier",
    type: "Soins"
  },
  {
    id: "T-007",
    date: today,
    time: "14:00",
    patient: "Mme Nadia Saïd",
    origin: "Hôpital Mondor",
    destination: "Domicile • Saint-Maur",
    ambulance: "Ambulance 2",
    driver: "Sofiane Martin",
    status: "Planifié",
    type: "Retour"
  }
];

const transportsStorageKey = "ambulances-planning-transports";

function getStoredTransports(): Transport[] | null {
  try {
    const storedTransports = window.localStorage.getItem(
      transportsStorageKey
    );

    if (!storedTransports) {
      return null;
    }

    const transports: unknown = JSON.parse(storedTransports);

    return Array.isArray(transports)
      ? (transports as Transport[])
      : null;
  } catch {
    return null;
  }
}

function storeTransports(transports: Transport[]) {
  window.localStorage.setItem(
    transportsStorageKey,
    JSON.stringify(transports)
  );
}

const statusOptions: Status[] = [
  "À planifier",
  "Planifié",
  "En route",
  "Patient pris en charge",
  "En attente",
  "Terminé",
  "Annulé"
];

const statusClass: Record<Status, string> = {
  "À planifier": "status-todo",
  "Planifié": "status-planned",
  "En route": "status-route",
  "Patient pris en charge": "status-pickup",
  "En attente": "status-wait",
  "Terminé": "status-done",
  "Annulé": "status-cancelled"
};

export default function Home() {
  const [section, setSection] = useState("Planning");
  const [transports, setTransports] = useState<Transport[]>(initialTransports);
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] =
    useState<Status | "Tous">("Tous");

  const [formMode, setFormMode] =
    useState<"new" | "edit" | null>(null);

  const [selectedTransport, setSelectedTransport] =
    useState<Transport | null>(null);

  const [mobileNav, setMobileNav] = useState(false);

  const [view, setView] =
    useState<"jour" | "semaine">("jour");

  const [selectedDate, setSelectedDate] =
    useState(today);

  useEffect(() => {
    const storedTransports = getStoredTransports();

    if (storedTransports) {
      setTransports(storedTransports);
    }
  }, []);

  const visibleTransports = useMemo(() => {
    const q = query.toLowerCase().trim();

    return transports.filter((t) => {
      const dateMatches =
        view === "jour"
          ? t.date === selectedDate
          : t.date >= weekStart(selectedDate) &&
            t.date <= addDays(weekStart(selectedDate), 6);

      const textMatches =
        !q ||
        [
          t.patient,
          t.origin,
          t.destination,
          t.ambulance,
          t.driver,
          t.id,
          t.type
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const statusMatches =
        selectedStatus === "Tous" ||
        t.status === selectedStatus;

      return dateMatches && textMatches && statusMatches;
    });
  }, [
    transports,
    query,
    selectedStatus,
    view,
    selectedDate
  ]);

  const stats: [string, number, LucideIcon][] = [
    [
      "Transports",
      visibleTransports.length,
      CalendarDays
    ],
    [
      "En cours",
      visibleTransports.filter((t) =>
        [
          "En route",
          "Patient pris en charge",
          "En attente"
        ].includes(t.status)
      ).length,
      Clock3
    ],
    [
      "Terminés",
      visibleTransports.filter(
        (t) => t.status === "Terminé"
      ).length,
      CheckCircle2
    ],
    [
      "À planifier",
      visibleTransports.filter(
        (t) => t.status === "À planifier"
      ).length,
      AlertTriangle
    ]
  ];

  function changeStatus(id: string, status: Status) {
    setTransports((current) => {
      const updated = current.map((t) =>
        t.id === id ? { ...t, status } : t
      );

      storeTransports(updated);
      return updated;
    });
  }

  function openEdit(transport: Transport) {
    setSelectedTransport(transport);
    setFormMode("edit");
  }

  function saveTransport(updated: Transport) {
    setTransports((current) => {
      const transports = current.map((t) =>
        t.id === updated.id ? updated : t
      );

      storeTransports(transports);
      return transports;
    });

    setSelectedTransport(null);
    setFormMode(null);
  }

  function createTransport(transport: Transport) {
    setTransports((current) => {
      const transports = [...current, transport];

      storeTransports(transports);
      return transports;
    });

    setSelectedDate(transport.date);
    setView("jour");
    setFormMode(null);
  }

  function moveDate(amount: number) {
    setSelectedDate((current) =>
      addDays(current, amount)
    );
  }

  return (
    <main className="app-shell">
      <aside
        className={`sidebar ${
          mobileNav ? "open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-mark">
            <Ambulance size={24} />
          </div>

          <div>
            <strong>Ambulances</strong>
            <span>PLANNING</span>
          </div>
        </div>

        <div className="nav-label">
          RÉGULATION
        </div>

        {[
          ["Tableau de bord", LayoutDashboard],
          ["Planning", CalendarDays],
          ["Transports", Stethoscope],
          ["Patients", Users],
          ["Ambulances", Ambulance],
          ["Chauffeurs", Users]
        ].map(([label, Icon]) => (
          <button
            key={label as string}
            className={`nav-item ${
              section === label ? "active" : ""
            }`}
            onClick={() => {
              setSection(label as string);
              setMobileNav(false);
            }}
          >
            <Icon size={20} />
            <span>{label as string}</span>
          </button>
        ))}

        <div className="sidebar-bottom">
          <button className="nav-item">
            <Settings size={20} />
            <span>Paramètres</span>
          </button>

          <div className="operator">
            <div className="avatar">RA</div>
            <div>
              <b>Régulation</b>
              <small>Administrateur</small>
            </div>
          </div>
        </div>
      </aside>

      {mobileNav && (
        <div
          className="overlay"
          onClick={() => setMobileNav(false)}
        />
      )}

      <section className="content">
        <header className="topbar">
          <button
            className="icon-button menu-button"
            onClick={() => setMobileNav(true)}
          >
            <Menu />
          </button>

          <div className="top-title">
            <span>Régulation</span>
            <h1>{section}</h1>
          </div>

          <div className="top-actions">
            <div className="search">
              <Search size={18} />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Rechercher patient, transport, chauffeur…"
              />
            </div>

            <button className="icon-button">
              <Bell size={19} />
              <i />
            </button>

            <button
              className="primary"
              onClick={() => setFormMode("new")}
            >
              <Plus size={19} />
              Nouveau transport
            </button>
          </div>
        </header>

        <div className="page">
          <div className="date-row">
            <div>
              <h2>
                {section === "Planning"
                  ? "Planning des transports"
                  : section}
              </h2>

              <p className="muted">
                {view === "jour"
                  ? formatDate(selectedDate)
                  : weekLabel(selectedDate)}
              </p>
            </div>

            <div className="date-controls">
              <button
                className="secondary"
                onClick={() => moveDate(-1)}
                title="Jour précédent"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                className="secondary date-current"
                onClick={() =>
                  setSelectedDate(today)
                }
              >
                Aujourd’hui
              </button>

              <input
                className="secondary"
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
              />

              <button
                className="secondary"
                onClick={() => moveDate(1)}
                title="Jour suivant"
              >
                <ChevronRight size={18} />
              </button>

              <div className="segmented">
                <button
                  className={
                    view === "jour"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setView("jour")
                  }
                >
                  Jour
                </button>

                <button
                  className={
                    view === "semaine"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                
                    setView("semaine")
                  }
                >
                  Semaine
                </button>
              </div>
            </div>
          </div>
                    <div className="stats-grid">
            {stats.map(([label, value, Icon]) => (
              <div className="stat-card" key={label}>
                <div className="stat-icon">
                  <Icon size={20} />
                </div>
                <div>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="toolbar">
            <div className="filter-group">
              <Filter size={17} />

              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value as Status | "Tous"
                  )
                }
              >
                <option>Tous</option>

                {statusOptions.map((status) => (
                  <option key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <span className="result-count">
              {visibleTransports.length} transport
              {visibleTransports.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="planning-card">
            <div className="planning-head">
              <div>
                <b>Vue régulation</b>
                <span>
                  5 véhicules • {visibleTransports.length} transports
                </span>
              </div>

              <div className="legend">
                <span>
                  <i className="dot green" />
                  Disponible
                </span>

                <span>
                  <i className="dot orange" />
                  En mission
                </span>

                <span>
                  <i className="dot gray" />
                  Terminé
                </span>
              </div>
            </div>

            <div className="board-wrap">
              <div className="time-col">
                <div className="corner" />

                {[
                  "07:00",
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00"
                ].map((time) => (
                  <div className="time" key={time}>
                    {time}
                  </div>
                ))}
              </div>

              <div className="lanes">
                {ambulances.map((ambulance) => {
                  const items =
                    visibleTransports.filter(
                      (t) => t.ambulance === ambulance
                    );

                  return (
                    <div className="lane" key={ambulance}>
                      <div className="lane-head">
                        <div className="ambulance-title">
                          <span className="vehicle-dot" />

                          <b>
                            {ambulance.replace(
                              "Ambulance ",
                              "Amb. "
                            )}
                          </b>
                        </div>

                        <span className="lane-count">
                          {items.length}
                        </span>
                      </div>

                      <div className="lane-body">
                        {[
                          "07:00",
                          "08:00",
                          "09:00",
                          "10:00",
                          "11:00",
                          "12:00",
                          "13:00",
                          "14:00",
                          "15:00"
                        ].map((time) => (
                          <div
                            className="grid-line"
                            key={time}
                          />
                        ))}

                        {items.map((transport) => {
                          const [
                            hours,
                            minutes
                          ] = transport.time
                            .split(":")
                            .map(Number);

                          const top = Math.max(
                            0,
                            ((hours - 7) * 60 +
                              minutes) *
                              1.02
                          );

                          return (
                            <div
                              className={`transport-card ${
                                statusClass[
                                  transport.status
                                ]
                              }`}
                              onClick={() =>
                                openEdit(transport)
                              }
                              style={{
                                top: `${top}px`
                              }}
                              key={transport.id}
                            >
                              <div className="transport-time">
                                {transport.time}{" "}
                                <span>
                                  {transport.type}
                                </span>
                              </div>

                              <b>
                                {transport.patient}
                              </b>

                              <div className="transport-route">
                                <MapPin size={12} />

                                {transport.origin} →{" "}
                                {transport.destination}
                              </div>

                              <div className="transport-footer">
                                <span>
                                  {transport.driver}
                                </span>

                                <select
                                  value={
                                    transport.status
                                  }
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                  onChange={(e) =>
                                    changeStatus(
                                      transport.id,
                                      e.target
                                        .value as Status
                                    )
                                  }
                                >
                                  {statusOptions.map(
                                    (status) => (
                                      <option
                                        key={status}
                                      >
                                        {status}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mobile-list">
            <div className="list-title">
              <b>
                {view === "jour"
                  ? "Transports du jour"
                  : "Transports de la semaine"}
              </b>

              <span>
                Appuyez sur un transport pour le modifier
              </span>
            </div>

            {visibleTransports.map((transport) => (
              <div
                className="list-card"
                key={transport.id}
                onClick={() =>
                  openEdit(transport)
                }
              >
                <div className="list-time">
                  {transport.time}
                </div>

                <div className="list-main">
                  <b>{transport.patient}</b>

                  <span>
                    {transport.origin} →{" "}
                    {transport.destination}
                  </span>

                  <small>
                    {transport.ambulance} •{" "}
                    {transport.driver}
                  </small>
                </div>

                <span
                  className={`status ${
                    statusClass[transport.status]
                  }`}
                >
                  {transport.status}
                </span>
              </div>
            ))}
          </div>

          <div className="quick-actions">
            <button
              onClick={() =>
                setFormMode("new")
              }
            >
              <Plus size={18} />
              Ajouter un transport
            </button>

            <button
              onClick={() =>
                setFormMode("new")
              }
            >
              <Repeat2 size={18} />
              Transport récurrent
            </button>

            <button>
              <Users size={18} />
              Nouveau patient
            </button>
          </div>
        </div>
      </section>

      {formMode && (
        <TransportFormModal
          mode={formMode}
          transport={selectedTransport}
          defaultDate={selectedDate}
          onClose={() => {
            setFormMode(null);
            setSelectedTransport(null);
          }}
          onSave={saveTransport}
          onCreate={createTransport}
        />
      )}
    </main>
  );
}

function TransportFormModal({
  mode,
  transport,
  defaultDate,
  onClose,
  onSave,
  onCreate
}: {
  mode: "new" | "edit";
  transport: Transport | null;
  defaultDate: string;
  onClose: () => void;
  onSave: (transport: Transport) => void;
  onCreate: (transport: Transport) => void;
}) {
  const [date, setDate] = useState(
    transport?.date ?? defaultDate
  );

  const [time, setTime] = useState(
    transport?.time ?? "15:00"
  );

  const [patient, setPatient] = useState(
    transport?.patient ?? ""
  );

  const [origin, setOrigin] = useState(
    transport?.origin ?? ""
  );

  const [destination, setDestination] =
    useState(
      transport?.destination ?? ""
    );

  const [ambulance, setAmbulance] =
    useState(
      transport?.ambulance ?? ambulances[0]
    );

  const [driver, setDriver] = useState(
    transport?.driver ?? drivers[0]
  );

  const [type, setType] = useState(
    transport?.type ?? "Consultation"
  );

  const [status, setStatus] =
    useState<Status>(
      transport?.status ?? "Planifié"
    );

  const canSave =
    patient.trim() &&
    origin.trim() &&
    destination.trim() &&
    date &&
    time;

  function submit() {
    const updated: Transport = {
      id:
        transport?.id ??
        `T-${Date.now()
          .toString()
          .slice(-4)}`,
      date,
      time,
      patient,
      origin,
      destination,
      ambulance,
      driver,
      status,
      type
    };

    if (mode === "edit") {
      onSave(updated);
    } else {
      onCreate(updated);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow">
              {mode === "edit"
                ? "MODIFICATION"
                : "NOUVEAU"}
            </span>

            <h3>
              {mode === "edit"
                ? `Modifier ${transport?.id ?? ""}`
                : "Créer un transport"}
            </h3>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
          >
            <X />
          </button>
        </div>

        <div className="form-grid">
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />
          </label>

          <label>
            Heure
            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
            />
          </label>

          <label>
            Patient
            <input
              autoFocus
              value={patient}
              onChange={(e) =>
                setPatient(e.target.value)
              }
              placeholder="Nom et prénom"
            />
          </label>

          <label>
            Lieu de prise en charge
            <input
              value={origin}
              onChange={(e) =>
                setOrigin(e.target.value)
              }
              placeholder="Domicile, hôpital…"
            />
          </label>

          <label>
            Destination
            <input
              value={destination}
              onChange={(e) =>
                setDestination(
                  e.target.value
                )
              }
              placeholder="Établissement…"
            />
          </label>

          <label>
            Ambulance
            <select
              value={ambulance}
              onChange={(e) =>
                setAmbulance(
                  e.target.value
                )
              }
            >
              {ambulances.map(
                (ambulance) => (
                  <option
                    key={ambulance}
                  >
                    {ambulance}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            Chauffeur
            <select
              value={driver}
              onChange={(e) =>
                setDriver(e.target.value)
              }
            >
              {drivers.map((driver) => (
                <option key={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </label>

          <label>
            Type
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option>Consultation</option>
              <option>Hospitalisation</option>
              <option>Imagerie</option>
              <option>Soins</option>
              <option>Retour</option>
            </select>
          </label>

          <label>
            Statut
            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as Status
                )
              }
            >
              {statusOptions.map(
                (statusOption) => (
                  <option
                    key={statusOption}
                  >
                    {statusOption}
                  </option>
                )
              )}
            </select>
          </label>
        </div>

        <div className="modal-foot">
          <button
            className="secondary"
            onClick={onClose}
          >
            Annuler
          </button>

          <button
            className="primary"
            disabled={!canSave}
            onClick={submit}
          >
            {mode === "edit"
              ? "Enregistrer les modifications"
              : "Créer le transport"}
          </button>
        </div>
      </div>
    </div>
  );
}
