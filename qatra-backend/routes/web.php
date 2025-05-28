<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpVerificationEmail;


Route::prefix('api')->group(function () {

    Route::post('/resend-otp', function (Request $request) {
            $validatedData =   $request->validate([
            'email' => 'required|email',

        ]);

         // Generate a random activation code
$OtpCode = rand(100000, 999999);



// Set OTP expiration time to 10 minutes from now
$otpExpiresAt = Carbon::now()->addMinutes(10);

$UpdatedUser = User::where('email',$validatedData['email'])->update([

    'otp_code' => $OtpCode,
    'otp_expires_at' => $otpExpiresAt, // OTP expiration time

]);


if($UpdatedUser){
    $GetUser = User::where('email',$validatedData['email'])->first();
     var_dump($GetUser->email);
// Send OTP to user's email
Mail::to($GetUser->email)->send(new OtpVerificationEmail($OtpCode));
// Return response to inform the user to check their email for OTP

    return response()->json([
        'message' => 'User created temporarily. Please check your email for the OTP.'
    ], 200);
} else {
    return response()->json([
        'message' => 'Error: Could not create temporary user.'
    ], 400);
}


    });
    // Public route for OTP verification
    Route::post('/verify-otp', function (Request $request) {
        $request->validate([
            'email' => 'required|email',
            'otp_code' => 'required|string|size:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->otp_code !== $request->otp_code) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        if ($user->otp_expires_at < now()) {
            return response()->json(['message' => 'OTP has expired'], 400);
        }

        $user->verified_at = now();
        $user->otp_code = null;
        $user->otp_expires_at = null;

        // $accessToken = $user->createToken('myapptoken');
        // $accessToken->accessToken->expires_at = now()->addHour();
        // $accessToken->accessToken->save();

        // $token = $accessToken->plainTextToken;

        $user->save();

           if ($user->verified_at === null) {
        return response([
            'message' => 'Your account is not verified. Contact support!'
        ], 401);
    }

    Auth::login($user);
    $request->session()->regenerate();

        return response()->json([
            // 'token' => $token,
            'message' => 'Email verified successfully'
        ]);
    });

    // Authenticated routes (require Sanctum session)
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/userlogout', [AuthController::class, 'logout']);

        Route::get('/check-auth-user', function (Request $request) {
            return Auth::user();
        });
    });

    // Public test route
    Route::get('/test', function () {
        return 'hello world!';
    });

Route::post('/userlogin', [AuthController::class, 'login']);
Route::post('/userregister', [AuthController::class, 'register']);
Route::post('/forgot-password', [AuthController::class, 'ForgotPassword']);
Route::post('/recover-password', [AuthController::class, 'ResetPassword']);

});
