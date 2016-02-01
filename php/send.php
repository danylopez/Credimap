<?php

date_default_timezone_set('Etc/UTC');
require './PHPMailer-master/PHPMailerAutoload.php';
require './PHPMailer-master/vendor/autoload.php';
const GUSER = 'micredimap@gmail.com'; 
const GPWD = 'credimap1234';

$to = 'octavian.diaz@gmail.com';
$from = GUSER;
$from_name = 'Credi Map';
$subject = 'Interesado en Credito';
$name = (isset($_POST['name']) ? $_POST['name'] : ''); 
$phone = (empty($_POST['phone']) ? '(vacio)' : $_POST['phone']);
$email = (isset($_POST['email']) ? $_POST['email'] : '');
$message = (empty($_POST['message']) ? '(vacio)' : $_POST['message']);
$finan = (isset($_POST['financiera']) ? $_POST['financiera'] : '(vacio)');
$body = "
<html>
<body>
<p>
<h1>Mensaje</h1>
$message
</p>
<p>
<h1>Datos Personales</h1>
Nombre: $name<br/>
Email: $email<br/>
Teléfono: $phone<br/>
</p>
<hr/>
$finan
</body>
</html>
";

function smtpmailer($to, $from, $from_name, $subject, $body) {
	global $error;
	$mail = new PHPMailer;
	$mail->IsSMTP();
	$mail->SMTPDebug = 0;
	$mail->Debugoutput = 'html';
	$mail->SMTPAuth = true; // authentication enabled
	$mail->SMTPSecure = 'tls'; // secure transfer enabled REQUIRED for Gmail
	$mail->Host = "smtp.gmail.com";
	$mail->Port = 587; // 465 or 587
	$mail->Username = GUSER;
	$mail->Password = GPWD;
	$mail->From = $from;
	$mail->FromName = $from_name;
	$mail->Subject = $subject;
	$mail->IsHTML(true);
	$mail->Body = $body;
	$mail->AddAddress($to);
    //$mail->AddCC('retos@campus-party.com.mx');
	if($mail->send()){
		$error = 'Message sent';
		return true;
	} else{
		$error = 'Mail error fkt: '.$mail->ErrorInfo;
		return false;
	}
}

//if(smtpmailer($to, $from, $from_name, $subject, $body)){
if(smtpmailer($to, GUSER, $from_name, $subject, $body)){
	
}else{
	
}

?>