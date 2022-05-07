/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Maaf, album gagal ditambahkan! :(');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = [
      {
        text: 'SELECT * FROM albums WHERE id = $1',
        values: [id],
      },
      {
        text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
        values: [id],
      },
    ];
    const resultAlbum = await this._pool.query(query[0]);
    const resultSongs = await this._pool.query(query[1]);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Maaf! Album tidak ditemukan');
    }

    const result = resultAlbum.rows.map(mapDBToModel)[0];
    result.songs = resultSongs.rows;
    return result;
  }

  async ubahAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Maaf, album gagal diedit. Id tidak dapat ditemukan :(');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Maaf, Album gagal dihapus. Id tidak dapat ditemukan! :(');
    }
  }

  async addCoverAlbum(id, cover) {
    const query = {
      text: 'UPDATE albums SET coverurl = $1 WHERE id = $2 RETURNING id',
      values: [cover, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal mengubah cover album');
    }
  }
}

module.exports = AlbumsService;
