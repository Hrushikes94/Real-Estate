<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

try {
    $pdo = getDbConnection();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            // Get single agent details along with their active listings
            $id = intval($_GET['id']);
            $stmt = $pdo->prepare("SELECT * FROM agents WHERE id = ?");
            $stmt->execute([$id]);
            $agent = $stmt->fetch();

            if (!$agent) {
                http_response_code(404);
                echo json_encode(["message" => "Agent not found"]);
                exit();
            }

            $stmtProps = $pdo->prepare("SELECT * FROM properties WHERE agentId = ?");
            $stmtProps->execute([$id]);
            $properties = $stmtProps->fetchAll();

            $agentProps = [];
            foreach ($properties as $prop) {
                $agentProps[] = [
                    "id" => intval($prop['id']),
                    "title" => $prop['title'],
                    "description" => $prop['description'],
                    "price" => floatval($prop['price']),
                    "location" => $prop['location'],
                    "images" => $prop['images'] ? explode(',', $prop['images']) : [],
                    "beds" => intval($prop['beds']),
                    "baths" => intval($prop['baths']),
                    "sqft" => intval($prop['sqft']),
                    "type" => $prop['type'],
                    "status" => $prop['status'],
                    "agentId" => intval($prop['agentId'])
                ];
            }

            $response = [
                "id" => intval($agent['id']),
                "name" => $agent['name'],
                "bio" => $agent['bio'],
                "photo" => $agent['photo'],
                "email" => $agent['email'],
                "phone" => $agent['phone'],
                "properties" => $agentProps
            ];
            echo json_encode($response);
            exit();
        } else {
            // List all agents along with their respective property portfolios
            $stmt = $pdo->prepare("SELECT * FROM agents");
            $stmt->execute();
            $agents = $stmt->fetchAll();

            $response = [];
            foreach ($agents as $agent) {
                $stmtProps = $pdo->prepare("SELECT * FROM properties WHERE agentId = ?");
                $stmtProps->execute([$agent['id']]);
                $properties = $stmtProps->fetchAll();

                $agentProps = [];
                foreach ($properties as $prop) {
                    $agentProps[] = [
                        "id" => intval($prop['id']),
                        "title" => $prop['title'],
                        "description" => $prop['description'],
                        "price" => floatval($prop['price']),
                        "location" => $prop['location'],
                        "images" => $prop['images'] ? explode(',', $prop['images']) : [],
                        "beds" => intval($prop['beds']),
                        "baths" => intval($prop['baths']),
                        "sqft" => intval($prop['sqft']),
                        "type" => $prop['type'],
                        "status" => $prop['status'],
                        "agentId" => intval($prop['agentId'])
                    ];
                }

                $response[] = [
                    "id" => intval($agent['id']),
                    "name" => $agent['name'],
                    "bio" => $agent['bio'],
                    "photo" => $agent['photo'],
                    "email" => $agent['email'],
                    "phone" => $agent['phone'],
                    "properties" => $agentProps
                ];
            }
            echo json_encode($response);
            exit();
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error: " . $e->getMessage()]);
}
