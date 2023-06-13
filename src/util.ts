export const format = (x: number) => {
	let hh = new Date(x).getHours().toString();
	let mm = new Date(x).getMinutes().toString();

	if (hh.length === 1) hh = '0' + hh;
	if (mm.length === 1) mm = '0' + mm;

	return hh + ':' + mm;
};
