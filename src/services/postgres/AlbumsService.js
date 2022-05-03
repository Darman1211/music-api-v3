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

  // Memasukkan Album ke database
  async addAlbum({ name, year }) {
    let id = 'album-';
    id += nanoid(16);

    // memasukan album baru ke database
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    // mengeksekusi query yang sudah dibuat
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Maaf, album gagal ditambahkan! :(');
    }

    return result.rows[0].id;
  }

  // Mengambil data dari db berdasarkan ID
  async getAlbumById(id) {
    // mendapatkan album di dalam database berdasarkan id yang diberikan
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Maaf, album tidak dapat ditemukan! :(');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  // Mengubah data di database berdasarkan id yang diberikan
  async ubahAlbumById(id, { name, year }) {
    // query untuk mengubah album di dalam database berdasarkan id yang diberikan
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Maaf, album gagal diedit. Id tidak dapat ditemukan :(');
    }
  }

  // Menghapus album pada db berdasarkan id yang diberikan
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

  // Mendapatkan daftar lagu di dalam album
  async getSongOnAlbumId(id) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = AlbumsService;
