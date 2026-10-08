import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  Ticket,
  Play,
  Menu,
  X,
  Info,
  Check,
  Film,
  Phone,
  Navigation,
  Armchair,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { movies, days, dateName, baseSession, publicAsset } from "./data.js";

const official = "https://cinematica.kg/cinema/6";
const catalogSource =
  "https://kg.kinoafisha.info/bishkek/cinema/8327039/schedule/";
const money = (n) => new Intl.NumberFormat("ru-RU").format(n) + " сом";
const readRoute = () =>
  decodeURIComponent(window.location.hash.replace(/^#\/?/, "")) || "home";
const readTickets = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("dc_demo_tickets") || "[]");
    return Array.isArray(saved)
      ? saved.filter(
          (t) =>
            movies.some((m) => m.id === t.movieId) && Array.isArray(t.seats),
        )
      : [];
  } catch {
    return [];
  }
};
const featured = ["avengers", "jalyn", "resident"].map((id) =>
  movies.find((m) => m.id === id),
);
const ageLabel = (movie) =>
  movie.age ? <span className="age-label">{movie.age}</span> : null;

function Brand() {
  return (
    <span className="brand">
      <img className="brand-mark" src={publicAsset("mark.svg")} alt="" />
      <span className="brand-name">
        <strong>DORDOI</strong>
        <span>CINEMA</span>
      </span>
    </span>
  );
}
function Poster({ movie, className = "", eager = false }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [movie.poster]);
  return (
    <div className={"poster " + className}>
      {failed ? (
        <span className="poster-fallback">
          <Film size={30} />
          {movie.name}
        </span>
      ) : (
        <img
          loading={eager ? "eager" : "lazy"}
          src={movie.poster}
          alt={"Постер «" + movie.name + "»"}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
function DateSwitch({ value, onChange }) {
  return (
    <div className="date-row" aria-label="Дата сеанса">
      {days.map((d) => (
        <button
          key={d.date}
          className={"date-chip " + (value === d.date ? "selected" : "")}
          aria-pressed={value === d.date}
          aria-label={d.short + " " + d.n + " окт"}
          onClick={() => onChange(d.date)}
        >
          <span>{d.short}</span>
          <strong>{d.n}</strong>
          <small>октября</small>
        </button>
      ))}
      <span className="date-hint">Октябрь 2026</span>
    </div>
  );
}
function SessionTimes({ movie, date, onChoose, onMore, compact = false }) {
  const times = movie.times[date] || [];
  return (
    <div className={"times " + (compact ? "compact" : "")}>
      {times.length ? (
        <>
          {(compact ? times.slice(0, 3) : times).map(([time, price], i) => (
            <button
              className="time-pill"
              key={time + i}
              onClick={() => onChoose(movie, date, time, price)}
              aria-label={time + " " + money(price)}
              title={
                dateName(date) +
                ", " +
                time +
                " · от " +
                money(price) +
                " · демо"
              }
            >
              <strong>{time}</strong>
              <span>{money(price)}</span>
            </button>
          ))}
          {compact && times.length > 3 && (
            <button className="more-times" onClick={() => onMore(movie)}>
              Все {times.length} сеансов <ArrowRight size={13} />
            </button>
          )}
        </>
      ) : (
        <span className="no-sessions">Нет сеансов на эту дату</span>
      )}
    </div>
  );
}
function MovieCard({ movie, date, onOpen, onChoose }) {
  return (
    <article className="movie-card">
      <button
        className="movie-poster-btn"
        onClick={() => onOpen(movie)}
        aria-label={"Открыть фильм " + movie.name}
      >
        <Poster movie={movie} />
        {ageLabel(movie)}
        {movie.imax && <span className="poster-badge">IMAX</span>}
        <span className="poster-go">
          <ArrowUpRight size={21} />
        </span>
      </button>
      <div className="movie-card-copy">
        <span className="meta-tag">
          {movie.country} · {movie.year}
        </span>
        <button className="movie-name" onClick={() => onOpen(movie)}>
          {movie.name}
        </button>
        <p>{movie.genre}</p>
        <SessionTimes
          movie={movie}
          date={date}
          onChoose={onChoose}
          onMore={onOpen}
          compact
        />
      </div>
    </article>
  );
}
function EmptyPanel({ title, desc, children }) {
  return (
    <div className="empty-panel">
      <Film size={27} />
      <h2>{title}</h2>
      <p>{desc}</p>
      {children}
    </div>
  );
}
function MovieFacts({ movie }) {
  return (
    <div className="film-meta">
      <span>{movie.year}</span>
      {movie.age && <span className="meta-age">{movie.age}</span>}
      {movie.duration && (
        <span>
          <Clock3 size={14} />
          {movie.duration} мин
        </span>
      )}
      <span>{movie.country}</span>
    </div>
  );
}
function MovieDescription({ movie }) {
  return movie.desc ? (
    <p className="film-description">{movie.desc}</p>
  ) : (
    <p className="film-description missing-description">
      Описание этого фильма можно посмотреть в{" "}
      <a href={catalogSource} target="_blank" rel="noopener noreferrer">
        афише кинотеатра <ArrowUpRight size={14} />
      </a>
      .
    </p>
  );
}
function Hero({ movie, active, onSlide, onOpen, onSchedule }) {
  return (
    <section
      className={
        "hero " +
        (movie.backdropKind === "poster" ? "hero-poster-background" : "") +
        " hero-" +
        movie.id
      }
      aria-label="Фильм в центре внимания"
    >
      <img
        className="hero-backdrop"
        src={movie.backdrop || movie.poster}
        alt=""
      />
      <div className="hero-shade" />
      <div className="hero-content">
        <span className="hero-kicker">Dordoi Plaza · Бишкек</span>
        <h1>
          {movie.name === "Мстители: Финал" ? (
            <>
              Мстители:
              <br />
              <em>Финал</em>
            </>
          ) : (
            movie.name
          )}
        </h1>
        <div className="hero-meta">
          <span>{movie.genre}</span>
          <span>{movie.year}</span>
          {movie.imax && <b>IMAX</b>}
          {movie.age && <span>{movie.age}</span>}
        </div>
        <p>
          {movie.heroText ||
            movie.desc ||
            "Выберите удобный сеанс в Dordoi Plaza."}
        </p>
        <div className="hero-actions">
          <button className="primary" onClick={() => onSchedule(movie)}>
            Выбрать сеанс <ArrowRight size={17} />
          </button>
          {movie.trailer ? (
            <a
              className="trailer-link"
              href={movie.trailer}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <Play size={14} fill="currentColor" />
              </span>
              Трейлер
            </a>
          ) : (
            <button className="trailer-link" onClick={() => onOpen(movie)}>
              О фильме <ArrowUpRight size={17} />
            </button>
          )}
        </div>
      </div>
      <div className="hero-bottom">
        <a
          className="hero-place"
          href={official}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cinematica · 3 этаж <ArrowUpRight size={14} />
        </a>
        <div className="hero-controls">
          <span className="hero-counter">
            0{active + 1}
            <small> / 03</small>
          </span>
          <button
            className="round-button"
            aria-label="Предыдущий фильм"
            onClick={() =>
              onSlide((active + featured.length - 1) % featured.length)
            }
          >
            <ChevronLeft size={19} />
          </button>
          <button
            className="round-button"
            aria-label="Следующий фильм"
            onClick={() => onSlide((active + 1) % featured.length)}
          >
            <ChevronRight size={19} />
          </button>
        </div>
      </div>
      <div className="hero-slide-tabs">
        {featured.map((m, i) => (
          <button
            key={m.id}
            aria-label={"Показать " + m.name}
            aria-pressed={i === active}
            className={i === active ? "active" : ""}
            onClick={() => onSlide(i)}
          >
            <img src={m.poster} alt="" />
            <span>{m.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
function BookingSteps({ step }) {
  return (
    <div className="booking-steps">
      <span className="complete">
        <Check size={12} />
        Сеанс
      </span>
      <i />
      <span className={step === 1 ? "current" : "complete"}>
        {step > 1 ? <Check size={12} /> : <b>2</b>}Места
      </span>
      <i />
      <span className={step === 2 ? "current" : ""}>
        <b>3</b>Билет
      </span>
    </div>
  );
}
function OrderSummary({
  movie,
  session,
  selected,
  total,
  checkout = false,
  onContinue,
  onChange,
}) {
  return (
    <aside className={checkout ? "checkout-summary" : "booking-aside"}>
      <div className="aside-title">
        <h2>{checkout ? "Ваш заказ" : "Ваш сеанс"}</h2>
        <Ticket size={18} />
      </div>
      <div className="aside-film">
        <Poster movie={movie} />
        <div>
          <strong>{movie.name}</strong>
          <small>{movie.genre}</small>
          <span className="format-tag">Демо-сеанс</span>
        </div>
      </div>
      <div className="order-detail">
        <span>Кинотеатр</span>
        <strong>Dordoi Plaza</strong>
      </div>
      <div className="order-detail">
        <span>Дата и время</span>
        <strong>
          {dateName(session.date)}, {session.time}
        </strong>
      </div>
      <div className="order-detail">
        <span>Зал</span>
        <strong>{session.hall}</strong>
      </div>
      <div className="order-detail">
        <span>Места</span>
        <strong>
          {selected.length
            ? selected.map((s) => s.id).join(", ")
            : "Выберите на схеме"}
        </strong>
      </div>
      {selected.length > 0 && (
        <div className="order-line-items">
          {selected.map((s) => (
            <span key={s.id}>
              {s.id} · {s.type === "vip" ? "VIP" : "Стандарт"}
              <b>{money(session.price + (s.type === "vip" ? 150 : 0))}</b>
            </span>
          ))}
        </div>
      )}
      <div className="seat-price-line" aria-live="polite">
        <span>Итого</span>
        <strong>{money(total)}</strong>
      </div>
      {checkout ? (
        <button className="text-link" onClick={onChange}>
          Изменить места <ChevronRight size={15} />
        </button>
      ) : (
        <button
          className="primary wide"
          disabled={!selected.length}
          onClick={onContinue}
        >
          Продолжить <ArrowRight size={17} />
        </button>
      )}
      <small className="aside-note">
        Учебный билет · без оплаты и бронирования
      </small>
    </aside>
  );
}

export default function App() {
  const [route, setRoute] = useState(readRoute);
  const [menu, setMenu] = useState(false);
  const [date, setDate] = useState("2026-10-09");
  const [heroIndex, setHeroIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все фильмы");
  const [session, setSession] = useState(null);
  const [selected, setSelected] = useState([]);
  const [tickets, setTickets] = useState(readTickets);
  const [activeTicket, setActiveTicket] = useState(null);
  const [client, setClient] = useState({ name: "", email: "", phone: "" });
  const [formError, setFormError] = useState("");
  const [seatMessage, setSeatMessage] = useState("");
  const [faq, setFaq] = useState(-1);
  useEffect(() => {
    const change = () => {
      setRoute(readRoute());
      setMenu(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", change);
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    const names = {
      home: "Афиша и билеты",
      movies: "Афиша",
      schedule: "Расписание",
      seats: "Выбор мест",
      checkout: "Оформление",
      ticket: "Ваш билет",
      tickets: "Мои билеты",
      about: "О кинотеатре",
    };
    document.title =
      (route.startsWith("film/")
        ? movies.find((m) => m.id === route.split("/")[1])?.name || "Фильм"
        : names[route] || "Афиша") + " | Dordoi Cinema";
  }, [route]);
  const nav = (next) => {
    setMenu(false);
    if (readRoute() === next) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.hash = "/" + next;
    }
  };
  const openFilm = (movie) => nav("film/" + movie.id);
  const choose = (movie, day, time, price) => {
    setSession(baseSession(movie, day, time, price));
    setSelected([]);
    setSeatMessage("");
    setFormError("");
    nav("seats");
  };
  const film = movies.find((m) => m.id === route.split("/")[1]) || movies[0];
  const bookingMovie =
    movies.find((m) => m.id === session?.movieId) || movies[0];
  const filtered = useMemo(
    () =>
      movies.filter(
        (m) =>
          m.name
            .toLocaleLowerCase("ru")
            .includes(search.trim().toLocaleLowerCase("ru")) &&
          (category === "Все фильмы" ||
            (category === "Кыргызское кино" && m.country === "Кыргызстан") ||
            (category === "IMAX" && m.imax) ||
            (category === "Комедии" && m.genre.includes("Комедия"))),
      ),
    [search, category],
  );
  const available = movies.filter((m) => m.times[date]?.length);
  const total = selected.reduce(
    (n, seat) => n + (session?.price || 0) + (seat.type === "vip" ? 150 : 0),
    0,
  );
  function selectSeat(id, vip) {
    if (selected.some((s) => s.id === id)) {
      setSelected(selected.filter((s) => s.id !== id));
      setSeatMessage("");
    } else if (selected.length >= 6) {
      setSeatMessage(
        "Можно выбрать до 6 мест в одном заказе. Снимите одно место, чтобы выбрать другое.",
      );
    } else {
      setSelected([...selected, { id, type: vip ? "vip" : "regular" }]);
      setSeatMessage("");
    }
  }
  function submit(event) {
    event.preventDefault();
    if (!session || !selected.length) {
      setFormError("Сначала выберите сеанс и места.");
      return;
    }
    if (
      client.name.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email.trim()) ||
      client.phone.replace(/\D/g, "").length < 8
    ) {
      setFormError("Проверьте имя, электронную почту и номер телефона.");
      return;
    }
    const ticket = {
      id: "DC-" + Date.now().toString(36).toUpperCase().slice(-7),
      movieId: session.movieId,
      date: session.date,
      time: session.time,
      hall: session.hall,
      format: session.format,
      seats: selected.map((s) => s.id),
      total,
      created: new Date().toISOString(),
    };
    const next = [ticket, ...tickets].slice(0, 20);
    try {
      localStorage.setItem("dc_demo_tickets", JSON.stringify(next));
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
    setTickets(next);
    setActiveTicket(ticket);
    setClient({ name: "", email: "", phone: "" });
    setFormError("");
    nav("ticket");
  }
  const navItems = (
    <>
      <button
        className={
          route === "home" || route === "movies" || route.startsWith("film/")
            ? "on"
            : ""
        }
        onClick={() => nav("movies")}
      >
        Афиша
      </button>
      <button
        className={route === "schedule" ? "on" : ""}
        onClick={() => nav("schedule")}
      >
        Расписание
      </button>
      <button
        className={route === "about" ? "on" : ""}
        onClick={() => nav("about")}
      >
        О кинотеатре
      </button>
    </>
  );
  const pageHeading = (label, title, desc) => (
    <div className="page-heading">
      {label && <span className="eyebrow">{label}</span>}
      <h1>{title}</h1>
      {desc && <p>{desc}</p>}
    </div>
  );
  const sources = (
    <p className="data-note">
      <Info size={15} />
      <span>
        Демо-расписание на 8 и 9 октября.{" "}
        <a href={official} target="_blank" rel="noopener noreferrer">
          Актуальное расписание <ArrowUpRight size={12} />
        </a>
      </span>
    </p>
  );

  return (
    <div className="app">
      <div className="notice">
        <span>Демо-версия</span>
        <p>Без оплаты и бронирования</p>
        <a href={official} target="_blank" rel="noopener noreferrer">
          Официальный кинотеатр <ArrowUpRight size={12} />
        </a>
      </div>
      <header className="header">
        <div className="header-inner">
          <button
            className="brand-button"
            aria-label="Dordoi Cinema, главная"
            onClick={() => nav("home")}
          >
            <Brand />
          </button>
          <nav className="desktop-nav" aria-label="Основная навигация">
            {navItems}
          </nav>
          <div className="header-right">
            <span className="location-pill">
              <MapPin size={14} />
              Dordoi Plaza <ChevronRight size={12} />
            </span>
            <button
              className="ticket-button"
              onClick={() => nav("tickets")}
              aria-label="Мои билеты"
            >
              <Ticket size={17} />
              <span>Мои билеты</span>
              {tickets.length > 0 && <i>{tickets.length}</i>}
            </button>
            <button
              className="menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menu}
              aria-controls="mobile-navigation"
            >
              {menu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menu && (
          <nav
            className="mobile-nav"
            id="mobile-navigation"
            aria-label="Мобильная навигация"
          >
            {navItems}
            <button onClick={() => nav("movies")}>Все фильмы</button>
            <button onClick={() => nav("tickets")}>Мои билеты</button>
          </nav>
        )}
      </header>
      <main>
        {route === "home" && (
          <div className="main-container">
            <Hero
              movie={featured[heroIndex]}
              active={heroIndex}
              onSlide={setHeroIndex}
              onOpen={openFilm}
              onSchedule={(movie) => {
                setDate(
                  movie.times[date]?.length
                    ? date
                    : days.find((d) => movie.times[d.date]?.length)?.date ||
                        date,
                );
                openFilm(movie);
              }}
            />
            <section className="section now-section">
              <div className="section-head">
                <div>
                  <h2>
                    Сейчас в кино <span>{available.length}</span>
                  </h2>
                </div>
                <button className="text-link" onClick={() => nav("movies")}>
                  Вся афиша <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="home-tools">
                <DateSwitch value={date} onChange={setDate} />
              </div>
              <div className="home-movies">
                {available.slice(0, 5).map((m) => (
                  <MovieCard
                    key={m.id}
                    movie={m}
                    date={date}
                    onOpen={openFilm}
                    onChoose={choose}
                  />
                ))}
              </div>
              {sources}
            </section>
          </div>
        )}
        {route === "movies" && (
          <div className="main-container">
            {pageHeading(null, "Афиша", null)}
            <div className="catalog-tools">
              <div className="category-row">
                {["Все фильмы", "Кыргызское кино", "Комедии", "IMAX"].map(
                  (c) => (
                    <button
                      key={c}
                      className={category === c ? "active" : ""}
                      aria-pressed={category === c}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </button>
                  ),
                )}
              </div>
              <div className="search-field">
                <Search size={17} />
                <input
                  aria-label="Поиск фильма"
                  type="search"
                  placeholder="Найти фильм"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    aria-label="Очистить поиск"
                    onClick={() => setSearch("")}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            <DateSwitch value={date} onChange={setDate} />
            {filtered.length ? (
              <div className="catalog-grid">
                {filtered.map((m) => (
                  <MovieCard
                    key={m.id}
                    movie={m}
                    date={date}
                    onOpen={openFilm}
                    onChoose={choose}
                  />
                ))}
              </div>
            ) : (
              <EmptyPanel
                title="Фильм не найден"
                desc="Попробуйте другое название или сбросьте фильтры."
              >
                <button
                  className="secondary"
                  onClick={() => {
                    setSearch("");
                    setCategory("Все фильмы");
                  }}
                >
                  Сбросить фильтры
                </button>
              </EmptyPanel>
            )}
            {sources}
          </div>
        )}
        {route.startsWith("film/") && (
          <div className="main-container film-page">
            <div className="breadcrumbs">
              <button onClick={() => nav("home")}>Афиша</button>
              <ChevronRight size={13} />
              <span>{film.name}</span>
            </div>
            <section className="film-hero">
              <div className="film-art">
                <Poster movie={film} eager />
                {ageLabel(film)}
              </div>
              <div className="film-details">
                <div className="film-intro">
                  <h1>{film.name}</h1>
                  <div className="genre-tags">
                    {film.genre.split(" · ").map((g) => (
                      <span key={g}>{g}</span>
                    ))}
                  </div>
                  <MovieFacts movie={film} />
                </div>
                <MovieDescription movie={film} />
                <div className="film-actions">
                  <a
                    className={film.trailer ? "primary" : "secondary"}
                    href={film.trailer || film.detailSource || catalogSource}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {film.trailer ? (
                      <>
                        <Play size={15} fill="currentColor" />
                        Смотреть трейлер
                      </>
                    ) : (
                      <>
                        Подробнее о фильме <ArrowUpRight size={15} />
                      </>
                    )}
                  </a>
                  <button
                    className="text-link"
                    onClick={() =>
                      document
                        .getElementById("film-sessions")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                  >
                    К сеансам <ArrowRight size={16} />
                  </button>
                </div>
              </div>
              <dl className="film-credits">
                {film.director && (
                  <div>
                    <dt>Режиссёр</dt>
                    <dd>{film.director}</dd>
                  </div>
                )}
                {film.cast && (
                  <div>
                    <dt>В ролях</dt>
                    <dd>{film.cast}</dd>
                  </div>
                )}
                <div>
                  <dt>Кинотеатр</dt>
                  <dd>
                    Dordoi Plaza
                    <br />
                    <span>Бишкек, 3 этаж</span>
                  </dd>
                </div>
                <div>
                  <dt>Афиша</dt>
                  <dd>
                    <a
                      href={film.detailSource || catalogSource}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Источник <ArrowUpRight size={13} />
                    </a>
                  </dd>
                </div>
              </dl>
            </section>
            <section className="section schedule-on-film" id="film-sessions">
              <div className="section-head">
                <div>
                  <h2>Выберите время</h2>
                </div>
                <span className="subtle-label">
                  <MapPin size={14} />
                  Dordoi Plaza
                </span>
              </div>
              <DateSwitch value={date} onChange={setDate} />
              <div className="film-times-box">
                <span className="session-row-label">
                  Сеансы <small>Цена от · сом</small>
                </span>
                <SessionTimes movie={film} date={date} onChoose={choose} />
              </div>
              {sources}
            </section>
            <section className="section related-section">
              <div className="section-head">
                <h2>Ещё на экранах</h2>
                <button className="text-link" onClick={() => nav("movies")}>
                  Все фильмы <ArrowUpRight size={16} />
                </button>
              </div>
              <div className="related-movies">
                {available
                  .filter((m) => m.id !== film.id)
                  .slice(0, 4)
                  .map((m) => (
                    <MovieCard
                      key={m.id}
                      movie={m}
                      date={date}
                      onOpen={openFilm}
                      onChoose={choose}
                    />
                  ))}
              </div>
            </section>
          </div>
        )}
        {route === "schedule" && (
          <div className="main-container">
            {pageHeading(null, "Расписание", null)}
            <div className="schedule-top">
              <div className="cinema-loc">
                <MapPin size={20} />
                <div>
                  <strong>Cinematica · Dordoi Plaza</strong>
                  <small>Бишкек, Ибраимова, 115 · 3 этаж</small>
                </div>
              </div>
              <span className="outline-badge">Демо-афиша</span>
            </div>
            <DateSwitch value={date} onChange={setDate} />
            <div className="schedule-list">
              {available.map((m) => (
                <article className="schedule-item" key={m.id}>
                  <button
                    className="schedule-poster"
                    onClick={() => openFilm(m)}
                    aria-label={"Открыть фильм " + m.name}
                  >
                    <Poster movie={m} />
                  </button>
                  <div className="schedule-info">
                    <button
                      className="schedule-name"
                      onClick={() => openFilm(m)}
                    >
                      {m.name}
                      <ArrowUpRight size={15} />
                    </button>
                    <span>{m.genre}</span>
                    <div className="schedule-metadata">
                      {m.age && <b>{m.age}</b>}
                      <span>{m.year}</span>
                      {m.duration && <span>{m.duration} мин</span>}
                    </div>
                  </div>
                  <div className="schedule-slots">
                    <span className="slot-caption">Сеансы · цена от</span>
                    <SessionTimes movie={m} date={date} onChoose={choose} />
                    <small className="format-note">
                      Зал и формат уточняются у кинотеатра
                    </small>
                  </div>
                </article>
              ))}
            </div>
            {sources}
          </div>
        )}
        {route === "seats" &&
          (session ? (
            <div className="main-container booking-page">
              <div className="booking-topline">
                <button
                  className="back-link"
                  onClick={() => openFilm(bookingMovie)}
                >
                  <ChevronLeft size={16} />К фильму
                </button>
                <BookingSteps step={1} />
              </div>
              <div className="booking-page-title">
                <h1>Выберите места</h1>
                <p>
                  {bookingMovie.name} <span>·</span> {dateName(session.date)},{" "}
                  {session.time}
                </p>
              </div>
              <div className="booking-grid">
                <section
                  className="seat-panel"
                  aria-label="Схема демонстрационного зала"
                >
                  <div className="seat-panel-head">
                    <span>
                      <Armchair size={17} />
                      {session.hall}
                    </span>
                    <small>Стандарт · {money(session.price)}</small>
                  </div>
                  <div className="screen-area">
                    <div className="screen-curve" />
                    <span>ЭКРАН</span>
                  </div>
                  <div className="seat-stage">
                    <div className="seat-map">
                      {Array.from({ length: 9 }, (_, r) => (
                        <div className="seat-row" key={r}>
                          <span className="row-id">
                            {String.fromCharCode(65 + r)}
                          </span>
                          {Array.from({ length: 12 }, (_, c) => {
                            const id = String.fromCharCode(65 + r) + (c + 1);
                            const blocked =
                              (r === 1 && [3, 4].includes(c)) ||
                              (r === 3 && [8, 9].includes(c)) ||
                              (r === 4 && c === 2) ||
                              (r === 6 && [4, 5].includes(c)) ||
                              (r === 7 && [9, 10].includes(c));
                            const picked = selected.some((s) => s.id === id);
                            const vip = r >= 7;
                            return (
                              <React.Fragment key={id}>
                                {c === 6 && <span className="aisle" />}
                                <button
                                  disabled={blocked}
                                  aria-label={
                                    "Ряд " +
                                    String.fromCharCode(65 + r) +
                                    " место " +
                                    (c + 1) +
                                    (blocked ? ", занято" : "")
                                  }
                                  aria-pressed={picked}
                                  title={id + (vip ? " · VIP" : "")}
                                  className={
                                    "seat " +
                                    (blocked
                                      ? "blocked"
                                      : picked
                                        ? "picked"
                                        : vip
                                          ? "vip"
                                          : "available")
                                  }
                                  onClick={() => selectSeat(id, vip)}
                                >
                                  <span>{c + 1}</span>
                                </button>
                              </React.Fragment>
                            );
                          })}
                          <span className="row-id right">
                            {String.fromCharCode(65 + r)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="seat-legend">
                    <span>
                      <i className="available" />
                      Свободно
                    </span>
                    <span>
                      <i className="picked" />
                      Выбрано
                    </span>
                    <span>
                      <i className="blocked" />
                      Занято
                    </span>
                    <span>
                      <i className="vip" />
                      VIP +150 сом
                    </span>
                  </div>
                  <p className="seat-selection-help" aria-live="polite">
                    {seatMessage || "До 6 мест в одном заказе."}
                  </p>
                  <div className="seat-notice">
                    <Info size={15} />
                    <span>
                      Демонстрационная схема: расположение и доступность мест не
                      соответствуют реальному залу.
                    </span>
                  </div>
                </section>
                <OrderSummary
                  movie={bookingMovie}
                  session={session}
                  selected={selected}
                  total={total}
                  onContinue={() => nav("checkout")}
                />
              </div>
            </div>
          ) : (
            <div className="main-container">
              <EmptyPanel
                title="Выберите сеанс"
                desc="Начните с фильма и удобного времени."
              >
                <button className="primary" onClick={() => nav("schedule")}>
                  К расписанию <ArrowRight size={16} />
                </button>
              </EmptyPanel>
            </div>
          ))}
        {route === "checkout" &&
          (session && selected.length ? (
            <div className="main-container checkout-page">
              <div className="booking-topline">
                <button className="back-link" onClick={() => nav("seats")}>
                  <ChevronLeft size={16} />
                  Изменить места
                </button>
                <BookingSteps step={2} />
              </div>
              <div className="booking-page-title">
                <h1>Оформление билета</h1>
                <p>Проверьте сеанс и выбранные места.</p>
              </div>
              <div className="checkout-grid">
                <OrderSummary
                  movie={bookingMovie}
                  session={session}
                  selected={selected}
                  total={total}
                  checkout
                  onChange={() => nav("seats")}
                />
                <form className="checkout-form" onSubmit={submit}>
                  <div className="form-heading">
                    <h2>Контактные данные</h2>
                  </div>
                  <p>
                    В демо можно указать вымышленные данные. Они не сохраняются
                    и не отправляются.
                  </p>
                  <label>
                    Ваше имя
                    <input
                      autoComplete="name"
                      placeholder="Имя"
                      required
                      minLength={2}
                      value={client.name}
                      onChange={(e) =>
                        setClient({ ...client, name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Электронная почта
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      required
                      value={client.email}
                      onChange={(e) =>
                        setClient({ ...client, email: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Номер телефона
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="+996 555 123 456"
                      required
                      value={client.phone}
                      onChange={(e) =>
                        setClient({ ...client, phone: e.target.value })
                      }
                    />
                  </label>
                  <div className="checkout-secure">
                    <Info size={16} />
                    <span>
                      Оплаты здесь нет. Билет не даёт права прохода в кинотеатр.
                    </span>
                  </div>
                  {formError && (
                    <p className="form-error" role="alert">
                      {formError}
                    </p>
                  )}
                  <button className="primary wide" type="submit">
                    Получить демо-билет <ArrowRight size={17} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="main-container">
              <EmptyPanel
                title="Заказ ещё не начат"
                desc="Выберите фильм, сеанс и места."
              >
                <button className="primary" onClick={() => nav("schedule")}>
                  К расписанию <ArrowRight size={16} />
                </button>
              </EmptyPanel>
            </div>
          ))}
        {(route === "ticket" || route === "tickets") && (
          <div className="main-container tickets-page">
            {pageHeading(
              null,
              route === "ticket" ? "Билет готов" : "Мои билеты",
              route === "ticket"
                ? "Сохранён на этом устройстве. Учебный билет не действителен для входа."
                : "Ваши демонстрационные билеты на этом устройстве.",
            )}
            {(route === "ticket"
              ? activeTicket
                ? [activeTicket]
                : tickets.slice(0, 1)
              : tickets
            ).length ? (
              (route === "ticket"
                ? activeTicket
                  ? [activeTicket]
                  : tickets.slice(0, 1)
                : tickets
              ).map((t) => {
                const m = movies.find((x) => x.id === t.movieId) || movies[0];
                return (
                  <div className="ticket-scene" key={t.id}>
                    <div className="ticket-visual">
                      <div className="ticket-main">
                        <div className="ticket-overline">
                          <Brand />
                          <span>DEMO / E-TICKET</span>
                        </div>
                        <div className="ticket-film-row">
                          <Poster movie={m} />
                          <div>
                            <span>DORDOI PLAZA</span>
                            <h2>{m.name}</h2>
                            <p>{m.genre}</p>
                          </div>
                        </div>
                        <div className="ticket-fields">
                          <div>
                            <small>ДАТА</small>
                            <strong>{dateName(t.date)}</strong>
                          </div>
                          <div>
                            <small>ВРЕМЯ</small>
                            <strong>{t.time}</strong>
                          </div>
                          <div>
                            <small>МЕСТА</small>
                            <strong>{t.seats.join(", ")}</strong>
                          </div>
                          <div>
                            <small>ЗАЛ</small>
                            <strong>{t.hall}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="ticket-stub">
                        <span>НЕ ДЛЯ ВХОДА</span>
                        <div className="qr-wrap">
                          <QRCodeSVG
                            value={"DORDOI-CINEMA-DEMO:" + t.id + ":" + m.name}
                            size={138}
                            marginSize={0}
                            fgColor="#171920"
                          />
                        </div>
                        <strong>{t.id}</strong>
                        <small>ДЕМОНСТРАЦИОННЫЙ БИЛЕТ</small>
                      </div>
                    </div>
                    <div className="demo-warning">
                      <Info size={16} />
                      Демо-билет не подтверждает оплату и бронирование.
                      Настоящие билеты доступны на сайте Cinematica.
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyPanel
                title="Здесь будут ваши билеты"
                desc="Ваши демо-билеты сохраняются в этом браузере."
              />
            )}
            <div className="ticket-actions">
              <button className="primary" onClick={() => nav("schedule")}>
                Выбрать ещё один фильм <ArrowRight size={17} />
              </button>
              <a
                className="text-link"
                href={official}
                target="_blank"
                rel="noopener noreferrer"
              >
                Настоящие билеты <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        )}
        {route === "about" && (
          <div className="main-container about-page">
            {pageHeading(
              null,
              "Cinematica в Dordoi Plaza",
              "Бишкек · Ибраимова, 115 · 3 этаж",
            )}
            <section className="about-hero">
              <div className="about-visual">
                <span>CINEMATICA / DORDOI PLAZA</span>
                <strong>
                  IMAX<span>®</span>
                </strong>
                <p>
                  Dordoi Plaza
                  <br />
                  Бишкек, Ибраимова, 115
                </p>
              </div>
              <div className="about-blurb">
                <h2>IMAX и Dolby Atmos</h2>
                <p>
                  Кинотеатр Cinematica находится в ТРЦ Dordoi Plaza на улице
                  Ибраимова, 115. В кинотеатре представлены форматы IMAX и Dolby
                  Atmos.
                </p>
                <p>
                  Перед посещением уточните время сеанса, формат и доступность
                  мест на сайте кинотеатра.
                </p>
                <a
                  className="secondary"
                  href={official}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Сайт кинотеатра <ArrowUpRight size={16} />
                </a>
              </div>
            </section>
            <section className="section">
              <div className="section-head">
                <h2>Как нас найти</h2>
              </div>
              <div className="contact-cards">
                <div>
                  <MapPin size={22} />
                  <span>АДРЕС</span>
                  <strong>Ибраимова, 115</strong>
                  <small>Бишкек · Dordoi Plaza · 3 этаж</small>
                </div>
                <div>
                  <Phone size={22} />
                  <span>ТЕЛЕФОН</span>
                  <a href="tel:+996770903311">+996 770 90 33 11</a>
                  <small>Контакт кинотеатра Cinematica</small>
                </div>
                <div>
                  <Clock3 size={22} />
                  <span>ПЕРЕД ВИЗИТОМ</span>
                  <strong>Проверьте сеанс</strong>
                  <small>Время сеанса на сайте кинотеатра</small>
                </div>
              </div>
              <a
                className="map-link"
                href="https://2gis.kg/bishkek/search/Dordoi%20Plaza"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation size={16} />
                Построить маршрут в 2ГИС <ArrowUpRight size={16} />
              </a>
            </section>
            <section className="section faq-section">
              <div className="section-head">
                <h2>Перед сеансом</h2>
              </div>
              {[
                [
                  "Можно ли купить билет здесь?",
                  "Это учебный сайт. Здесь можно получить демо-билет, а настоящий билет купить на официальном сайте Cinematica.",
                ],
                [
                  "Схема зала настоящая?",
                  "Нет. Расположение, VIP-места и доступность кресел созданы для демонстрации интерфейса. Реальное бронирование не происходит.",
                ],
                [
                  "Расписание актуальное?",
                  "Это датированный снимок на 8 и 9 октября 2026 года. Проверьте время, формат, зал и цену на официальном сайте кинотеатра.",
                ],
                [
                  "Где хранятся демо-билеты?",
                  "Только в браузере на этом устройстве. Контактные данные из формы не сохраняются и не передаются.",
                ],
              ].map(([q, a], i) => (
                <div className="faq-item" key={q}>
                  <button
                    aria-expanded={faq === i}
                    onClick={() => setFaq(faq === i ? -1 : i)}
                  >
                    <strong>{q}</strong>
                    <span>{faq === i ? "−" : "+"}</span>
                  </button>
                  {faq === i && <p>{a}</p>}
                </div>
              ))}
            </section>
          </div>
        )}
      </main>
      <footer className="footer">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              Ибраимова, 115 · 3 этаж
              <br />
              Dordoi Plaza, Бишкек
            </p>
          </div>
          <div className="footer-links">
            <button onClick={() => nav("movies")}>Афиша</button>
            <button onClick={() => nav("schedule")}>Расписание</button>
            <button onClick={() => nav("about")}>О кинотеатре</button>
            <button onClick={() => nav("tickets")}>Мои билеты</button>
          </div>
          <div className="footer-links">
            <a href={official} target="_blank" rel="noopener noreferrer">
              Cinematica <ArrowUpRight size={13} />
            </a>
            <a href={catalogSource} target="_blank" rel="noopener noreferrer">
              Источник афиши <ArrowUpRight size={13} />
            </a>
            <a href="tel:+996770903311">+996 770 90 33 11</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 DORDOI CINEMA</span>
          <span>
            Учебный концепт · неофициальный сайт · без продажи билетов
          </span>
          <span>Бишкек, Кыргызстан</span>
        </div>
      </footer>
    </div>
  );
}
