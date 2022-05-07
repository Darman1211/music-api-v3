/* eslint-disable arrow-parens */
exports.up = pgm => {
  pgm.addColumn('albums', {
    coverurl: {
      type: 'VARCHAR(255)',
    },
  });
};

exports.down = pgm => {
  pgm.dropColumn('albums', 'cover');
};
