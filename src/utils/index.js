/* eslint-disable camelcase */
//  fungsi bernama mapDBToModel dan menerima parameter note objek dari database.
const mapDBToModel = ({
  id,
  title,
  body,
  tags,
  created_at,
  updated_at,
  username,
}) => ({
  id,
  title,
  body,
  tags,
  createdAt: created_at,
  updatedAt: updated_at,
  username,
});

module.exports = { mapDBToModel };
