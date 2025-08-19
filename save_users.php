<?php
// Allow CORS if testing locally
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = file_get_contents("php://input");

if ($data) {
    $file = "users.json";

    // Decode posted user (single user object)
    $newUser = json_decode($data, true);

    if ($newUser === null) {
        http_response_code(400);
        echo "Invalid JSON";
        exit();
    }

    // Read existing users
    if (file_exists($file)) {
        $users = json_decode(file_get_contents($file), true);
        if (!is_array($users)) {
            $users = [];
        }
    } else {
        $users = [];
    }

    // Add new user
    $users[] = $newUser;

    // Save all users back
    file_put_contents($file, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

    echo "✅ User saved successfully";
} else {
    http_response_code(400);
    echo "No data received";
}
?>