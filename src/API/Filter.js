async function filter(string) {
	// eslint-disable-next-line no-useless-escape
	string = string.replaceAll("s/eese popc/ild p", "[blocked]").replaceAll("s\/eese popc\/ild p", "[blocked]").replaceAll("s slash eese popc slash ild p", "[blocked]").replaceAll("s\\eese popc\\ild p", "[blocked]");


	return string;
}


module.exports = {
	filter
};