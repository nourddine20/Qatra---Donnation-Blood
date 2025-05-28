<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users'; // Make sure the table name matches your migration table name

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id'; // Primary key column

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'profile_id',
        'is_verified',
        'otp_code',
        'otp_expires_at',
        'verified_at',
        // 'remember_token',
        // 'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        // 'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // 'email_verified_at' => 'datetime',
        'password' => 'hashed', // Auto hash passwords for security
        'otp_expires_at' => 'datetime',
        'verified_at' => 'datetime',
        'is_verified' => 'boolean', // Ensure is_verified is treated as a boolean
    ];

    /**
     * Get the profile that owns the user.
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }
}