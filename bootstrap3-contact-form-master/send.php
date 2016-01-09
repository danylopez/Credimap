<?php

$to = 'alanh.lhp@gmail.com';
$email = $_POST['email'];
$subject = 'Interesado en Credito'
$phone = $_POST['phone'];
$message = $_POST['message'];
$headers = 'F'

$body = "This is an automated messgae. \n\n $message";

$from = "From: $email";

mail($to, $subject, $body, $from);

echo "Message Sent! <a href='email.html'>Click Here</a> to sent another email"

?>
