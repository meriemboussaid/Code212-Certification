<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    protected $fillable = [
        'title',
        'description',
        'duration',
        'photo',
    ];

    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
