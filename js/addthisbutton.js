var addthis_config = {
	"data_track_clickback":true,
	services_exclude: 'print',
	ui_offset_left: 20
};
var addthis_share = {
	templates: {
		twitter: '{{title}} {{url}} via @developmentdata'
	},
	url_transforms : {
		shorten: {
			twitter: 'bitly'
		}
	},
	shorteners : {
		bitly : {
			login: 'developmentdata',
			apiKey: 'R_65df4849e13bb7bc0d94d7bc159fd451'
		}
	}
};