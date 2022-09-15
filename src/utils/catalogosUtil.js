import URL from 'src/config/baseurl';
import axs from 'src/utils/axs';

export const _getCatalogo = async (cat, arg0) => {
	try {
		let response = await axs.get(URL + '/afp/crm/catalogo/' + cat + (arg0 ? '/' + arg0 : ''));

		if (response && response.status == 200) {
			return response.data;
		}

		console.log('Error consultanto catalogos: ' + cat);
		response && console.log(response);

		return false;
	} catch (e) {
		console.log('Error consultanto catalogos: ' + cat);
		console.log(e);

		return false;
	}
};
