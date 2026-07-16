<?php
// Local router script for PHP built-in server (php -S localhost:5000 router.php)

$uri = $_SERVER["REQUEST_URI"];
$path = parse_url($uri, PHP_URL_PATH);

// Serve static assets directly if they exist
if (file_exists(__DIR__ . $path) && !is_dir(__DIR__ . $path)) {
    return false;
}

// Route: /properties
if (preg_match('/^\/properties\/?$/', $path)) {
    include __DIR__ . '/properties.php';
    exit();
}

// Route: /properties/{id}
if (preg_match('/^\/properties\/([0-9]+)\/?$/', $path, $matches)) {
    $_GET['id'] = $matches[1];
    include __DIR__ . '/properties.php';
    exit();
}

// Route: /agents
if (preg_match('/^\/agents\/?$/', $path)) {
    include __DIR__ . '/agents.php';
    exit();
}

// Route: /agents/{id}
if (preg_match('/^\/agents\/([0-9]+)\/?$/', $path, $matches)) {
    $_GET['id'] = $matches[1];
    include __DIR__ . '/agents.php';
    exit();
}

// Route: /inquiries
if (preg_match('/^\/inquiries\/?$/', $path)) {
    include __DIR__ . '/inquiries.php';
    exit();
}

// Route: /auth/login
if (preg_match('/^\/auth\/login\/?$/', $path)) {
    include __DIR__ . '/auth.php';
    exit();
}

// Fallback 404
http_response_code(404);
echo json_encode(["message" => "Route not found"]);
