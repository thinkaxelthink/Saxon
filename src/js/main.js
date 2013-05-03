require.config({
	baseUrl: '/static/js',
	paths: {
		'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min',
		'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
		'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
		'localStorage': '//cdnjs.cloudflare.com/ajax/libs/backbone-localstorage.js/1.1.0/backbone.localStorage-min'
	},
	urlArgs: environment.debug ? "bust=" + (new Date()).getTime() : null
});

require(['require', 'jquery', 'libs/events', 'underscore', 'localStorage', 'plugins'], function ( r , $ , Events  ) {

	Events.subscribe('MOUSE_GENERATOR_READY', onGeneratorReady);

	require(['mouseGenerator', 'ui'], onUIJSLoaded);

});

function onGeneratorReady()
{
	log('onGeneratorReady');
}

function onUIJSLoaded ( MouseGen, ui ) {
	log('loaded ui js', MouseGen, ui);
}
