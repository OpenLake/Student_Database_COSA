function isIITBhilaiEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@iitbhilai\.ac\.in$/i.test(email);
}

module.exports = isIITBhilaiEmail;
