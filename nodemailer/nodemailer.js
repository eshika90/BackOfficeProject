const nodemailer = require('nodemailer');
const { mailer } = require('../config');
const codeObject = {};
const isEmailVerified = {}

class MailSender {
  sendKaKaoemail = async (email) => {
    isEmailVerified[email]=false;
    const transporter = nodemailer.createTransport({
      service: 'kakao',
      port: 465,
      host: 'smtp.kakao.com',
      secure: true,
      requireTLS: true,
      auth: {
        user: mailer.user,
        pass: mailer.password,
      },
    });
    const verifyNum = Math.ceil(Math.random() * 1000000);
    codeObject[email] = verifyNum;

    transporter.sendMail({
      from: mailer.user,
      to: email,
      subject: '일조벌조 가입 인증 메일',
      text: `
            안녕하세요!
            일조벌조 펫 시터 매칭 서비스입니다.
            회원 가입을 위한 인증 메일을 보내드립니다.
            인증번호 : ${verifyNum}
            꼭 인증번호를 입력하신 후 회원가입을 마쳐주세요.
            감사합니다.`,
    });
  };
  sendGmail = async (email) => {
    isEmailVerified[email]=false;
    const transporter = nodemailer.createTransport({
      service: 'gamil',
      port: 587,
      host: 'smtp.gamil.com',
      secure: false,
      requireTLS: true,
      auth: {
        user: mailer.user,
        pass: mailer.pass,
      },
    });
    const verifyNum = Math.ceil(Math.random() * 1000000);

    transporter.sendMail({
      from: mailer.user,
      to: email,
      subject: '일조벌조 가입 인증 메일',
      text: `
            안녕하세요!
            일조벌조 펫 시터 매칭 서비스입니다.
            회원 가입을 위한 인증 메일을 보내드립니다.
            인증번호 : ${verifyNum}
            꼭 인증번호를 입력하신 후 회원가입을 마쳐주세요.
            감사합니다.`,
    });
  };
}

module.exports = { MailSender, codeObject,isEmailVerified };
