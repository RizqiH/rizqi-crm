<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $roles)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $allowedRoles = explode(',', $roles);

        // Role hierarchy: admin > manager > sales > support
        $userRole = $user->role;
        $roleHierarchy = [
            'admin' => ['admin', 'manager', 'sales', 'support'],
            'manager' => ['manager', 'sales', 'support'],
            'sales' => ['sales', 'support'],
            'support' => ['support']
        ];

        // Check if user's role allows access to any of the required roles
        $userCanAccess = false;
        foreach ($allowedRoles as $requiredRole) {
            $requiredRole = trim($requiredRole);
            if (isset($roleHierarchy[$userRole]) && in_array($requiredRole, $roleHierarchy[$userRole])) {
                $userCanAccess = true;
                break;
            }
        }

        if (!$userCanAccess) {
            abort(403, 'Unauthorized. Required role: ' . $roles);
        }

        return $next($request);
    }
}
