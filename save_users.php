<?php
$data = file_get_contents("php://input");
if ($data) {
    file_put_contents("users.json", $data);
    echo "Saved";
} else {
    echo "No data received";
}
?>