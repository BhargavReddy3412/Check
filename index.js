const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'info@expodite.in',
//     pass: 'uvka smmq jogm ozwe', // replace with app password
//   },
// });

 app.get('/', (req, res) => {
  const ipAddress =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'IP not available';

  res.send(ipAddress);
});


app.get('/d', async (req, res) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'IP not available';

  try {
    // Lookup location using ip-api.com
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const { city, country, regionName, query } = response.data;

    res.json({
      ip: query,
      city,
      region: regionName,
      country
    });

  } catch (err) {
    console.error('Location lookup failed:', err.message);
    res.json({
      ip,
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown'
    });
  }
});

app.post('/send-email', (req, res) => {
  const { firstName, phone, email, company, additionalInfo } = req.body;

  const ipAddress =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'IP not available';



  console.log( firstName, phone, email, company, additionalInfo,ipAddress)
  res.Send( firstName, phone, email, company, additionalInfo,ipAddress);
  const mailOptions = {
    from: email,
    to: 'info@expodite.in',
    subject: 'New Contact Form Submission',
    text:
      `First Name: ${firstName}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Company Name: ${company}\n` +
      `Additional Information: ${additionalInfo || 'N/A'}\n` +
      `IP Address: ${ipAddress}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('success');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
