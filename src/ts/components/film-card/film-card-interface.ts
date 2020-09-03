type FilmCardInfo = {
  id: string,
  title: string,
  rating: string,
  duration: number,
  releaseDate: string,
  genre: string[],
  img: string,
  description: string,
  inWatchList: boolean,
  itWatched: boolean,
  itFavorite: boolean,
  comments: number,
};

type NodeMap = {
  title: Element,
  year: Element,
  rating: Element,
  duration: Element,
  genre: Element,
  img: HTMLImageElement,
  comments: Element,
  inWatchList: Element,
  itWatched: Element,
  itFavorite: Element,
  description: Element,
  controlls: Element,
};

export { FilmCardInfo, NodeMap };
