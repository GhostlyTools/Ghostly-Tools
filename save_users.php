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

    // Decode posted users array
    $newUsers = json_decode($data, true);

    if ($newUsers === null) {
        http_response_code(400);
        echo "Invalid JSON";
        exit();
    }

    // Save with proper locking
    $fp = fopen($file, 'w');
    if (flock($fp, LOCK_EX)) {
        fwrite($fp, json_encode($newUsers, JSON_PRETTY_PRINT));
        fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);

    echo "✅ Users saved successfully";
} else {
    http_response_code(400);
    echo "No data received";
}
?>