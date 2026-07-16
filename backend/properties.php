<?php
require_once __DIR__ . '/db.php';
setCorsHeaders();

try {
    $pdo = getDbConnection();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            // Get single property details along with its agent relations
            $id = intval($_GET['id']);
            $stmt = $pdo->prepare("SELECT p.*, a.name as agentName, a.bio as agentBio, a.photo as agentPhoto, a.email as agentEmail, a.phone as agentPhone 
                                    FROM properties p 
                                    LEFT JOIN agents a ON p.agentId = a.id 
                                    WHERE p.id = ?");
            $stmt->execute([$id]);
            $property = $stmt->fetch();

            if (!$property) {
                http_response_code(404);
                echo json_encode(["message" => "Property not found"]);
                exit();
            }

            $response = [
                "id" => intval($property['id']),
                "title" => $property['title'],
                "description" => $property['description'],
                "price" => floatval($property['price']),
                "location" => $property['location'],
                "images" => $property['images'] ? explode(',', $property['images']) : [],
                "beds" => intval($property['beds']),
                "baths" => intval($property['baths']),
                "sqft" => intval($property['sqft']),
                "type" => $property['type'],
                "status" => $property['status'],
                "agentId" => $property['agentId'] ? intval($property['agentId']) : null,
                "agent" => $property['agentId'] ? [
                    "id" => intval($property['agentId']),
                    "name" => $property['agentName'],
                    "bio" => $property['agentBio'],
                    "photo" => $property['agentPhoto'],
                    "email" => $property['agentEmail'],
                    "phone" => $property['agentPhone']
                ] : null
            ];
            echo json_encode($response);
            exit();
        } else {
            // List properties with filters matching the previous query filters
            $sql = "SELECT p.*, a.name as agentName, a.bio as agentBio, a.photo as agentPhoto, a.email as agentEmail, a.phone as agentPhone 
                    FROM properties p 
                    LEFT JOIN agents a ON p.agentId = a.id 
                    WHERE 1=1";
            $params = [];

            if (isset($_GET['minPrice']) && $_GET['minPrice'] !== '') {
                $sql .= " AND p.price >= ?";
                $params[] = floatval($_GET['minPrice']);
            }
            if (isset($_GET['maxPrice']) && $_GET['maxPrice'] !== '') {
                $sql .= " AND p.price <= ?";
                $params[] = floatval($_GET['maxPrice']);
            }
            if (isset($_GET['location']) && $_GET['location'] !== '') {
                $sql .= " AND p.location LIKE ?";
                $params[] = "%" . $_GET['location'] . "%";
            }
            if (isset($_GET['type']) && $_GET['type'] !== '') {
                $sql .= " AND LOWER(p.type) = LOWER(?)";
                $params[] = $_GET['type'];
            }
            if (isset($_GET['beds']) && $_GET['beds'] !== '') {
                $sql .= " AND p.beds >= ?";
                $params[] = intval($_GET['beds']);
            }
            if (isset($_GET['status']) && $_GET['status'] !== '') {
                $sql .= " AND LOWER(p.status) = LOWER(?)";
                $params[] = $_GET['status'];
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $properties = $stmt->fetchAll();

            $response = [];
            foreach ($properties as $prop) {
                $response[] = [
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
                    "agentId" => $prop['agentId'] ? intval($prop['agentId']) : null,
                    "agent" => $prop['agentId'] ? [
                        "id" => intval($prop['agentId']),
                        "name" => $prop['agentName'],
                        "bio" => $prop['agentBio'],
                        "photo" => $prop['agentPhoto'],
                        "email" => $prop['agentEmail'],
                        "phone" => $prop['agentPhone']
                    ] : null
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
