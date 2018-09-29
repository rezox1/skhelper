var lastKeyPressed;

//функция для добавления строки в буфер обмена
const copyToClipboard = str => {
	const el = document.createElement('textarea'); // Create a <textarea> element
	el.value = str; // Set its value to the string that you want copied
	el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
	el.style.position = 'absolute';
	el.style.left = '-9999px'; // Move outside the screen to make it invisible
	document.body.appendChild(el); // Append the <textarea> element to the HTML document
	const selected =
		document.getSelection().rangeCount > 0 // Check if there is any content selected previously
		 ? document.getSelection().getRangeAt(0) // Store selection if found
		 : false; // Mark as false to know no selection existed before
	el.select(); // Select the <textarea> content
	document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
	document.body.removeChild(el); // Remove the <textarea> element
	if (selected) { // If a selection existed before copying
		document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
		document.getSelection().addRange(selected); // Restore the original selection
	}
};
//функция показа сообщения
function showMessage(type, message) {
    if (!!window.wrappedJSObject.toastr) {
        switch (type) {
            case 'info':
                window.wrappedJSObject.toastr.info(message);
                break;
            case 'success':
                window.wrappedJSObject.toastr.success(message);
                break;
            case 'error':
                window.wrappedJSObject.toastr.error(message);
                break;
            case 'warning':
                window.wrappedJSObject.toastr.warning(message);
                break;
            default:
                console.log("Unknown type of message");
                break;
        }
        XPCNativeWrapper(window.wrappedJSObject.toastr);
    } else {
		
	}

    //переделать со временем на более надежный вариант (сделать проверку на то, что страница китовая, а уже затем проверять наличие объекта)
}

//получение информации о состоянии приложения
setTimeout(function abc() {
	$.ajax({
		type: "GET",
		url: 'http://smh.point.smart-consulting.ru/rest/monitoring/',
		dataType: 'json',
		complete: response => {
			console.log(response);
			//console.log(response.responseText);
			//console.log(response.responseText.indexOf('WARN'));
			if (~response.responseText.indexOf('WARN')){
				console.log("Есть ошибки");
			}
		}
	});
}, 5000);

//получение UUID нажатием комбинации клавиш
document.body.onkeydown = function handle(event){
	console.log(event);
	if ((event.keyCode==18)||(event.keyCode==17)){
		if (((lastKeyPressed==17)&&(event.keyCode==18))||((lastKeyPressed==18)&&(event.keyCode==17))){
			if ($('.grid-row.selected').length!=0){
				let DataId = $('.grid-row.selected')[0].getAttribute('data-id');
				copyToClipboard(DataId);
				/* раскоментировать после выхода Firefox 63
				navigator.clipboard.writeText(DataId);
				*/
				showMessage('info', 'UUID записи скопирован в буфер обмена');
			} else
				showMessage('warning', 'Пожалуйста, выберите запись');
			lastKeyPressed = null;
		} else
        lastKeyPressed = event.keyCode;
	} else
		lastKeyPressed = event.keyCode;
}

browser.runtime.onMessage.addListener(info=>{
	/*
	временно нажатие на "Получить UUID" дает тот же результат, что и нажатие горячих клавиш
	будет исправлено после выхода FIrefox 63
	*/
	if ($('.grid-row.selected').length!=0){
		let DataId = $('.grid-row.selected')[0].getAttribute('data-id');
		copyToClipboard(DataId);
		/* раскоментировать после выхода Firefox 63
		navigator.clipboard.writeText(DataId);
		*/
		showMessage('info', 'UUID записи скопирован в буфер обмена');
	} else
		showMessage('warning', 'Пожалуйста, выберите запись');
});

/*
задать вопрос на форуме mozilla, почему не работает адрес с #
сделать проверку на то, что пользователь работает со смарт китом
задать вопрос на форуме почему не работает через просто rest/monitoring
*/
