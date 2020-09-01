import { FilmInfo, Comment } from '../../components/film-card';

const mockData = {
  titles: ['The Dance of Life', 'Sagebrush Trail', 'The Man with the Golden Arm', 'Santa Claus Conquers the Martians', 'Popeye the Sailor Meets Sindbad the Sailor'],
  imgs: ['./images/posters/the-dance-of-life.jpg', './images/posters/sagebrush-trail.jpg', './images/posters/the-man-with-the-golden-arm.jpg', './images/posters/santa-claus-conquers-the-martians.jpg', './images/posters/popeye-meets-sinbad.png'],
  genres: ['musical', 'western', 'drama', 'comedy', 'cartoon'],
  releaseDates: ['29 March 1950', '30 April 1945', '1 March 1978', '30 March 1925', '25 May 1955'],
  countries: ['USA', 'UK', 'Russia', 'China', 'Japan'],
  comments: {
    authors: ['Tim Macoveev', 'John Doe', 'Alex Mason', 'Jason Woods', 'Kan'],
    dates: ['2020-08-18T15:58:52.513Z', '2020-08-31T01:24:39.770Z', '2020-08-17T16:20:16.574Z', '2020-08-19T15:58:52.513Z', '2020-08-14T15:38:52.513Z'],
    texts: ["my friend and I went to watch this movie and never made it there so we didnt like it at all, love camera work, have you noticed the director's cameo, post-credit scene was just amazing omg.", "I fell asleep at the minute two of the film... but later I've woken up... film has nothing to do with it I just felt tired... actually, film is okay... ish, love all Leo Di Caprio performances. He's not in the movie tho. Just telling what kinds of movies I like, I think everyone should know, I know what film is gonna win Oscar this year.", 'such a boring piece of..., I know what film is gonna win Oscar this year, love camera work, post-credit scene was just amazing omg.', "I fell asleep at the minute two of the film... but later I've woken up... film has nothing to do with it I just felt tired... actually, film is okay... ish, love all Leo Di Caprio performances. He's not in the movie tho. Just telling what kinds of movies I like, I think everyone should know, I know what film is gonna win Oscar this year.", "my friend and I went to watch this movie and never made it there so we didnt like it at all, love camera work, have you noticed the director's cameo, post-credit scene was just amazing omg."],
    emojis: ['angry', 'smile', 'sleeping', 'puke'],
  },
};

const createMockComments = (count: number): Comment[] => {
  const mockComments: Comment[] = [];

  for (let i = 0; i <= count; i += 1) {
    const randomIndex = Math.floor(Math.random() * 4) + 1;
    const randomEmoji = Math.floor(Math.random() * 4);
    const mockComment: Comment = {
      id: i,
      author: mockData.comments.authors[randomIndex],
      date: mockData.comments.dates[randomIndex],
      text: mockData.comments.texts[randomIndex],
      emoji: mockData.comments.emojis[randomEmoji],
    };

    mockComments.push(mockComment);
  }

  return mockComments;
};

const createFilmData = (count: number): Promise<FilmInfo[]> => new Promise((resolve) => {
  const mockFilms: FilmInfo[] = [];

  for (let i = 0; i < count; i += 1) {
    const randomIndex = Math.floor(Math.random() * 4) + 1;
    const mockFilm: FilmInfo = {
      id: i,
      title: mockData.titles[randomIndex],
      alternativeTitle: mockData.titles[randomIndex],
      rating: (Math.random() * 10).toFixed(1),
      ageRating: Math.floor(Math.random() * 18),
      directors: ['Anthony Mann'],
      actors: ['Mary Beth Hughes', 'Dan Duryea'],
      writers: ['Anne Wigton', 'Erich von Stroheim'],
      description: 'Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), Frankie Machine (Frank Sinatra) is released from the federal Narcotic Farm in Lexington. The Martians Momar ("Mom Martian") and Kimar ("King Martian") are worried that their children Girmar. Are worried that their children Girmar.',
      img: mockData.imgs[randomIndex],
      genre: [mockData.genres[randomIndex]],
      comments: createMockComments(randomIndex * 5),
      releaseDate: mockData.releaseDates[randomIndex],
      country: mockData.countries[randomIndex],
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
