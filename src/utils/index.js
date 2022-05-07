const mapDBToModel = ({
  id, name, title, year, performer, genre, duration, albumId, coverurl
}) => ({
  id,
  name,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
  coverUrl: coverurl
});

module.exports = { mapDBToModel };
