<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RecoverPassword extends Mailable
{
    use Queueable, SerializesModels;

    public $actionUrl;

    /**
     * Create a new message instance.
     *
     * @param int $actionUrl
     */
    public function __construct($actionUrl)
    {
        $this->actionUrl = $actionUrl; // Store OTP in public property
    }

    /**
     * Build the message.
     *
     * @return \Illuminate\Mail\Mailable
     */
   public function build()
{
    return $this->subject('Reset Your Password')
                ->view('emails.recover-password')
                ->with(['actionUrl' => $this->actionUrl]);
}
}
