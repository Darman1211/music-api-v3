/* eslint-disable arrow-parens */
exports.up = pgm => {
  pgm.createTable('playlistssongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    songid: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('playlistssongs');
};
