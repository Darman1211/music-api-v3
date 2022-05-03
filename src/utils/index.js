const mapDBToModel = ({
  id, name, title, year, performer, genre, duration, albumId,
}) => ({
  id,
  name,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});

module.exports = { mapDBToModel };
