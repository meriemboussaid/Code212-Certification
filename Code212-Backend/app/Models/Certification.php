<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Certification extends Model
{
    protected $fillable = [
        'titre',
        'description',
        'date_debut',
        'date_fin',
        'photo',
    ];
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
