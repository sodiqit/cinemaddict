const formatTime = (time: number): string => {
  const hours = Math.floor(time / 60);
  if (hours >= 1) {
    return `${hours}h ${time - hours * 60}m`;
  }
  return `${time}m`;
};

const formatGenres = (genres: string[]): string => {
  const genreCopy = genres.slice();
  const firstGenre = genreCopy[0];
  const newFirstGenre = `${firstGenre[0].toUpperCase()}${firstGenre.slice(1)}`;

  genreCopy.shift();
  genreCopy.unshift(newFirstGenre);

  return genreCopy.join(', ');
};

const formatDesc = (description: string): string => {
  if (description.length >= 138) {
    return `${description.slice(0, 138)}...`;
  }
  return description;
};

const formatDate = (date: string): string => date;

export {
  formatDesc,
  formatTime,
  formatGenres,
  formatDate,
};
