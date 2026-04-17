import bcrypt from 'bcryptjs';

async function testBcrypt() {
  try {
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    console.log('Salt generated:', salt);
    const hash = await bcrypt.hash(password, salt);
    console.log('Hash generated:', hash);
    const isMatch = await bcrypt.compare(password, hash);
    console.log('Match:', isMatch);
  } catch (error) {
    console.error('Bcrypt error:', error);
  }
}

testBcrypt();
