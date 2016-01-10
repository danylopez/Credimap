<?php

$headers = "From: <cliente@credimap.com>\r\n";
$headers = "MIME-Version: 1.0\r\n";
$headers = "Content-type:text/html;charset=UTF-8\r\n";

date_default_timezone_set('Etc/UTC');
require '../PHPMailerAutoload.php';
$mail = new PHPMailer;
$mail->IsSMTP();
$mail->SMTPDebug = 1;
$mail->Debugoutput = 'html';
$mail->SMTPAuth = true; // authentication enabled
$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
$mail->Host = "smtp.gmail.com";
$mail->Port = 465; // or 587
$mail->IsHTML(true);
$mail->Username = "micredimap@gmail.com";
$mail->Password = "credimap1234";
$mail->SetFrom("micredimap@gmail.com");
$mail->Subject = "Test";
$mail->Body = "hello";
$mail->AddAddress("alanh.lhp@gmail.com");

$to = 'alanh.lhp@gmail.com';
$name = $_POST['name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$subject = 'Interesado en Credito';
$message = $_POST['message'];
$body = "
<html>
<body>
<p>
$message
<h1>Datos Personales</h1>
Nombre: $name<br/>
Email: $email<br/>
Teléfono: $phone<br/>
</p>
</body>
</html>
";

//if(mail($to, $subject, $body, $headers)){
if($mail->send()){
	echo "Mensaje enviado! <a href='../index.html'>Click Aqui</a> para regresar a la pagina principal";
} else{
	echo "Hubo un error enviando el mensaje";
}

?>