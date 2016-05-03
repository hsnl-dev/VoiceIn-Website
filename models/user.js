const mongoose = require('mongoose');

module.exports = exports = mongoose.model('accounts', {
  _id: String,
  userName: String,
  phoneNumber: String,
  location: String,
  profile: String,
  company: String,
  profilePhotoId: String,
  qrCodeUuid: String,
  email: String,
  jobTitle: String,
  credit: Number,
});
