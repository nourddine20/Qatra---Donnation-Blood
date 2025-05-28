<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
       Schema::create('profiles', function (Blueprint $table) {
        $table->id(); // bigint(20), primary key, auto increment

        $table->string('code', 50)->index(); // Indexed code
        $table->string('label', 100);
        $table->text('description')->nullable(); // Assuming nullable, since it's not marked "No"

        $table->timestamps(); // created_at & updated_at
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};