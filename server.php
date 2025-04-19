<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

// Получаем содержимое тела запроса
$sRawData = file_get_contents('php://input');

// Проверяем, похоже ли содержимое на JSON
$bLooksLikeJson = !empty($sRawData) && is_string($sRawData) && 
    $sRawData[0] === '{' && substr($sRawData, -1) === '}';

if ($bLooksLikeJson) {
    // Пробуем декодировать JSON
    $aDecodedData = json_decode($sRawData, true);
    
    // Проверяем успешность декодирования и наличие поля phone
    if (json_last_error() === JSON_ERROR_NONE && isset($aDecodedData['phone'])) {
        $sPhone = $aDecodedData['phone'];
		if(isset($aDecodedData['email'])) {
			$sEmail = $aDecodedData['email'];
		}
    } else {
        // Если декодирование не удалось или нет поля phone, берём из POST
        $sPhone = $_POST["phone"];
		if(isset($_POST['email'])) {
			$sEmail = $_POST['email'];
		}
    }
} else {
    // Если данные не в формате JSON, берём из POST
    $sPhone = $_POST["phone"];
	if(isset($_POST['email'])) {
		$sEmail = $_POST['email'];
	}
}

$mail = new PHPMailer(true);

try {
	$mail->CharSet = 'utf-8';

	// $mail->SMTPDebug = 3;                               // Enable verbose debug output

	$mail->isSMTP();                                      // Set mailer to use SMTP
	$mail->Host = 'smtp.domain.tld';  // Specify main and backup SMTP servers
	$mail->SMTPAuth = true;                               // Enable SMTP authentication
	$mail->Username = 'user';                 // Наш логин
	$mail->Password = 'password';                           // Наш пароль от ящика
	$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;                            // Enable TLS encryption, `ssl` also accepted
	$mail->Port = 465;                                    // TCP port to connect to
	$mail->setLanguage('ru', 'phpmailer/language/');
	
	$mail->setFrom('no-reply@domain.tld', 'Tours Promo');   // От кого письмо 
	$mail->addAddress('user@domain.tld');     // Add a recipient
	//$mail->addAddress('ellen@example.com');               // Name is optional
	//$mail->addReplyTo('info@example.com', 'Information');
	//$mail->addCC('cc@example.com');
	//$mail->addBCC('bcc@example.com');
	//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
	//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
	$mail->isHTML(true);                                  // Set email format to HTML

	$mail->Subject = 'Данные';
	$mail->Body    = '
		Пользователь оставил данные <br>
		' . (isset($sEmail) ? "Почта: ".$sEmail."<br>" : "") . '
		Номер телефона: ' . $sPhone . '';
	$mail->AltBody = "
		Пользователь оставил данные
		".(isset($sEmail) ? "Почта: ".$sEmail : "")."
		Номер телефона: ".$sPhone."";

	$mail->send();
	echo "Сообщение отправлено";
}
catch (Exception $e) {
    echo "Сообщение не может быть отправлено. Ошибка почтового клиента: {$mail->ErrorInfo}";
}
?>
