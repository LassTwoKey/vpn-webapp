import * as vpnFunctions from "./functions.js";
import urlJoin from 'url-join';

(function ($) {
	$.fn.redraw = function () {
		return this.map(function () { this.offsetTop; return this; });
	};
})(jQuery);

vpnFunctions.addLoadedClass();
vpnFunctions.spollers();

export const startVpnWebApp = () => { // GROUPED_BY_MONTH_DURATION, COUNTRIES, PROTOCOLS
	const VpnTariffState = {
		MakeAnOrder: 'MakeAnOrder',
		ExtendVpnSubscription: 'ExtendVpnSubscription'
	};

	const VpnTariffPage = {
		SelectTariffPage: 'SelectTariffPage',
		InputDevices: 'InputDevices',
		AcceptVpnCard: 'AcceptVpnCard'
	}

	const DeviceAttribute = {
		Country: 'country_id',
		Protocol: 'protocol_id'
	}

	const allowDeviceToAdd = 4;

const VpnInProcess = {
		groupedByMonthDuration: {},

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
			countryValue: 1,
		},


		init() {
			const params = new URLSearchParams(window.location.search)
			this.state = params.get('state')
			
			VpnInProcess.apiUrl = urlJoin(process.env.VPN_REST_HTTPS, 'api/v1/');

			switch (this.state) {
				case VpnTariffState.ExtendVpnSubscription:
					const subscription_id = params.get('subscription_id')
					this.mainButtons.toPay.onclick = () => {
						this.SubmitData();
					}

					VpnInProcess.apiRequest(`subscription/get-subscription-checkout/${subscription_id}`, (result) => {
						this.selectedTariff.monthDuration = result.month_duration;
						this.selectedTariff.price = result.price
						this.selectedTariff.discount = result.discount
						this.selectedTariff.currency = result.currency
						this.selectedTariff.devicesNumber = result.devices_number
						this.selectedTariff.monthLoc = result.month_loc
						this.selectedTariff.devicesLoc = result.devices_loc
						this.selectedTariff.subscriptionId = result.subscription_id
						this.selectedTariff.freekassaUrl = result.freekassa_url

						VpnInProcess.createPaymentSelection({
							monthDuration: this.selectedTariff.monthDuration,
							price: this.selectedTariff.price,
							discount: this.selectedTariff.discount,
							currency: this.selectedTariff.currency,
							devicesNumber: this.selectedTariff.devicesNumber,
							monthLoc: this.selectedTariff.monthLoc,
							devicesLoc: this.selectedTariff.devicesLoc
						});

						this.accessPayClick();
						this.switchPage(VpnTariffPage.AcceptVpnCard)
					})
					break;

				case VpnTariffState.MakeAnOrder:
					VpnInProcess.apiRequest('vpn-protocol/', result => {
						VpnInProcess.protocols = result
						console.log(result)
					})

					VpnInProcess.apiRequest('vpn-country/', (result) => {
						VpnInProcess.countries = result
						console.log(result)
					})

					VpnInProcess.apiRequest('vpn_device_tariff/tariffs-data', (results) => {
						for (let i = 0; i < results.length; i++) {
							let monthDuration = results[i].month_duration
							if (!(monthDuration in VpnInProcess.groupedByMonthDuration)) {
								VpnInProcess.groupedByMonthDuration[monthDuration] = []
							}
							VpnInProcess.groupedByMonthDuration[monthDuration].push({
								tariff_id: results[i].tariff_id,
								monthDuration: monthDuration,
								devices_number: results[i].devices_number,
								result_price: results[i].price,
								currency: results[i].currency,
								discount: results[i].discount,
								monthLoc: results[i].month_loc,
								devicesLoc: results[i].devices_loc
							})
						}
						console.log(VpnInProcess.groupedByMonthDuration)
						if (this.currentPage === VpnTariffPage.SelectTariffPage) {
							this.createMonthDurationSpoilers();
						}
					})
					this.addDevicesCheck();
					this.switchPage(VpnTariffPage.SelectTariffPage)
					break;
				default:
					throw 'Wrong statement'
			}

			this.controlsVpn();
			// this.addDevicesCheck();

			// if (this.state === VpnTariffState.ExtendVpnSubscription) {
			// 	this.selectedTariff = ExtendVpnselectedTariff;
			// 	this.createPaymentSelection();
			// 	this.accessPayClick();
			// }
		},
		callApi: async function(method, onCallback) {
			await fetch(`${VpnInProcess.apiUrl}${method}`, {})
					.then((response) => onCallback(response))
		},
		apiRequest: function (method, onCallback, type = "GET", data = null) {
			var authData = Telegram.WebApp.initDataRaw || '';
			let body = null;
			if (data != null) {
				body = $.extend(data, { _auth: authData })
			}
			// const authToken = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxODQxNzQ1ODI0LCJqdGkiOiI0OWRmMjM2YTI5OTE0NzM5OWVlMzA0ZWU5OWM4MDRlNSIsInVzZXJfaWQiOjF9.A2tHALdd9ZXxCYMFK2SN1q5tFxJzqCmmVEAxOFUGSh4";

			let endpoint = urlJoin(VpnInProcess.apiUrl, method);
			console.log(endpoint)
			$.ajax(endpoint, {
				type: type || "GET",
				// beforeSend: function(request) {
				// 	request.setRequestHeader("Authorization", authToken);
				//   },
				data: body,
				dataType : 'json',  
  				crossDomain:true,
				// xhrFields: {
				// 	withCredentials: true
				// },
				success: function (result) {
					onCallback && onCallback(result);
				},
				error: function (xhr) {
					console.log(xhr)
					onCallback && onCallback({ error: 'Server error' });
				}
			});
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
				VpnInProcess.devices = [];
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

				// ======================
				if (condition) {
					VpnInProcess.fillDevices(deviceitems);
					console.log(`Devices: ${VpnInProcess.devices}`);

					// VpnInProcess.currentPage = VpnTariffPage.AcceptVpnCard;
					// VpnInProcess.switchPage(VpnTariffPage.AcceptVpnCard);
					// VpnInProcess.createPaymentSelection();
					// VpnInProcess.accessPayClick();
					VpnInProcess.apiRequest('subscription/calculate-invoice/',
						(result) => {
							// VpnInProcess.subscription = result;
							console.log(result);

							VpnInProcess.currentPage = VpnTariffPage.AcceptVpnCard;
							VpnInProcess.switchPage(VpnTariffPage.AcceptVpnCard);
							VpnInProcess.createPaymentSelection({
								monthDuration: this.selectedTariff.month_duration,
								price: result.price,
								discount: result.discount,
								currency: 'RUB',
								devicesNumber: this.selectedTariff.devicesNumber,
								monthLoc: this.selectedTariff.monthLoc,
								devicesLoc: this.selectedTariff.devicesLoc
							});
							VpnInProcess.accessPayClick();
						},
						"POST",
						{
							user_id: 395040322,
							tariff_id: VpnInProcess.selectedTariff.tariff_id,
							devices: JSON.stringify(VpnInProcess.devices)
						},
					)
				}
			}
			this.mainButtons.toPay.onclick = () => {
				this.SubmitData();
			}
		},
		createMonthDurationSpoilers() {
			const monthDurationSpoilerBlock = document.querySelector('[data-spoller-tariffs]');
			monthDurationSpoilerBlock.innerHTML = '';
			let isFirstSpoilerActive = false;
			for(var month_duration in VpnInProcess.groupedByMonthDuration) {

				const tariffs = VpnInProcess.groupedByMonthDuration[month_duration];

				const monthDurationSpoiler = document.createElement("div");
				monthDurationSpoiler.classList.add("spollers__item");
				monthDurationSpoiler.classList.add("tariffs__item");
				monthDurationSpoilerBlock.appendChild(monthDurationSpoiler);

				const monthDurationSpoilerBtn = document.createElement("button");
				monthDurationSpoilerBtn.setAttribute('data-spoller', '');
				monthDurationSpoilerBtn.setAttribute('type', 'button');
				monthDurationSpoilerBtn.classList.add("spollers__title");
				monthDurationSpoilerBtn.classList.add("tariffs__title");
				monthDurationSpoilerBtn.innerHTML = `
					${month_duration} месяцев
				`;
				if (!isFirstSpoilerActive) {
					monthDurationSpoilerBtn.classList.add("_spoller-active");
					isFirstSpoilerActive = true
				}
				monthDurationSpoiler.appendChild(monthDurationSpoilerBtn);


				const monthDurationSpoilerBody = document.createElement("div");
				monthDurationSpoilerBody.classList.add("spollers__body");
				monthDurationSpoiler.appendChild(monthDurationSpoilerBody);

				const monthDurationSpoilerContainer = document.createElement("div");
				monthDurationSpoilerContainer.classList.add("info-tariffs");
				monthDurationSpoilerBody.appendChild(monthDurationSpoilerContainer);

				for (let j = 0; j < tariffs.length; j++) {
					const vpnTariff = this.createVPNTariff(
						{
							tariff_id: tariffs[j].tariff_id,
							monthDuration: tariffs[j].monthDuration,
							devicesNumber: tariffs[j].devices_number,
							price: tariffs[j].result_price,
							currency: tariffs[j].currency,
							discount: tariffs[j].discount,
							monthLoc: tariffs[j].monthLoc,
							devicesLoc: tariffs[j].devicesLoc
						})
					monthDurationSpoilerContainer.appendChild(vpnTariff);
				}
			}
			vpnFunctions.spollers();
		},
		createVPNTariff({tariff_id, monthDuration, devicesNumber, price, currency, discount, monthLoc, devicesLoc}) {
			const vpnTariff = document.createElement("div");
			vpnTariff.classList.add("info-tariffs__item");
			vpnTariff.innerHTML = `
				<h2 class="mon-count">${monthDuration}</h2>
				<h2 class="mon-text">${monthLoc}</h2>
				<h2 class="subscription">подписки</h2>
				<h3 class="devices-number"><span>${devicesNumber}</span> ${devicesLoc}</h3>
				<h3 class="price">${price} ${currency}</h3>
				<span class="discount">-${discount}%</span>
			`;

			vpnTariff.addEventListener('click', (e) => {
				this.selectedTariff = {
					tariff_id: tariff_id,
					month_duration: monthDuration,
					price: price,
					discount: discount,
					currency: currency,
					devicesNumber: devicesNumber,
					monthLoc: monthLoc,
					devicesLoc: devicesLoc
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
		//===========
		createDeviceSpollers(selectedTariff, spollerContainer, isAddSpoiller) {
			let spolierCounter;

			const selectedValues = selectedTariff;
			const deviceSpoilerBlock = spollerContainer;

			if (isAddSpoiller) {
				spolierCounter = 1;
			} else {
				spolierCounter = selectedValues.devicesNumber;
			}
			for (let i = 0; i < spolierCounter; i++) {
				this.devices.push({
					country_id: '',
					protocol_id: ''
				})

				const deviceEl = document.createElement('div')
				deviceEl.classList.add("devices__item");
				deviceSpoilerBlock.appendChild(deviceEl);

				const deviceSpoilerBtn = document.createElement("button");
				deviceSpoilerBtn.setAttribute('data-spoller', '');
				deviceSpoilerBtn.setAttribute('type', 'button');
				deviceSpoilerBtn.classList.add("spollers__title");
				deviceSpoilerBtn.classList.add("devices__title");
				deviceSpoilerBtn.innerHTML = `
					Устройство ${this.deviceoptionValues.nameAttr}
				`;
				deviceEl.appendChild(deviceSpoilerBtn);

				const deviceSpoilerBody = document.createElement("div");
				deviceSpoilerBody.classList.add("spollers__body");
				deviceSpoilerBody.classList.add("devices__body");
				deviceEl.appendChild(deviceSpoilerBody);

				const devicesDropdown = document.createElement("div");
				devicesDropdown.classList.add("devices__dropdown");
				devicesDropdown.classList.add("closed");
				deviceSpoilerBody.appendChild(devicesDropdown);

				///

				const devicesDropdownButton = document.createElement("h2");
				devicesDropdownButton.classList.add("devices__dropdown-title");
				devicesDropdownButton.setAttribute('value', '');
				devicesDropdownButton.innerHTML = `Выберите страну`;
				devicesDropdown.appendChild(devicesDropdownButton);

				const devicesDropdownList = document.createElement("ul");
				devicesDropdownList.classList.add("devices__dropdown-list");
				devicesDropdown.appendChild(devicesDropdownList);


				const contentOption = document.createElement("div");
				contentOption.classList.add('options');
				contentOption.classList.add('devices__options');
				deviceSpoilerBody.appendChild(contentOption);

				for (let j = 0; j < this.countries.length; j++) {
					devicesDropdownList.appendChild(this.createDeviceContries(devicesDropdown, devicesDropdownButton, j, i));
				}
				for (let k = 0; k < this.protocols.length; k++) {
					contentOption.appendChild(this.createDeviceProtocols(i, k));
				}
				//
				contentOption.querySelectorAll('input').forEach((radio, i) => {
					if (i === 0) {
						radio.setAttribute('checked', '');
						radio.click();
					}
				});
				//
				devicesDropdownButton.onclick = (e) => {
					devicesDropdown.classList.toggle('closed');
				}
				vpnFunctions.spollers();
				this.deviceoptionValues.nameAttr++;
			}
		},
		createDeviceContries(dropdown, elemButton, index, deviceIndex) {
			const country = this.countries[index];
			const devicesDropdownItem = document.createElement("li");
			devicesDropdownItem.classList.add("devices__dropdown-item");
			devicesDropdownItem.setAttribute(DeviceAttribute.Country, country.pkid);
			devicesDropdownItem.innerHTML = `${country.country}`;

			devicesDropdownItem.onclick = (e) => {
				elemButton.innerHTML = `${devicesDropdownItem.innerText}`;
				dropdown.classList.toggle('closed');

				dropdown.querySelector('.devices__dropdown-title').setAttribute('value', elemButton.innerHTML)
				dropdown.querySelector('.devices__dropdown-title').setAttribute(DeviceAttribute.Country, country.pkid)

				// console.log(e.currentTarget.getAttribute('country'));
				// this.devices[deviceIndex].country = elemButton.attributes['country'];
				//console.log(this.devices[deviceIndex].country);
			}
			this.deviceoptionValues.countryValue++;
			return devicesDropdownItem;
		},
		createDeviceProtocols(DeviceSpollerIndex, DeviceProtocolIndex) {
			const protocol = this.protocols[DeviceProtocolIndex];

			const optionProtocol = document.createElement("div");
			optionProtocol.classList.add('options__item');

			optionProtocol.innerHTML = `
				<input hidden id="o_${this.deviceoptionValues.nameAttr}_${this.deviceoptionValues.id}" class="options__input" type="radio" value="r_${DeviceProtocolIndex}_1" name="option${this.deviceoptionValues.nameAttr}">
				<label for="o_${this.deviceoptionValues.nameAttr}_${this.deviceoptionValues.id}" class="options__label">
					<span ${DeviceAttribute.Protocol}="${protocol.pkid}" class="options__text">${protocol.protocol}</span>
				</label>
			`;

			this.deviceoptionValues.id++;
			return optionProtocol;
		},
		//===========
		createPaymentSelection({ monthDuration, price, discount, currency, devicesNumber, monthLoc, devicesLoc }) {
			const PaymentSelectionContainer = document.querySelector('.payment__info-content');
			document.querySelector('.payment__title').innerHTML = `Доступ к VPN на ${monthDuration} ${monthLoc}.`;
			PaymentSelectionContainer.innerHTML = `
				<div class="payment__info">
					<div class="payment__currency">
						<div class="payment__initial">${price} ${currency}</div>
					</div>
					<div class="payment__mon">${monthDuration} ${monthLoc}</div>
					<div class="payment__devices">${devicesNumber} ${devicesLoc}</div>
					<span class="discount">-${discount}%</span>
				</div>
			`;
		},
		//===========
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
				const country_id = deviceitems[i].querySelector('.devices__dropdown-title').getAttribute(DeviceAttribute.Country)
				const optItems = deviceitems[i].querySelectorAll('.options__item')

				for (let j = 0; j < optItems.length; j++) {
					const optItem = optItems[j];

					if (optItem.querySelector('.options__input').checked) {
						let protocolTextEl = optItem.querySelector('.options__text')
						VpnInProcess.devices[i].protocol_id = protocolTextEl.getAttribute(DeviceAttribute.Protocol);
					}
				}
				VpnInProcess.devices[i].country_id = country_id;
			}

		},
		SubmitData() {
			console.log(this.state)
			switch(this.state) {
				case VpnTariffState.ExtendVpnSubscription:
					location.href = this.selectedTariff.freekassaUrl;
					break;

				case VpnTariffState.MakeAnOrder:
					VpnInProcess.apiRequest('subscription/create-subscription/',
					(result) => {
						location.href = result;
					},
					'POST',
					{
						user_id: Telegram.WebApp.initDataUnsafe.user.id,
						tariff_id: VpnInProcess.selectedTariff.tariff_id,
						devices: JSON.stringify(VpnInProcess.devices)
					},
				)
			}
			this.state
			console.log(Telegram.WebApp.initDataUnsafe)
		}
	}

	VpnInProcess.init();

};


