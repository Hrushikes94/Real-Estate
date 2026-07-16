<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

try {
    $pdo = getDbConnection();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        // Parse incoming JSON body
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['name']) || !isset($input['email']) || !isset($input['message'])) {
            http_response_code(400);
            echo json_encode(["message" => "Name, email, and message are required"]);
            exit();
        }

        $name = trim($input['name']);
        $email = trim($input['email']);
        $message = trim($input['message']);
        $propertyId = isset($input['propertyId']) ? intval($input['propertyId']) : null;

        if (empty($name) || empty($email) || empty($message)) {
            http_response_code(400);
            echo json_encode(["message" => "Name, email, and message fields cannot be empty"]);
            exit();
        }

        $stmt = $pdo->prepare("INSERT INTO inquiries (name, email, message, propertyId) VALUES (?, ?, ?, ?)");
        $stmt->execute([$name, $email, $message, $propertyId]);
        
        $newId = $pdo->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "id" => intval($newId),
            "name" => $name,
            "email" => $email,
            "message" => $message,
            "propertyId" => $propertyId,
            "createdAt" => date('c')
        ]);
        exit();
    } else if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT i.*, p.title as propertyTitle 
                                FROM inquiries i 
                                LEFT JOIN properties p ON i.propertyId = p.id 
                                ORDER BY i.id DESC");
        $stmt->execute();
        $inquiries = $stmt->fetchAll();

        $response = [];
        foreach ($inquiries as $inq) {
            $response[] = [
                "id" => intval($inq['id']),
                "name" => $inq['name'],
                "email" => $inq['email'],
                "message" => $inq['message'],
                "propertyId" => $inq['propertyId'] ? intval($inq['propertyId']) : null,
                "propertyTitle" => $inq['propertyTitle'] ?: "General Inquiry",
                "createdAt" => $inq['createdAt']
            ];
        }
        echo json_encode($response);
        exit();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error: " . $e->getMessage()]);
}
