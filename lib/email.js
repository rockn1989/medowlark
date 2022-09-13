const nodemailer = require('nodemailer');

async function sendEmail(email) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'purplefox753@gmail.com',
      pass: 'hwwsnvwmqmnafndq',
    },
  });

  await transporter.sendMail({
    from: '"Node js" <nodejs@example.com>',
    to: email,
    subject: 'Message from Node js',
    text: 'This message was sent from Node js server.',
    html:
      'This <i>message</i> was sent from <strong>Node js</strong> server.',
  });

}

module.exports = sendEmail;
