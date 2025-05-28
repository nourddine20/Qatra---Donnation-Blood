<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f6f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .header {
            background-color: #3498db;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .header h1 {
            font-size: 24px;
            margin: 0;
        }
        .body {
            padding: 20px;
        }
        .body h2 {
            font-size: 22px;
            color: #333333;
            margin-bottom: 15px;
        }
        .otp {
            font-size: 36px;
            font-weight: bold;
            color: #e74c3c;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            margin-top: 20px;
        }
        .footer a {
            color: #3498db;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>OTP Verification</h1>
        </div>
        <div class="body">
            <h2>Hello,</h2>
            <p>Thank you for registering. To complete your registration and verify your email address, please use the following OTP code:</p>
            <div class="otp">
                {{ $otpCode }}
            </div>
            <p>This OTP code will expire in 10 minutes. Please enter it promptly to proceed with the verification process.</p>
            <p>If you did not request this code, you can ignore this message.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>Your Company Team</p>
            <p>If you have any questions, feel free to <a href="mailto:support@yourcompany.com">contact us</a>.</p>
        </div>
    </div>
</body>
</html>
