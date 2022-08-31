const nodemailer = require('nodemailer');

(async () => {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'purplefox753@gmail.com',
      pass: 'hwwsnvwmqmnafndq',
    },
  });

  let result = await transporter.sendMail({
    from: '"Node js" <nodejs@example.com>',
    to: 'gold_100@bk.ru',
    subject: 'Message from Node js',
    text: 'This message was sent from Node js server.',
    html:
      'This <i>message</i> was sent from <strong>Node js</strong> server.',
  });
  console.log(result);
})();