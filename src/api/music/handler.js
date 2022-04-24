const ClientError = require('../../exceptions/ClientError');

class MusicsHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
  
      this.postAlbumHandler = this.postAlbumHandler.bind(this);
      this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
      this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
      this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
      this.postSongHandler = this.postSongHandler.bind(this);
      this.getSongsHandler = this.getSongsHandler.bind(this);
      this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
      this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
      this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }
    
    // Menambahkan Album
    async postAlbumHandler(request, h) {
      try {
        this._validator.validateAlbumPayload(request.payload);
        const { name, year  } = request.payload;
  
        const albumId = await this._service.addAlbum({ name, year });
  
        const response = h.response({
          status: 'success',
          message: 'Album berhasil ditambahkan',
          data: {
            albumId,
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
        const response = h. response({
          status: 'error',
          message: 'Mohon maaf! Server error.',
        });
        response.code(5000);
        console.error(error);
        return response;
      }
    }

    // Mendapatkan Album Berdasarkan ID
    async getAlbumByIdHandler(request, h) {
      try {
        const { id } = request.params;
        const album = await this._service.getAlbumById(id);
        return {
          status: 'success',
          data: {
            album,
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
        const response = h. response({
          status: 'error',
          message: 'Mohon maaf! Server error.',
        });
        response.code(5000);
        console.error(error);
        return response;
      }
    }

    // Mengubah album berdasarkan ID
    async putAlbumByIdHandler(request, h) {
      try {
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params;
        const { name, year } = request.payload;
  
        await this._service.ubahAlbumById(id, { name, year });
  
        return {
          status: 'success',
          message: 'Album berhasil diedit! :)',
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
        const response = h. response({
          status: 'error',
          message: 'Mohon maaf! Server error.',
        });
        response.code(5000);
        console.error(error);
        return response;
      }
    }

    // Menghapus album berdasarkan ID
    async deleteAlbumByIdHandler(request, h) {
      try {
        const { id } = request.params;
        await this._service.deleteAlbumById(id);
        return {
          status: 'success',
          message: 'Album telah berhasil dihapus! :)',
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
        const response = h. response({
          status: 'error',
          message: 'Mohon maaf! Server error.',
        });
        response.code(5000);
        console.error(error);
        return response;
      }
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
        const response = h. response({
          status: 'error',
          message: 'Mohon maaf! Server error.',
        });
        response.code(5000);
        console.error(error);
        return response;
      }
    }

    // Mendapatkan Seluruh Lagu
    async getSongsHandler() {
      const songs = await this._service.getSongs();
      return {
        status: 'success',
        data: {
          songs: songs.map((song) => ({
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
        const response = h. response({
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
        const response = h. response({
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
        const response = h. response({
          status: 'error',
          message: 'Mohon maaf! Server error.',
        });
        response.code(5000);
        console.error(error);
        return response;
      }
    }
  }
  
  module.exports = MusicsHandler;