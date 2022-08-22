

// ========================================================
// let btnPayment = 'Перейти к оплате';
// let btnPay = 'Оплатить';

function telegramWebApp() {
	// Controls BreadCrumbs
	// const tariffs = document.querySelector('#tar');
	// const devices = document.querySelector('#dev');
	// const payment = document.querySelector('#pay');

	// delete
	// payment.classList.remove('hidden');
	// devices.classList.remove('hidden');
	// payment.click();

	const tg = window.Telegram.WebApp;;
	tg.ready();
	tg.expand();
	// tg.MainButton.textColor = "#FFFFFF";
	// tg.MainButton.color = '#00c271';

	// tariffs.addEventListener('click', (e) => {
	// 	tg.MainButton.setParams({
	// 		is_visible: false,
	// 		text: btnPayment,
	// 	}).showProgress();
	// });

	// devices.addEventListener('click', (e) => {
	// 	tg.MainButton.setParams({
	// 		is_visible: true,
	// 		text: btnPayment,
	// 	}).hideProgress();
	// 	tg.MainButton.onClick(() => {
	// 		payment.classList.remove('hidden');
	// 		payment.click();
	// 	})
	// });

	// payment.addEventListener('click', (e) => {
	// 	tg.MainButton.setParams({
	// 		is_visible: true,
	// 		text: btnPay,
	// 	}).hideProgress();
	// 	if (tg.MainButton.text === btnPay) {
	// 		tg.MainButton.onClick(() => {
	// 			console.log('btnPay');
	// 			tg.openLink('https://pay.freekassa.ru/?m=21411&oa=1000&currency=RUB&o=123&s=5571cc611760840c125878986150f68b');
	// 			//window.open('https://pay.freekassa.ru/?m=21411&oa=1000&currency=RUB&o=123&s=5571cc611760840c125878986150f68b');
	// 		})
	// 	}

	// });

	// const AInput = document.querySelector('.checkbox__input');
	// AInput.addEventListener('click', () => {
	// 	if (isPayment) {
	// 		if (AInput.checked) {
	// 			tg.MainButton.setParams({
	// 				is_active: true,
	// 				color: '#00c271'
	// 			})
	// 		} else {
	// 			tg.MainButton.setParams({
	// 				is_active: false,
	// 				color: '#10915b'
	// 			})
	// 		}
	// 	}
	// 	// else {
	// 	// 	tg.MainButton.setParams({
	// 	// 		is_active: true,
	// 	// 	})
	// 	// }
	// });

	// Telegram.WebApp.onEvent('mainButtonClicked', () => {
	// 	if (isDevices) {
	// 		tg.MainButton.setParams({
	// 			is_visible: true,
	// 			text: 'Перейти к оплате',
	// 		})
	// 		isDevices = false;
	// 		isPayment = true;
	// 	}
	// 	if (isPayment) {
	// 		// Sections
	// 		const option = document.querySelector('.option');
	// 		const payment = document.querySelector('.payment');

	// 		// Header breadcrumbs
	// 		const paym = document.querySelector('.paym');

	// 		option.classList.add('hidden');
	// 		payment.classList.remove('hidden');
	// 		paym.classList.remove('hidden');

	// 		tg.MainButton.disable();
	// 		tg.MainButton.setParams({
	// 			is_visible: true,
	// 			text: 'Оплатить',
	// 		})
	// 		// tg.MainButton.onClick(() => {
	// 		// 	window.open('https://pay.freekassa.ru/?m=21411&oa=1000&currency=RUB&o=123&s=5571cc611760840c125878986150f68b', '_blank');
	// 		// })
	// 		isDevices = true;
	// 		isPayment = false;
	// 	}
	// })
}
telegramWebApp()