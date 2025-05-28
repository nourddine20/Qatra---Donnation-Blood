<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpVerificationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $otpCode;

    /**
     * Create a new message instance.
     *
     * @param int $otpCode
     */
    public function __construct($otpCode)
    {
        $this->otpCode = $otpCode; // Store OTP in public property
    }

    /**
     * Build the message.
     *
     * @return \Illuminate\Mail\Mailable
     */
    public function build()
    {
        return $this->subject('Your OTP Verification Code') // Set the email subject
                    ->view('emails.otp-verification'); // View for OTP email content
    }
}
