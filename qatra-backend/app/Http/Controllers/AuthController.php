<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpVerificationEmail;
use App\Mail\RecoverPassword;
 // Assuming you create this Mailable

class AuthController extends Controller
{


    // public function showRegisterForm(){


    //     return view('vendor.registerForm');
    // }

      public function verifyToken(Request $request)
    {
        // Your token verification logic here
        // Example: Check if the user associated with the token exists
        if (auth()->check()) {
            return response()->json(['message' => 'Token is valid'], 200);
        } else {
            return response()->json(['message' => 'Token is invalid'], 401);
        }
    }


   public function register(Request $request)
{
    // Validate the input fields
    $validatedData = $request->validate([
        'user_name' => 'required|string|max:255',
        // 'users_city' => 'required|string|max:255',
        'user_role'   => 'required|exists:profiles,code',
        'user_email' => 'required|email|unique:users,email|max:255',
        'user_phone' => 'required|string|unique:users,phone|max:15',
        'password' => 'required|string|confirmed|min:8',
        // 'image_store' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Image validation
    ]);

    // Image upload logic if an image is provided
    $imgdb = "";
    $path = 'Media/assets/images/newusers/';
    if ($request->hasFile('image_store')) {
        $imgdb = app('App\Http\Controllers\Custom')->uploadimage($request->image_store, $path);
    }

    // If an image is uploaded, delete the old image if it exists
    if ($imgdb != '') {
        if (file_exists($request->old_image_store)) {
            unlink($request->old_image_store);
        }
    } else {
        $imgdb = $request->old_image_store;
    }

  // Generate a random activation code
$OtpCode = rand(100000, 999999);

      $profile = Profile::where('code', $validatedData['user_role'])->first();


// Set OTP expiration time to 10 minutes from now
$otpExpiresAt = Carbon::now()->addMinutes(10);

// Temporarily create the user without marking them as fully registered
$NewUser = User::create([
    'name' => $validatedData['user_name'],
    // 'logo' => $imgdb,
    // 'city' => $validatedData['user_city'],
    'profile_id'=>$profile['id'],
    'email' => $validatedData['user_email'],
    'phone' => $validatedData['user_phone'],
    'password' => bcrypt($validatedData['password']),
    'otp_code' => $OtpCode,
    'otp_expires_at' => $otpExpiresAt, // OTP expiration time
    'created_at' => now(),
    'updated_at' => now(),
]);

// Send OTP to user's email
Mail::to($NewUser->email)->send(new OtpVerificationEmail($OtpCode));
// Return response to inform the user to check their email for OTP
if ($NewUser) {
    return response()->json([
        'message' => 'User created temporarily. Please check your email for the OTP.'
    ], 200);
} else {
    return response()->json([
        'message' => 'Error: Could not create temporary user.'
    ], 400);
}
}




public function login(Request $request)
{
    $fields = $request->validate([
        'user_email' => 'required|string',
        'user_password' => 'required|string',
    ]);

    $email = Str::lower($fields['user_email']);
    $ip = $request->ip();
    $throttleKey = $email . '|' . $ip;
    $blockCountKey = $throttleKey . ':block_count';

    // Define block stages
    $stages = [
        0 => ['max_attempts' => 3, 'decay' => 60],     // 1 min
        1 => ['max_attempts' => 2, 'decay' => 300],    // 5 min
        2 => ['max_attempts' => 1, 'decay' => 3600],   // 1 hour
    ];

    // Get block stage
    $blockCount = (int) cache()->get($blockCountKey, 0);

    if ($blockCount >= 3) {
        // Final stage: 24h block
        $now = now();
        $tomorrow = now()->addDay()->startOfDay();
        $blockTime = $tomorrow->diffInSeconds($now);

        RateLimiter::hit($throttleKey, $blockTime);

        return response([
            'message' => "Too many attempts. Try again after 24 hours."
        ], 429);
    }

    $stage = $stages[$blockCount];
    $maxAttempts = $stage['max_attempts'];
    $decay = $stage['decay'];

    // Check if blocked at this stage
    if (RateLimiter::tooManyAttempts($throttleKey, $maxAttempts)) {
        $seconds = RateLimiter::availableIn($throttleKey);

        return response([
            'message' => "Too many login attempts. Try again in {$seconds} seconds."
        ], 429);
    }

    // Check user credentials
    $user = User::where('email', $email)->first();

    if (!$user || !Hash::check($fields['user_password'], $user->password)) {
        // Wrong credentials → register failed attempt
        RateLimiter::hit($throttleKey, $decay);

        $attempts = RateLimiter::attempts($throttleKey);

        if ($attempts >= $maxAttempts) {
            // Move to next stage
            $blockCount++;
            $nextStageDecay = $stages[$blockCount]['decay'] ?? 86400;
            cache()->put($blockCountKey, $blockCount, now()->addSeconds($nextStageDecay + 60));

            // Clear limiter for next stage
            RateLimiter::clear($throttleKey);
        }

        return response([
            'message' => 'The email or password is incorrect.'
        ], 401);
    }

    // ✅ Successful login → reset everything
    RateLimiter::clear($throttleKey);
    cache()->forget($blockCountKey);

    if ($user->verified_at === null) {
        return response([
            'message' => 'Your account is not verified. Contact support!'
        ], 401);
    }

    Auth::login($user);
    $request->session()->regenerate();

    return response([
        'message' => 'Logged in successfully.',
        'user' => $user,
    ]);
}


//     public function clientlogout() {
//   var_dump("hello logout ");



//         if (Auth::check()) {

//             $user = Auth::user();

//             if ($user) {
//                 $user->tokens()->delete();

//  // Update the user's customer_api_token column with the generated token
//     $user->update(['customers_api' => 0,'customers_api_key' => NULL]);


//                  $response = [
//                     'user'=>$user,
//                     'message' => 'Logged out Successfully'
//                  ];

//                  return response($response,200);
//             }
//         }


