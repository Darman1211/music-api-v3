const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class MusicsService {
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
    async ubahAlbumById(id, {name, year}) {
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

    // Memasukkan lagu ke database
    async addSong({ title, year, genre, performer, duration, albumId }) {
        
      let id = 'song-';
        id += nanoid(16);
        
        // memasukan lagu baru ke database
        const query = {
          text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
          values: [id, title, year, genre, performer, duration, albumId],
        };

        const result = await this._pool.query(query);
    
        if (!result.rows[0].id) {
            throw new InvariantError('Maaf, lagu gagal ditambahkan! :(');
        }
    
        return result.rows[0].id;
    }

    // memanggil seluruh data lagu dari database
    async getSongs() {
        const result = await this._pool.query('SELECT * FROM songs');
        return result.rows.map(mapDBToModel);
    }

    // memanggil data lagu berdasarkan id pada db
    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Maaf, lagu tidak dapat ditemukan :(');
        }

        return result.rows.map(mapDBToModel)[0];
    }

    // mengubah data lagu berdasarkan id pada db 
    async ubahSongById(id, {title, year, genre, performer, duration, albumId}) {
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, albumId = $6 WHERE id = $7 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, id],
        };
    
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Maaf, lagu gagal di edit. Id tidak dapat ditemukan! :(');
        }
    }

    // menghapus data lagu berdasarkan id pada db 
    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Maaf, lagu gagal dihapus. Id tidak dapat ditemukan! :(');
        }
    }
}

module.exports = MusicsService;