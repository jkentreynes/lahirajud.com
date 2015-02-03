'use strict';

// Configuring the Articles module
angular.module('trendings').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Trendings', 'trendings', 'dropdown', '/trendings(/create)?');
		Menus.addSubMenuItem('topbar', 'trendings', 'List Trendings', 'trendings');
		Menus.addSubMenuItem('topbar', 'trendings', 'New Trending', 'trendings/create');
	}
]);