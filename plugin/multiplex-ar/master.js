(function( root, factory ) {
	// Don't emit events from inside of notes windows
	if ( window.location.search.match( /receiver/gi ) ) { return; }


	if (typeof define === 'function' && define.amd) {
		root.RevealMultiARMaster = factory();
		root.RevealMultiARMaster.initialize();
	} else if( typeof exports === 'object' ) {
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.RevealMultiARMaster = factory();
		root.RevealMultiARMaster.initialize();
	}
}( this, function() {
	var multiplex;
	var socket;

	function post() {
		var messageData = {
			state: Reveal.getState(),
			secret: multiplex.secret,
			socketId: multiplex.id
		};

		socket.emit( 'multiplex-statechanged', messageData );
	};

	function postMap (worldMap) {
		var messageData = {
			map: worldMap,
			secret: multiplex.secret,
			socketId: multiplex.id
		};

		socket.emit( 'multiplex-newmap', messageData );
		console.log("new map, baby!")
	}


	// API
	return {

		initialize: function() {
			multiplex = Reveal.getConfig().multiplex;
			socket = io.connect( multiplex.url );

			// Monitor events that trigger a change in state
			Reveal.addEventListener( 'slidechanged', post );
			Reveal.addEventListener( 'fragmentshown', post );
			Reveal.addEventListener( 'fragmenthidden', post );
			Reveal.addEventListener( 'overviewhidden', post );
			Reveal.addEventListener( 'overviewshown', post );
			Reveal.addEventListener( 'paused', post );
			Reveal.addEventListener( 'resumed', post );
		},

		// TODO: Do these belong in the API?
		postMap: postMap
	};

}));
