<?php
// save_users.php
header("Content-Type: application/json");

// Get incoming JSON from POST
$data = file_get_contents("php://input");

// Validate JSON
if (json_decode($data) === null) {
    echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
    exit;
}

// Save to users.json
file_put_contents("users.json", $data);

echo json_encode(["status" => "ok"]);
?>