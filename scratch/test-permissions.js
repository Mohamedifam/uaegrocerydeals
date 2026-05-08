const fs = require('fs');
const path = require('path');

async function testUpload() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  console.log('Testing upload to:', uploadsDir);

  try {
    if (!fs.existsSync(uploadsDir)) {
      console.log('Creating directory...');
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const testFile = path.join(uploadsDir, 'test-write.txt');
    fs.writeFileSync(testFile, 'Test content');
    console.log('Successfully wrote test file');
    
    fs.unlinkSync(testFile);
    console.log('Successfully deleted test file');
    console.log('Permissions seem OK');
  } catch (err) {
    console.error('Permission test failed:', err);
  }
}

testUpload();
