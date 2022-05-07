/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class PlaylistsSongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistsSongsHandler = this.getPlaylistsSongsHandler.bind(this);
    this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistsSongsPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.verifySongById(songId);

      const playlistsong = await this._service.addSongToPlaylist({ playlistId, songId });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
        data: {
          playlistsong,
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

  async getPlaylistsSongsHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._service.getPlaylistById(playlistId);
      playlist.songs = await this._service.getPlaylistsSongs(playlistId);

      return {
        status: 'success',
        data: {
          playlist,
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

  async deletePlaylistSongByIdHandler(request, h) {
    try {
      this._validator.validatePlaylistsSongsPayload(request.payload);
      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.verifySongByIdPlaylist(songId);

      await this._service.deleteSongFromPlaylist(playlistId, songId);
      return {
        status: 'success',
        message: 'Lagu telah dihapus dari playlist',
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

module.exports = PlaylistsSongsHandler;
