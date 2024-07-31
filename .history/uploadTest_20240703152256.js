const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Aktualizace AWS konfigurace s novými přístupovými klíči
AWS.config.update({
  accessKeyId: 'NOVY_ACCESS_KEY_ID',
  secretAccessKey: 'NOVY_SECRET_ACCESS_KEY',
  region: 'us-east-1'
});

const s3 = new AWS.S3();

// Funkce pro nahrání souboru do S3
const uploadFile = (fileName) => {
  const fileContent = fs.readFileSync(fileName);
  const params = {
    Bucket: 'usersnandezu', // Název vašeho bucketu
    Key: path.basename(fileName), // Název souboru, jak bude uložen v S3
    Body: fileContent,
    ACL: 'public-read', // Nastavení přístupu
    ContentType: 'image/jpeg' // Typ souboru
  };

  // Nahrání souboru do S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.log('Error uploading to S3:', err);
      return;
    }
    console.log('S3 upload successful. Data:', data);
  });
};

// Cesta k testovacímu souboru, který chcete nahrát
const filePath = 'path-to-your-local-file.jpg';

// Volání funkce pro nahrání souboru
uploadFile(filePath);