    // }


public function logout(Request $request)
{
    Auth::guard('web')->logout();  // explicitly logout web guard

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return response()->json(['message' => 'Logged out successfully']);
}


public function ForgotPassword(Request $request)
{
    $fields = $request->validate([
        'user_email' => 'required|email|exists:users,email|max:255',
    ]);

    $user = User::where('email', $fields['user_email'])->first();

    if (!$user) {
        return response()->json([
            'message' => 'User not found.',
        ], 404);
    }

    $token = Str::random(64);

    // Store a hashed version of the token
    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => $user->email],
        [

            'token' => Hash::make($token),
            'created_at' => now()
        ]
    );

    $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

    // Send the plain token in the URL so user can use it
    $actionUrl = $frontendUrl . '/recover-password?token=' . $token . ''.'&email='.$user->email;

    Mail::to($user->email)->send(new RecoverPassword($actionUrl));

    return response()->json([
        'message' => 'Password recovery link has been sent to your email.',
    ], 200);
}


public function ResetPassword(Request $request)
{

    $fields = $request->validate([
        'email'=> 'required|email|max:255',
        'token' => 'required|string',
        'password' => 'required|string|min:8|confirmed', // expects password_confirmation
    ]);

    $token = $fields['token'];

    // Find password reset records for this email
    $record = DB::table('password_reset_tokens')->where('email', $fields['email'])->first();

    if (!$record) {
        return response()->json(['message' => 'Invalid token or email not found'], 400);
    }

    // Check token expiration (10 minutes)
    $expiresAt = Carbon::parse($record->created_at)->addMinutes(10);
    if (Carbon::now()->gt($expiresAt)) {
        return response()->json(['message' => 'Token expired'], 400);
    }

    // Verify token matches hashed token in DB
    if (!Hash::check($token, $record->token)) {
        return response()->json(['message' => 'Invalid token'], 400);
    }

    // Find the user by email
    $user = User::where('email', $record->email)->first();
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Update user's password
    $user->password = Hash::make($fields['password']);
    $user->save();

    // Delete password reset record to invalidate the token
    DB::table('password_reset_tokens')->where('token', $record->token)->delete();

    return response()->json(['message' => 'Password successfully reset'], 200);
}


}
