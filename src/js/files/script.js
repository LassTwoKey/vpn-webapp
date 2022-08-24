import * as vpnFunctions from "./functions.js";
vpnFunctions.addLoadedClass();
vpnFunctions.spollers();

export const startVpnWebApp = () => { // GROUPED_BY_MONTH_DURATION, COUNTRIES, PROTOCOLS
	const GROUPED_BY_MONTH_DURATION = [
		{
			month_duration: 12,
			tariffs: [
				{
					month_duration: 12,
					devices_number: 1,
					result_price: 1500,
					currency: "RUB",
					discount: 20
				},
				{
					month_duration: 12,
					devices_number: 2,
					result_price: 2000,
					currency: "RUB",
					discount: 20
				},
			]
		},
		{
			month_duration: 6,
			tariffs: [
				{
					month_duration: 6,
					devices_number: 1,
					result_price: 1500,
					currency: "RUB",
					discount: 20
				},
				{
					month_duration: 6,
					devices_number: 2,
					result_price: 1700,
					currency: "RUB",
					discount: 20
				},
				{
					month_duration: 6,
					devices_number: 3,
					result_price: 1500,
					currency: "RUB",
					discount: 20
				},
				{
					month_duration: 6,
					devices_number: 4,
					result_price: 2500,
					currency: "RUB",
					discount: 20
				},
			]
		},
		{
			month_duration: 3,
			tariffs: [
				{
					month_duration: 3,
					devices_number: 1,
					result_price: 1500,
					currency: "RUB",
					discount: 43
				},
				{
					month_duration: 3,
					devices_number: 2,
					result_price: 2020,
					currency: "RUB",
					discount: 23
				},
				{
					month_duration: 3,
					devices_number: 3,
					result_price: 2489,
					currency: "RUB",
					discount: 10
				},
				{
					month_duration: 3,
					devices_number: 4,
					result_price: 3000,
					currency: "RUB",
					discount: 73
				},
				{
					month_duration: 3,
					devices_number: 5,
					result_price: 3500,
					currency: "RUB",
					discount: 73
				},
			]
		},
	];
	const COUNTRIES = [
		{
			country: 'Belarus',
			id: 'BY',
			discount: 0
		},
		{
			country: 'Norway',
			id: 'NW',
			discount: 56
		},
		{
			country: 'Germany',
			id: 'GR',
			discount: 23
		},
		{
			country: 'Russia',
			id: 'RU',
			discount: 7
		},
		{
			country: 'USA',
			id: 'US',
			discount: 20
		},
		{
			country: 'Belarus',
			id: 'BY',
			discount: 0
		},
		{
			country: 'Norway',
			id: 'NW',
			discount: 56
		},
		{
			country: 'Germany',
			id: 'GR',
			discount: 23
		},
		{
			country: 'Russia',
			id: 'RU',
			discount: 7
		},
		{
			country: 'USA',
			id: 'US',
			discount: 20
		},
	];
	const PROTOCOLS = [
		{
			protocol: "Wiregurad",
			id: 4
		},
		{
			protocol: "OpenVpn",
			id: 5
		},
	];



	const ExtendVpnselectedTariff = {
		subscription_id: 123123,
		month_duration: 12,
		price: 2000,
		discount: 20,
		currency: 'RUB',
		devicesNumber: 3
	}
	const VpnTariffState = {
		MakeAnOrder: 'MakeAnOrder',
		ExtendVpnSubscription: 'ExtendVpnSubscription'
	};



	const VpnTariffPage = {
		SelectTariffPage: 'SelectTariffPage',
		InputDevices: 'InputDevices',
		AcceptVpnCard: 'AcceptVpnCard'
	}
	const allowDeviceToAdd = 4;



	const VpnInProcess = {
		protocols: PROTOCOLS,
		countries: COUNTRIES,
		groupedByMonthDuration: GROUPED_BY_MONTH_DURATION,
		state: VpnTariffState.MakeAnOrder,
		currentPage: VpnTariffPage.SelectTariffPage,
		selectedTariff: {},
		isTermsOfRulesAccepted: false,
		devices: [],
		pages: {
			tariffs: document.querySelector('.tariffs'),
			devices: document.querySelector('.devices'),
			payment: document.querySelector('.payment')
		},
		countrols: {
			tariffs: document.querySelector('.btn-tariffs'),
			devices: document.querySelector('.btn-devices'),
			payment: document.querySelector('.btn-payment')
		},
		mainButtons: {
			toCheckout: document.querySelector('[data-checkout]'),
			toPay: document.querySelector('[data-pay]')
		},
		deviceoptionValues: {
			nameAttr: 1,
			id: 1,
			countryValue: 1
		},

		init() {
			switch (this.state) {
				case VpnTariffState.ExtendVpnSubscription:
					this.switchPage(VpnTariffPage.AcceptVpnCard);
					break;
				case VpnTariffState.MakeAnOrder:
					this.switchPage(VpnTariffPage.SelectTariffPage);
					break;
				default:
					throw 'Wrong statement';
			}

			if (this.currentPage === VpnTariffPage.SelectTariffPage) {
				this.createMonthDurationSpollers(this.groupedByMonthDuration);
			}

			this.controlsVpn();
			this.addDevicesCheck();

			if (this.state === VpnTariffState.ExtendVpnSubscription) {
				this.selectedTariff = ExtendVpnselectedTariff;
				this.createPaymentSelection();
				this.accessPayClick();
			}
		},
		switchPage(page) {
			if (page === VpnTariffPage.SelectTariffPage) {
				this.pages.tariffs.classList.remove('hidden');
				this.pages.devices.classList.add('hidden');
				this.pages.payment.classList.add('hidden');
				//========================================
				this.countrols.tariffs.classList.remove('hidden');
				this.countrols.devices.classList.add('hidden');
				this.countrols.payment.classList.add('hidden');
				//========================================
				this.mainButtons.toCheckout.classList.add('hidden');
				this.mainButtons.toPay.classList.add('hidden');
				//========================================
				document.querySelector('.devices__block').innerHTML = "";
			}
			if (page === VpnTariffPage.InputDevices) {
				this.pages.tariffs.classList.add('hidden');
				this.pages.devices.classList.remove('hidden');
				this.pages.payment.classList.add('hidden');
				//========================================
				this.countrols.tariffs.classList.remove('hidden');
				this.countrols.devices.classList.remove('hidden');
				this.countrols.payment.classList.add('hidden');
				//========================================
				this.mainButtons.toCheckout.classList.remove('hidden');
				this.mainButtons.toPay.classList.add('hidden');
			}
			if (page === VpnTariffPage.AcceptVpnCard) {
				this.pages.tariffs.classList.add('hidden');
				this.pages.devices.classList.add('hidden');
				this.pages.payment.classList.remove('hidden');
				//========================================
				this.countrols.tariffs.classList.remove('hidden');
				this.countrols.devices.classList.remove('hidden');
				this.countrols.payment.classList.remove('hidden');
				//========================================
				this.mainButtons.toCheckout.classList.add('hidden');
				this.mainButtons.toPay.classList.remove('hidden');
			}

			if (this.state === VpnTariffState.ExtendVpnSubscription) {
				this.countrols.tariffs.classList.add('hidden');
				this.countrols.devices.classList.add('hidden');
				this.countrols.payment.classList.remove('hidden');
				this.countrols.payment.classList.add('only-payment');
			}
		},
		controlsVpn() {
			this.countrols.tariffs.onclick = () => {
				this.currentPage = VpnTariffPage.SelectTariffPage;
				this.switchPage(this.currentPage);
				this.deviceoptionValues.id = 1;
				this.deviceoptionValues.nameAttr = 1;
				this.deviceoptionValues.countryValue = 1;
				this.devices = [];
			}
			this.countrols.devices.onclick = () => {
				this.currentPage = VpnTariffPage.InputDevices;
				this.switchPage(this.currentPage);
			}
			this.countrols.payment.onclick = () => {
				this.currentPage = VpnTariffPage.AcceptVpnCard;
				this.switchPage(this.currentPage);
			}
		},
		mainButtonsVpn() {
			this.mainButtons.toCheckout.onclick = () => {
				const deviceitems = document.querySelectorAll('.devices__item');
				let condition = true;

				deviceitems.forEach((device, i) => {
					if (!device.querySelector('.devices__dropdown-title').getAttribute('value')) {
						condition = false;
						device.classList.add('empty');
					}
					else {
						device.classList.remove('empty');
					}
				});

				if (condition) {
					this.currentPage = VpnTariffPage.AcceptVpnCard;
					this.switchPage(VpnTariffPage.AcceptVpnCard);
					this.createPaymentSelection();
					this.accessPayClick();
					this.fillDevices(deviceitems);
				}
			}
			this.mainButtons.toPay.onclick = () => {
				this.SubmitData();
			}
		},
		createMonthDurationSpollers(groupedByMonthDuration) {
			const groupedBy = groupedByMonthDuration;
			const monthDurationSpollerBlock = document.querySelector('[data-spoller-tariffs]');
			monthDurationSpollerBlock.innerHTML = '';
			for (let i = 0; i < groupedBy.length; i++) {
				const monthDuration = groupedBy[i].month_duration;
				const tariffs = groupedBy[i].tariffs;

				const monthDurationSpoller = document.createElement("div");
				monthDurationSpoller.classList.add("spollers__item");
				monthDurationSpoller.classList.add("tariffs__item");
				monthDurationSpollerBlock.appendChild(monthDurationSpoller);

				const monthDurationSpollerBtn = document.createElement("button");
				monthDurationSpollerBtn.setAttribute('data-spoller', '');
				monthDurationSpollerBtn.setAttribute('type', 'button');
				monthDurationSpollerBtn.classList.add("spollers__title");
				monthDurationSpollerBtn.classList.add("tariffs__title");
				monthDurationSpollerBtn.innerHTML = `${monthDuration} месяцев`;
				if (i === 0) {
					monthDurationSpollerBtn.classList.add("_spoller-active");
				}
				monthDurationSpoller.appendChild(monthDurationSpollerBtn);

				const monthDurationSpollerBody = document.createElement("div");
				monthDurationSpollerBody.classList.add("spollers__body");
				monthDurationSpoller.appendChild(monthDurationSpollerBody);

				const monthDurationSpollerContainer = document.createElement("div");
				monthDurationSpollerContainer.classList.add("info-tariffs");
				monthDurationSpollerBody.appendChild(monthDurationSpollerContainer);

				for (let j = 0; j < tariffs.length; j++) {
					const vpnTariff = this.createVPNTariff(tariffs[j].month_duration, tariffs[j].devices_number, tariffs[j].result_price, tariffs[j].currency, tariffs[j].discount)
					monthDurationSpollerContainer.appendChild(vpnTariff);
				}
			}
			vpnFunctions.spollers();
		},
		createVPNTariff(monthDuration, devicesNumber, price, currency, discount) {
			const vpnTariff = document.createElement("div");
			vpnTariff.classList.add("info-tariffs__item");
			vpnTariff.innerHTML = `
				<h2 class="mon-count">${monthDuration}</h2>
				<h2 class="mon-text">месяцев</h2>
				<h2 class="subscription">подписки</h2>
				<h3 class="devices-number"><span>${devicesNumber}</span> устройство</h3>
				<h3 class="price">${price} ${currency}</h3>
				<span class="discount">${discount}%</span>
			`;

			vpnTariff.addEventListener('click', (e) => {
				this.selectedTariff = {
					month_duration: monthDuration,
					price: price,
					discount: discount,
					currency: currency,
					devicesNumber: devicesNumber
				}

				this.currentPage = VpnTariffPage.InputDevices;
				this.switchPage(VpnTariffPage.InputDevices);

				this.createDeviceSpollers(this.selectedTariff, document.querySelector('[data-spoller-devices]'), false);
				this.mainButtonsVpn();

				if (!(this.selectedTariff.devicesNumber === allowDeviceToAdd)) {
					document.querySelector('.devices__add').innerHTML = '';
				} else {
					document.querySelector('.devices__add').innerHTML = `
						<button data-add-device class="devices__add-button">
							<span class="">+</span>
						</button>
					`;
				}
			});
			return vpnTariff;
		},
		createDeviceSpollers(selectedTariff, spollerContainer, isAddSpoller) {
			let spollerCounter;

			const selectedValues = selectedTariff;
			const deviceSpollerBlock = spollerContainer;

			if (isAddSpoller) {
				spollerCounter = 1;
			} else {
				spollerCounter = selectedValues.devicesNumber;
			}

			for (let i = 0; i < spollerCounter; i++) {
				this.devices.push({
					country: '',
					protocol: ''
				})

				const deviceEl = document.createElement('div')
				deviceEl.classList.add("devices__item");
				deviceSpollerBlock.appendChild(deviceEl);

				const deviceSpollerBtn = document.createElement("button");
				deviceSpollerBtn.setAttribute('data-spoller', '');
				deviceSpollerBtn.setAttribute('type', 'button');
				deviceSpollerBtn.classList.add("spollers__title");
				deviceSpollerBtn.classList.add("devices__title");
				deviceSpollerBtn.innerHTML = `Устройство ${this.deviceoptionValues.nameAttr}`;
				deviceEl.appendChild(deviceSpollerBtn);

				const deviceSpollerBody = document.createElement("div");
				deviceSpollerBody.classList.add("spollers__body");
				deviceSpollerBody.classList.add("devices__body");
				deviceEl.appendChild(deviceSpollerBody);

				const devicesDropdown = document.createElement("div");
				devicesDropdown.classList.add("devices__dropdown");
				devicesDropdown.classList.add("closed");
				deviceSpollerBody.appendChild(devicesDropdown);

				const deviceDropdownButton = document.createElement("h2");
				deviceDropdownButton.classList.add("devices__dropdown-title");
				deviceDropdownButton.setAttribute('value', '');
				deviceDropdownButton.innerHTML = `Выберите страну`;
				devicesDropdown.appendChild(deviceDropdownButton);

				const deviceDropdownList = document.createElement("ul");
				deviceDropdownList.classList.add("devices__dropdown-list");
				devicesDropdown.appendChild(deviceDropdownList);

				const contentOption = document.createElement("div");
				contentOption.classList.add('options');
				contentOption.classList.add('devices__options');
				deviceSpollerBody.appendChild(contentOption);

				for (let j = 0; j < this.countries.length; j++) {
					deviceDropdownList.appendChild(this.createDeviceContries(devicesDropdown, deviceDropdownButton, j));
				}

				for (let k = 0; k < this.protocols.length; k++) {
					contentOption.appendChild(this.createDeviceProtocols(k));
				}

				contentOption.querySelectorAll('input').forEach((radio, i) => {
					if (i === 0) {
						radio.setAttribute('checked', '');
						radio.click();
					}
				});

				deviceDropdownButton.onclick = (e) => {
					devicesDropdown.classList.toggle('closed');
				}

				this.deviceoptionValues.nameAttr++;

				vpnFunctions.spollers();
			}
		},
		createDeviceContries(dropdown, elemButton, index) {
			const country = this.countries[index].country;

			const deviceDropdownItem = document.createElement("li");
			deviceDropdownItem.classList.add("devices__dropdown-item");
			deviceDropdownItem.setAttribute('country', `${this.deviceoptionValues.countryValue}`);
			deviceDropdownItem.innerHTML = `${country}`;

			deviceDropdownItem.onclick = (e) => {
				elemButton.innerHTML = `${deviceDropdownItem.innerText}`;
				dropdown.classList.toggle('closed');
				dropdown.querySelector('.devices__dropdown-title').setAttribute('value', elemButton.innerHTML)
			}

			this.deviceoptionValues.countryValue++;

			return deviceDropdownItem;
		},
		createDeviceProtocols(DeviceProtocolIndex) {
			const protocol = this.protocols[DeviceProtocolIndex].protocol;

			const optionProtocol = document.createElement("div");
			optionProtocol.classList.add('options__item');

			optionProtocol.innerHTML = `
				<input hidden id="o_${this.deviceoptionValues.nameAttr}_${this.deviceoptionValues.id}" class="options__input" type="radio" value="r_${DeviceProtocolIndex}_1" name="option${this.deviceoptionValues.nameAttr}">
				<label for="o_${this.deviceoptionValues.nameAttr}_${this.deviceoptionValues.id}" class="options__label">
					<span class="options__text">${protocol}</span>
				</label>
			`;

			this.deviceoptionValues.id++;

			return optionProtocol;
		},
		createPaymentSelection() {
			const month_duration = this.selectedTariff.month_duration;
			const price = this.selectedTariff.price;
			const discount = this.selectedTariff.discount;
			const currency = this.selectedTariff.currency;
			const devicesNumber = this.devices.length;

			const PaymentSelectionContainer = document.querySelector('.payment__info-content');
			document.querySelector('.payment__title').innerHTML = `Доступ к VPN на ${month_duration} месяцев.`;
			PaymentSelectionContainer.innerHTML = `
				<div class="payment__info">
					<div class="payment__currency">
						<div class="payment__initial">${price} ${currency}</div>
					</div>
					<div class="payment__mon">${month_duration} месяцев</div>
					<div class="payment__devices">${devicesNumber} устройств</div>
					<span class="discount">${discount}%</span>
				</div>
			`;
		},
		updatePaymentButton() {
			const checkbox = this.querySelector('input');
			const buttonPay = document.querySelector('[data-pay]');

			if (checkbox.checked) {
				buttonPay.classList.add('checked');
			} else {
				buttonPay.classList.remove('checked');
			}
		},
		accessPayClick() {
			const checkedElement = document.querySelector('.checkbox');
			checkedElement.addEventListener('change', this.updatePaymentButton);
		},
		addDevicesCheck() {
			const addDeviceButton = document.querySelector('.devices__add');
			addDeviceButton.innerHTML = `
				<button data-add-device class="devices__add-button">
					<span class="">+</span>
				</button>
			`;

			addDeviceButton.addEventListener('click', e => {
				this.addDevices();
			});
		},
		addDevices() {
			this.createDeviceSpollers(this.selectedTariff, document.querySelector('[data-spoller-devices]'), true);
		},
		fillDevices(deviceitems) {
			for (let i = 0; i < deviceitems.length; i++) {
				const country = deviceitems[i].querySelector('.devices__dropdown-title').getAttribute('value')
				const optItems = deviceitems[i].querySelectorAll('.options__item')

				for (let j = 0; j < optItems.length; j++) {
					const optItem = optItems[j];

					if (optItem.querySelector('.options__input').checked) {
						this.devices[i].protocol = optItem.querySelector('.options__text').innerHTML;
					}
				}

				this.devices[i].country = country;
			}

		},
		SubmitData() {
			console.log(this.devices);
			// 	fetch("handler.php", {
			// 		method: "POST",
			// 		body: data
			//   }).then(function (response) {
			// 		...
			//   }).catch(function (error) {
			// 		...
			//   });
		}
	}
	VpnInProcess.init();
};


