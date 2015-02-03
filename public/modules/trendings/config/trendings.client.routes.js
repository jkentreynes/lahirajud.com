'use strict';

//Setting up route
angular.module('trendings').config(['$stateProvider',
	function($stateProvider) {
		// Trendings state routing
		$stateProvider.
		state('listTrendings', {
			url: '/trendings',
			templateUrl: 'modules/trendings/views/list-trendings.client.view.html'
		}).
		state('createTrending', {
			url: '/trendings/create',
			templateUrl: 'modules/trendings/views/create-trending.client.view.html'
		}).
		state('viewTrending', {
			url: '/trendings/:trendingId',
			templateUrl: 'modules/trendings/views/view-trending.client.view.html'
		}).
		state('editTrending', {
			url: '/trendings/:trendingId/edit',
			templateUrl: 'modules/trendings/views/edit-trending.client.view.html'
		});
	}
]);