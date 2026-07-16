<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

// Helper to base64url encode data for JWT
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

try {
    $pdo = getDbConnection();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['username']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(["message" => "Username and password are required"]);
            exit();
        }

        $username = trim($input['username']);
        $password = trim($input['password']);

        // Fetch user by username
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        // Verify password hash
        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(["message" => "Invalid credentials"]);
            exit();
        }

        // Generate manual lightweight JWT token
        $secret = getenv('JWT_SECRET') ?: 'super-secret-key-change-in-production';
        $header = ["alg" => "HS256", "typ" => "JWT"];
        $payload = [
            "id" => intval($user['id']),
            "username" => $user['username'],
            "role" => $user['role'],
            "exp" => time() + 86400 // Token valid for 24 hours
        ];

        $header_encoded = base64url_encode(json_encode($header));
        $payload_encoded = base64url_encode(json_encode($payload));
        $signature = hash_hmac('SHA256', "$header_encoded.$payload_encoded", $secret, true);
        $signature_encoded = base64url_encode($signature);
        
        $token = "$header_encoded.$payload_encoded.$signature_encoded";

        echo json_encode([
            "access_token" => $token,
            "user" => [
                "id" => intval($user['id']),
                "username" => $user['username'],
                "role" => $user['role']
            ]
        ]);
        exit();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error: " . $e->getMessage()]);
}
