import { FilmCard } from './ts/components/film-card';

const filmCard = new FilmCard({
  title: 'Brain',
  year: 1805,
  duration: 81,
  rating: 9,
  genre: ['horror', 'documental'],
  img: 'https://sun3-12.userapi.com/2GBCbm2CWgR2VlRaQbXV81C7jH3X4QHTizr2KA/BRJPEEiEND8.jpg',
  commentsCount: 15,
  description: 'Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll).',
});

console.log(filmCard.element);
