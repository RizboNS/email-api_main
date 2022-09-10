const nodemailer = require("nodemailer");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post("/send-email", async (req, res) => {
  let details = {
    from: "rizbo.ns.bk@zohomail.eu",
    to: "rizbo.ns.bk@gmail.com",
    subject:
      "Portfolio msg:email:<" +
      req.body.email +
      "> name:<" +
      req.body.name +
      ">",
    text: req.body.msg,
  };
  let resp = await wrappedSendMail(details);
  if (resp) {
    res.status(200).json({ status: "success" });
  } else {
    res.status(400).json({ status: "failed" });
  }
});

// wrapper for mailer
async function wrappedSendMail(details) {
  return new Promise((resolve, reject) => {
    let mailTransporter = nodemailer.createTransport({
      host: "smtp.zoho.eu",
      port: 465,
      secure: true, //ssl
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    mailTransporter.sendMail(details, (err) => {
      if (err) {
        console.log(err);
        resolve(false);
      } else {
        console.log("email sent!");
        resolve(true);
      }
    });
  });
}

// Start the server
const port = app.get("port") | 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
