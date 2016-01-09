<?php
$headers .= "From: <cliente@credimap.com>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";

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

//$body = "$message <br><br> Datos Personales <br><br> Nombre: $name<br> Email: $email<br> Teléfono: $phone";

if(mail($to, $subject, $body, $headers)){
	echo "Mensaje enviado! <a href='email.html'>Click Aqui</a> para enviar otro mensaje";
} else{
	echo "Hubo un error enviando el mensaje";
}

?>
