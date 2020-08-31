import { FilmInfo } from '../../components/film-card';

const mockData = {
  titles: ['The Dance of Life', 'Sagebrush Trail', 'The Man with the Golden Arm', 'Santa Claus Conquers the Martians', 'Popeye the Sailor Meets Sindbad the Sailor'],
  imgs: ['./images/posters/the-dance-of-life.jpg', './images/posters/sagebrush-trail.jpg', './images/posters/the-man-with-the-golden-arm.jpg', './images/posters/santa-claus-conquers-the-martians.jpg', './images/posters/popeye-meets-sinbad.png'],
  genres: ['musical', 'western', 'drama', 'comedy', 'cartoon'],
  years: [1929, 1933, 1925, 1900, 1893],
};

const createFilmData = (count: number): Promise<FilmInfo[]> => new Promise((resolve) => {
  const mockFilms: FilmInfo[] = [];

  for (let i = 0; i < count; i += 1) {
    const randomIndex = Math.floor(Math.random() * 4) + 1;
    const mockFilm: FilmInfo = {
      id: i,
      title: mockData.titles[randomIndex],
      rating: (Math.random() * 10).toFixed(1),
      description: 'Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington. The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar. Are worried that their children Girmar.',
      img: mockData.imgs[randomIndex],
      genre: [mockData.genres[randomIndex]],
      commentsCount: Math.floor(Math.random() * 100),
      year: mockData.years[randomIndex],
      duration: Math.floor((Math.random() * 150)),
      inWatchList: Math.random() > 0.5,
      itWatched: Math.random() < 0.5,
      itFavorite: Math.random() > 0.5,
    };

    mockFilms.push(mockFilm);
  }

  setTimeout(() => {
    resolve(mockFilms);
  }, 2000);
});

const getFilmData = (count = 5): Promise<FilmInfo[]> => new Promise((resolve) => {
  createFilmData(count).then((films: FilmInfo[]) => {
    resolve(films);
  }).catch((err) => new Error(err));
});

export { getFilmData };
