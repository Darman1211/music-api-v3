/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsSongsService {
  constructor() {
    this._pool = new Pool();
  }

  // Fungsi menambahkan song ke playlist
  async addSongToPlaylist({
    playlistId, songId,
  }) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistssongs VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Maaf! Lagu gagal dimasukkan kedalam playlist');
    }
    return result.rows[0].id;
  }

  // fungsi melihat daftar lagu di dalam playlist
  async getPlaylistsSongs(playlistId) {
    const query = {
      text: `SELECT songs.id as id, songs.title, songs.performer
            FROM playlistssongs
            JOIN songs on playlisstsongs.songId=songs.id
            WHERE playlisstsongs.playlistId = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  // fungsi menghapus lagu dari playlist
  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistssongs WHERE playlistId = $1 AND songId = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Maaf! Lagu gagal dihapus dari playlist');
    }
  }

  // fungsi mengecek jika lagu ada
  async verifySongById(SongId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [SongId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Maaf! Lagu tidak ada');
    }
  }

  // fungsi validasi playlists dari id dan owner request
  async verifyPlaylistsOwner(PlaylistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [PlaylistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Maaf! Playlist tidak dapat ditemukan');
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError('Maaf! Anda tidak berhak mengakses resource ini');
    }
  }

  // fungsi mengecek jika lagu ada/tidak didalam playlist
  async verifySongByIdPlaylist(SongId) {
    const query = {
      text: 'SELECT * FROM playlistssongs WHERE songId = $1',
      values: [SongId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus');
    }
  }

  // fungsi untuk memverifikasi playlist berdasarkan collaboration
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistsOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsSongsService;
