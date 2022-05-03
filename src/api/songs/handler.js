/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  // Menambahkan Lagu
  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      } = request.payload;

      const songId = await this._service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      const response = h.response({
        status: 'success',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR
      const response = h.response({
        status: 'error',
        message: 'Mohon maaf! Server error.',
      });
      response.code(5000);
      console.error(error);
      return response;
    }
  }

  // Mendapatkan Seluruh Lagu
  async getSongsHandler(request) {
    const songs = await this._service.getSongs();

    const { title, performer } = request.query;
    let filterSong = songs;

    if (title !== undefined) {
      filterSong = filterSong.filter((song) => song.title.toLowerCase()
        .includes(title.toLowerCase()));
    }

    if (performer !== undefined) {
      filterSong = filterSong.filter((song) => song.performer.toLowerCase()
        .includes(performer.toLowerCase()));
    }

    return {
      status: 'success',
      data: {
        songs: filterSong.map((song) => ({
          id: song.id,
          title: song.title,
          performer: song.performer,
        })),
      },
    };
  }

  // Mendapatkan Lagu Berdasarkan ID
  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR
      const response = h.response({
        status: 'error',
        message: 'Mohon maaf! Server error.',
      });
      response.code(5000);
      console.error(error);
      return response;
    }
  }

  // Mengubah lagu berdasarkan id
  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      } = request.payload;
      const { id } = request.params;

      await this._service.ubahSongById(id, {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      return {
        status: 'success',
        message: 'Lagu berhasil di edit! :)',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR
      const response = h.response({
        status: 'error',
        message: 'Mohon maaf! Server error.',
      });
      response.code(5000);
      console.error(error);
      return response;
    }
  }

  // Menghapus lagu berdasarkan ID
  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus! :)',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR
      const response = h.response({
        status: 'error',
        message: 'Mohon maaf! Server error.',
      });
      response.code(5000);
      console.error(error);
      return response;
    }
  }
}

module.exports = SongsHandler;
