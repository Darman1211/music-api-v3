const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  UserId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };
