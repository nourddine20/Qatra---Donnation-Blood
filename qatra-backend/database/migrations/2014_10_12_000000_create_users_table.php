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
        Schema::create('users', function (Blueprint $table) {
        $table->id(); // bigint(20), primary key, auto increment

        $table->string('name', 255);
        $table->string('email', 255)->nullable()->index();
        $table->string('phone', 20)->nullable()->index();
        $table->string('password', 255);

        $table->unsignedBigInteger('profile_id')->index();

        $table->tinyInteger('is_verified')->default(0)->nullable();
        $table->string('otp_code', 6)->nullable();
        $table->dateTime('otp_expires_at')->nullable();
        $table->dateTime('verified_at')->nullable();

        $table->timestamps(); // created_at & updated_at with timestamps
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};