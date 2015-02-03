'use strict';

// Trendings controller
angular.module('trendings').controller('TrendingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trendings',
	function($scope, $stateParams, $location, Authentication, Trendings) {
		$scope.authentication = Authentication;

		// Create new Trending
		$scope.create = function() {
			// Create new Trending object
			var trending = new Trendings ({
				name: this.name
			});

			// Redirect after save
			trending.$save(function(response) {
				$location.path('trendings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Trending
		$scope.remove = function(trending) {
			if ( trending ) { 
				trending.$remove();

				for (var i in $scope.trendings) {
					if ($scope.trendings [i] === trending) {
						$scope.trendings.splice(i, 1);
					}
				}
			} else {
				$scope.trending.$remove(function() {
					$location.path('trendings');
				});
			}
		};

		// Update existing Trending
		$scope.update = function() {
			var trending = $scope.trending;

			trending.$update(function() {
				$location.path('trendings/' + trending._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Trendings
		$scope.find = function() {
			$scope.trendings = Trendings.query();
		};

		// Find existing Trending
		$scope.findOne = function() {
			$scope.trending = Trendings.get({ 
				trendingId: $stateParams.trendingId
			});
		};
	}
]);