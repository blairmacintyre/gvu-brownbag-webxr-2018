(function( root, factory ) {
	// Don't emit events from inside of notes windows
	if ( window.location.search.match( /receiver/gi ) ) { return; }


	if (typeof define === 'function' && define.amd) {
		root.RevealMultiARClient = factory();
		root.RevealMultiARClient.initialize();
	} else if( typeof exports === 'object' ) {
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.RevealMultiARClient = factory();
		root.RevealMultiARClient.initialize();
	}
}( this, function() {	var multiplex = Reveal.getConfig().multiplex;
	var multiplex;
	var socketId;
	var socket;

	// API
	return {

		initialize: function() {
			multiplex = Reveal.getConfig().multiplex;
			socketId = multiplex.id;
			socket = io.connect(multiplex.url);
		
			socket.on(multiplex.id, (cmd, data) => {
				// ignore data from sockets that aren't ours
				if (data.socketId !== socketId) { return; }
				if( window.location.host === 'localhost:1947' ) return;
		
				if (cmd === 'multiplex-statechanged') {
					Reveal.setState(data.state);
				} else if (cmd === 'multiplex-newmap') {
					console.log("new map!")
					if (this.setWorldMap) {
						this.setWorldMap(data.map)
					}
				}
			});
		},

		// TODO: Do these belong in the API?
		setWorldMap: null
	};

}));
