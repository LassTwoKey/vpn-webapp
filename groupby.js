const tariffs = [
    {
        month_duration: 12,
		devices_number: 1,
		result_price: 1500,
		currency: "RUB",
		discount: 20
    },
    {
        month_duration: 12,
		devices_number: 1,
		result_price: 1500,
		currency: "RUB",
		discount: 20
    },
    {
        month_duration: 6,
		devices_number: 1,
		result_price: 1500,
		currency: "RUB",
		discount: 20
    },
    {
        month_duration: 6,
		devices_number: 1,
		result_price: 1500,
		currency: "RUB",
		discount: 20
    },
    {
        month_duration: 3,
		devices_number: 1,
		result_price: 1500,
		currency: "RUB",
		discount: 20
    },
    {
        month_duration: 3,
		devices_number: 1,
		result_price: 1500,
		currency: "RUB",
		discount: 20
    },
    {
        month_duration: 3,
		devices_number: 1,
		result_price: 1500,
		currency: "RUB",
		discount: 20
    }
]


var dict = {};
for (let i = 0; i < tariffs.length; i++) {
    dict[tariffs[i].month_duration] = tariffs[i]
}

console.log(dict)