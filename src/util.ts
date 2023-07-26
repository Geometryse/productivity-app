export const format = (x: number, use24HourTime: boolean) => {
	let hh = Math.floor(x / 60) % 24;
	const mm = x % 60;

	let extension = '';
	if (!use24HourTime) {
		if (hh > 12) {
			extension = ' pm';
			hh -= 12;
		} else if (hh === 0) {
			hh = 12;
			extension = ' am';
		} else if (hh === 12) {
			extension = ' pm';
		} else {
			extension = ' am';
		}
	}

	let hhStr = hh.toString();
	let mmStr = mm.toString();

	if (hhStr.length === 1 && use24HourTime) hhStr = '0' + hh;
	if (mmStr.length === 1) mmStr = '0' + mm;

	return `${hhStr}:${mmStr}${extension}`;
};

export const UTCToHours = (utc: number) => new Date(utc).getHours();
export const UTCToMinutes = (utc: number) => new Date(utc).getMinutes();
export const UTCToTotalMinutes = (utc: number) =>
	new Date(utc).getHours() * 60 + new Date(utc).getMinutes();
