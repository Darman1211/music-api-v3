/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  // Ingat! fungsi query() berjalan secara asynchronous,
  // dengan begitu kita perlu menambahkan async pada addNote dan await pada pemanggilan query()
  async addNote({
    title, body, tags, owner,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // buat objek query untuk memasukan notes baru ke database
    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    // mengeksekusi query yang sudah dibuat
    const result = await this._pool.query(query);

    // evaluasi nilai dari results.rows[0].id (karena kita melakukan returning id pada query)
    /** Jika nilai id tidak undefined, itu berarti catatan berhasil dimasukan dan kembalikan
         * fungsi dengan nilai id. Jika tidak maka throw InvariantError. */
    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getNotes(owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async getNoteById(id) {
    // mendapatkan note di dalam database berdasarkan id yang diberikan
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    // periksa nilai result.rows, bila nilainya 0 (false) maka bangkitkan NotFoundError.
    // Bila tidak, maka kembalikan dengan result.rows[0] yang sudah di-mapping dengan fungsi mapDBToModel
    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    // query untuk mengubah note di dalam database berdasarkan id yang diberikan
    const query = {
      text: 'UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this._pool.query(query);

    // periksa nilai result.rows bila nilainya 0 (false) maka bangkitkan NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbaharui catatan. Id tidak ditemukan');
    }
  }

  async deleteNoteById(id) {
    // query untuk menghapus note di dalam database berdasarkan id yang diberikan
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    // periksa nilai result.rows bila nilainya 0 (false) maka bangkitkan NotFoundError
    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = NotesService;
