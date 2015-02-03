'use strict';

//Trendings service used to communicate Trendings REST endpoints
angular.module('trendings').factory('Trendings', ['$resource',
	function($resource) {
		return $resource('trendings/:trendingId', { trendingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);