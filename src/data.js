// Dated session data; hall and seat availability are illustrative.
export const movies = [
  {
    id: "jalyn",
    name: "Жалын",
    genre: "Боевик · Драма · Мелодрама",
    year: 2026,
    country: "Кыргызстан",
    poster: "/posters/jalyn.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/7/7/2/8388277/472807638834.jpg",
    feature: true,
    desc: "Кыргызстанский фильм в афише Cinematica. Подробное описание фильма доступно в источнике.",
    times: {
      "2026-10-08": [
        ["21:45", 1500],
        ["22:00", 460],
        ["23:55", 410],
      ],
      "2026-10-09": [
        ["12:00", 290],
        ["14:00", 290],
        ["16:00", 300],
        ["18:00", 460],
        ["19:45", 1500],
        ["20:00", 460],
        ["21:45", 1500],
        ["22:00", 460],
        ["23:55", 410],
      ],
    },
  },
  {
    id: "jyd",
    name: "Жүдөмүшов",
    genre: "Комедия",
    year: 2026,
    country: "Кыргызстан",
    poster: "/posters/jyd.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/0/2/2/8388220/649616379974.jpg",
    times: {
      "2026-10-08": [
        ["22:00", 460],
        ["23:55", 410],
      ],
      "2026-10-09": [],
    },
  },
  {
    id: "tuzak",
    name: "Тузак",
    genre: "Триллер · Драма",
    year: 2026,
    country: "Кыргызстан",
    poster: "/posters/tuzak.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/8/7/2/8388278/183674241109.jpg",
    times: {
      "2026-10-08": [
        ["22:00", 460],
        ["23:50", 410],
      ],
      "2026-10-09": [],
    },
  },
  {
    id: "resident",
    name: "Обитель зла",
    genre: "Ужасы · Боевик",
    year: 2026,
    country: "Германия / США",
    poster: "/posters/resident.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/9/0/6/8382609/278882891419.jpg",
    times: {
      "2026-10-08": [
        ["21:10", 460],
        ["23:50", 580],
      ],
      "2026-10-09": [
        ["18:05", 600],
        ["23:50", 580],
      ],
    },
    imax: true,
  },
  {
    id: "avengers",
    name: "Мстители: Финал",
    genre: "Боевик · Фантастика",
    year: 2019,
    country: "США",
    poster: "/posters/avengers.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/9/8/6/8319689/82baec3bbdf4c6395750e46d6ca1325c.jpeg",
    times: {
      "2026-10-08": [],
      "2026-10-09": [
        ["10:45", 370],
        ["14:25", 370],
        ["20:15", 600],
      ],
    },
    imax: true,
  },
  {
    id: "veriti",
    name: "Тайный дневник Верити",
    genre: "Мелодрама · Триллер",
    year: 2026,
    country: "США",
    poster: "/posters/veriti.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/3/6/3/8380363/934960301782893341.jpg",
    times: {
      "2026-10-08": [
        ["21:25", 460],
        ["23:50", 410],
      ],
      "2026-10-09": [],
    },
  },
  {
    id: "magic",
    name: "Волшебное перо",
    genre: "Анимация",
    year: 2026,
    country: "Франция / Бельгия",
    poster: "/posters/magic.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/9/1/0/8387019/494830133794.jpg",
    times: {
      "2026-10-08": [],
      "2026-10-09": [
        ["12:05", 290],
        ["14:10", 290],
        ["16:15", 300],
      ],
    },
  },
  {
    id: "digger",
    name: "Диггер",
    genre: "Комедия · Драма",
    year: 2026,
    country: "США",
    poster: "/posters/digger.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/4/4/7/8379744/369600139003.jpg",
    times: {
      "2026-10-08": [],
      "2026-10-09": [
        ["13:35", 310],
        ["17:20", 340],
      ],
    },
  },
  {
    id: "party",
    name: "Девичник в спа",
    genre: "Комедия",
    year: 2026,
    country: "Австралия",
    poster: "/posters/party.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/0/7/5/8386570/279657521782418029.jpg",
    times: {
      "2026-10-08": [["23:55", 410]],
      "2026-10-09": [
        ["20:10", 460],
        ["23:55", 410],
      ],
    },
  },
  {
    id: "jigit",
    name: "Жасалма Жигит",
    genre: "Комедия",
    year: 2026,
    country: "Кыргызстан",
    poster: "/posters/jigit.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/5/3/2/8388235/397637762066.jpg",
    times: { "2026-10-08": [["21:40", 460]], "2026-10-09": [] },
  },
  {
    id: "carg",
    name: "Каргыш",
    genre: "Драма · Мистика",
    year: 2026,
    country: "Кыргызстан",
    poster: "/posters/carg.jpg",
    posterSource:
      "https://static.kinoafisha.info/k/movie_posters/220/upload/movie_posters/2/3/2/8388232/461747850989.jpg",
    times: {
      "2026-10-08": [
        ["22:00", 460],
        ["23:50", 410],
      ],
      "2026-10-09": [],
    },
  },
];
Object.assign(
  movies.find((m) => m.id === "avengers"),
  {
    posterSource: "https://en.disneyme.com/movies/avengers-endgame",
    backdrop: "/backdrops/avengers.jpg",
    heroText:
      "Мстители возвращаются, чтобы исправить последствия щелчка Таноса.",
    desc: "После катастрофы, устроенной Таносом, уцелевшие Мстители объединяются ради последней попытки спасти мир. История о дружбе, общей цели и цене, которую герои готовы заплатить за победу.",
    director: "Энтони Руссо, Джо Руссо",
    cast: "Роберт Дауни мл., Крис Эванс, Скарлетт Йоханссон, Крис Хемсворт",
    trailer: "https://www.youtube.com/watch?v=0jNvJU52LvU",
    detailSource: "https://en.disneyme.com/movies/avengers-endgame",
  },
);
Object.assign(
  movies.find((m) => m.id === "jalyn"),
  {
    posterSource:
      "https://cdn.p24.app/r/ps/kg/ae/ae4fee1b-6ee6-45d0-b626-6c0a57f1c964/41b1a824-675a-44d6-8a9a-bd42fa9e3bbe.jpg",
    backdrop: "/posters/jalyn.jpg",
    backdropKind: "poster",
    backdropSource: "https://ticket.kg/ky/cinema/zhalyn",
    heroText:
      "Пожарный Эржан спасает Бегимай из горящей машины. Так начинается их история.",
    desc: "Молодой пожарный Эржан посвятил себя спасению людей. Встреча с Бегимай становится началом любви, но появляется человек, готовый разрушить их отношения.",
    duration: 95,
    director: "Азамат Исмаилов",
    cast: "Султан Торогельдиев, Айдай Шабданова, Бекжан Эрменкулов",
    detailSource: "https://ticket.kg/ky/cinema/zhalyn",
  },
);
Object.assign(
  movies.find((m) => m.id === "resident"),
  {
    backdrop: "/backdrops/resident.jpg",
    backdropSource: "https://www.kinoafisha.info/movies/8382609/shots/",
    heroText:
      "Обычная доставка приводит курьера в Раккун-Сити, охваченный неизвестным вирусом.",
    desc: "Курьер получает срочный заказ: доставить посылку в отдалённую больницу. В Раккун-Сити начинается вспышка неизвестного вируса, и обычная поездка превращается в борьбу за выживание.",
    director: "Зак Креггер",
    cast: "Остин Абрамс, Пол Уолтер Хаузер, Зак Черри, Кали Реис",
    detailSource: "https://www.kinoafisha.info/movies/8382609/",
  },
);
export const days = [
  {
    date: "2026-10-08",
    day: "Четверг",
    short: "Чт",
    n: "08",
    month: "октября",
  },
  {
    date: "2026-10-09",
    day: "Пятница",
    short: "Пт",
    n: "09",
    month: "октября",
  },
];
export const dateName = (d) => {
  const v = days.find((x) => x.date === d);
  return v ? v.n + " " + v.month : "Дата не выбрана";
};
export const baseSession = (movie, date, time, price) => ({
  movieId: movie.id,
  date,
  time,
  price,
  format: "Демонстрационный",
  hall: "Зал 4 (демо)",
});

export const publicAsset = (name) => (import.meta.env?.BASE_URL || "/") + name;
for (const movie of movies) {
  movie.poster = publicAsset(movie.poster.slice(1));
  if (movie.backdrop) movie.backdrop = publicAsset(movie.backdrop.slice(1));
}
