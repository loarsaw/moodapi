import {
  SESClient,
  SESClientConfig,
  SendEmailCommand,
} from "@aws-sdk/client-ses";
import "dotenv/config";

const config: SESClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_SES_MAIL_ID ?? "",
    secretAccessKey: process.env.AWS_SES_MAIL_SECRET ?? "",
  },
  region: process.env.AWS_REGION ?? "",
};

const client = new SESClient(config);
const senderAddress = "no-reply@quickcourse.xyz";

const email_template = (email: string, otp_token: string) => {
  const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      /* General reset styles */
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
      }
      table {
        border-spacing: 0;
        width: 100%;
      }
      img {
        border: 0;
      }
      td {
        padding: 0;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #007bff;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .body {
        padding: 20px;
      }
      .otp-code {
        font-size: 32px;
        font-weight: bold;
        color: #007bff;
        margin: 20px 0;
        text-align: center;
      }
      .footer {
        background-color: #f8f9fa;
        color: #6c757d;
        text-align: center;
        padding: 10px 20px;
        font-size: 14px;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <!-- Outer wrapper table -->
    <table role="presentation" cellspacing="0" cellpadding="0">
      <tr>
        <td>
          <!-- Email container -->
          <table class="email-container">
            <!-- Header -->
            <tr>
              <td class="header">
                <h1>Your OTP Code</h1>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td class="body">
                <p>Hi there,</p>
                <p>
                  You requested an OTP for verification. Please use the code
                  below:
                </p>
                <div class="otp-code">${otp_token}</div>
                <p>
                  If you did not request this code, please ignore this email or
                  contact support if you have concerns.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td class="footer">
                <p>
                  Need help? <a href="https://example.com/support">Contact us</a>
                </p>
                <p>&copy; 2024 Your Company Name. All rights reserved.</p>
              </td>
            </tr>
          </table>
          <!-- End of email container -->
        </td>
      </tr>
    </table>
  </body>
</html>
`
  const input = {
    Source: senderAddress,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: "EMAIL OTP",
        Charset: "UTF-8",
      },
      Body: {
        Html: {
          Data: template,
          Charset: "UTF-8",
        },
      },
    },
  };
  return input;
};

export const sendOtpMail = async (email: string, token: string) => {
  const otp_token = token;
  const mail_obj = email_template(email, otp_token);
  try {
    const command = new SendEmailCommand(mail_obj);
    return await client.send(command);
    // return true;
  } catch (error) {
    console.log(error);
  }
};
