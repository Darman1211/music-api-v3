const Joi = require('joi');

const PlaylistsSongsPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistsSongsPayloadSchema };
