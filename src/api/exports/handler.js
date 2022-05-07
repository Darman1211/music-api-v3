/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, servicePlaylist, validator) {
    this._service = service;
    this._validator = validator;
    this._servicePlaylist = servicePlaylist;

    this.postExportPlaylistsHandler = this.postExportPlaylistsHandler.bind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    try {
      this._validator.validateExportPlaylistsPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      await this._servicePlaylist.verifyPlaylistAccess(playlistId, credentialId);
      await this._servicePlaylist.getPlaylistById(playlistId);

      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };

      await this._service.sendMessage('export:playlist', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
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
}

module.exports = ExportsHandler;
