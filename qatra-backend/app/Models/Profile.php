<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $table = 'profiles';
 protected $primaryKey = 'id';
    protected $fillable = [
        'id',
        'code',
        'label',
        'description',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'profile_id');
    }
}