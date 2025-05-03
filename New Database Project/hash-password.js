import bcrypt from 'bcrypt';
const pw = process.argv[2];             // e.g. `node hash-password.js alicepw`
bcrypt.hash(pw, 12).then(hash => {
  console.log(`'${hash}'`);
});