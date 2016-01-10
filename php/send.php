<?php

date_default_timezone_set('Etc/UTC');
require './PHPMailer-master/PHPMailerAutoload.php';
define('GUSER', 'micredimap@gmail.com'); 
define('GPWD', 'credimap1234');

function smtpmailer($to, $from, $from_name, $subject, $body) {
	global $error;
	$mail = new PHPMailer;
	$mail->IsSMTP();
	$mail->SMTPDebug = 1;
	$mail->Debugoutput = 'html';
	$mail->SMTPAuth = true; // authentication enabled
	$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
	$mail->Host = "smtp.gmail.com";
	$mail->Port = 465; // or 587
	$mail->Username = "GUSER";
	$mail->Password = "GPWD";
	$mail->SetFrom($from, $from_name);
	$mail->Subject = $subject;
	$mail->Body = $body;
	$mail->AddAddress($to);
	if($mail->send()){
		$error = 'Message sent! \o/';
		return true;
	} else{
		$error = 'Mail error fkt: '.$mail->ErrorInfo;
		return false;
	}
}

$to = 'alanh.lhp@gmail.com';
$from = GUSER;
$from_name = 'Credi Map'
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

if(smtpmailer($to, $from, $from_name, $subject, $body)){
	echo "Mensaje enviado! <a href='../index.html'>Click Aqui</a> para regresar a la pagina principal";
}else{
		echo "Hubo un error enviando el mensaje";
}

?>