
import * as app from "./script.js";

//app.startVpnWebApp();



async function callApi(url, assign) {
	// Server data
	let GROUPED_BY_MONTH_DURATION;
	let COUNTRIES;
	let PROTOCOLS;

	try {
		await fetch('http://localhost:5050/groupedbymonth', {})
			.then((response) => response.json())
			.then((data) => {
				GROUPED_BY_MONTH_DURATION = data
			})
		await fetch('http://localhost:5050/countries', {})
			.then((response) => response.json())
			.then((data) => {
				COUNTRIES = data
			})
		await fetch('http://localhost:5050/protocols', {})
			.then((response) => response.json())
			.then((data) => {
				PROTOCOLS = data
			})
	} catch (error) {
		console.log(error);
	}

	app.startVpnWebApp(GROUPED_BY_MONTH_DURATION, COUNTRIES, PROTOCOLS);

}
callApi();


//==SERVER============================


