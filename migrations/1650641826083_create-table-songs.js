/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        genre: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        performer: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        duration: {
            type: 'VARCHAR(25)',
        },
        albumId: {
            type: 'VARCHAR(50)',
        },
    });
};

exports.down = pgm => {};
