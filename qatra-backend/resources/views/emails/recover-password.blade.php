<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f8fafc;
            padding: 30px;
            color: #333;
        }
        .email-wrapper {
            background: white;
            max-width: 600px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            padding: 30px;
        }
        .btn {
            display: inline-block;
            background: #4f46e5;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }
        .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <h2>Hello {{ $user->name ?? 'User' }},</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>

        <a href="{{ $actionUrl }}" class="btn">Reset Password</a>

        <p style="margin-top: 20px;">If you didn’t request this, just ignore this email.</p>

        <p class="footer">
            This link will expire in {{ config('auth.passwords.'.config('auth.defaults.passwords').'.expire') }} minutes.<br>
            Thanks, <br>{{ config('app.name') }}
        </p>
    </div>
</body>
</html>
