'use strict';

(function() {
	// Trendings Controller Spec
	describe('Trendings Controller Tests', function() {
		// Initialize global variables
		var TrendingsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Trendings controller.
			TrendingsController = $controller('TrendingsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Trending object fetched from XHR', inject(function(Trendings) {
			// Create sample Trending using the Trendings service
			var sampleTrending = new Trendings({
				name: 'New Trending'
			});

			// Create a sample Trendings array that includes the new Trending
			var sampleTrendings = [sampleTrending];

			// Set GET response
			$httpBackend.expectGET('trendings').respond(sampleTrendings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trendings).toEqualData(sampleTrendings);
		}));

		it('$scope.findOne() should create an array with one Trending object fetched from XHR using a trendingId URL parameter', inject(function(Trendings) {
			// Define a sample Trending object
			var sampleTrending = new Trendings({
				name: 'New Trending'
			});

			// Set the URL parameter
			$stateParams.trendingId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/trendings\/([0-9a-fA-F]{24})$/).respond(sampleTrending);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.trending).toEqualData(sampleTrending);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Trendings) {
			// Create a sample Trending object
			var sampleTrendingPostData = new Trendings({
				name: 'New Trending'
			});

			// Create a sample Trending response
			var sampleTrendingResponse = new Trendings({
				_id: '525cf20451979dea2c000001',
				name: 'New Trending'
			});

			// Fixture mock form input values
			scope.name = 'New Trending';

			// Set POST response
			$httpBackend.expectPOST('trendings', sampleTrendingPostData).respond(sampleTrendingResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Trending was created
			expect($location.path()).toBe('/trendings/' + sampleTrendingResponse._id);
		}));

		it('$scope.update() should update a valid Trending', inject(function(Trendings) {
			// Define a sample Trending put data
			var sampleTrendingPutData = new Trendings({
				_id: '525cf20451979dea2c000001',
				name: 'New Trending'
			});

			// Mock Trending in scope
			scope.trending = sampleTrendingPutData;

			// Set PUT response
			$httpBackend.expectPUT(/trendings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/trendings/' + sampleTrendingPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid trendingId and remove the Trending from the scope', inject(function(Trendings) {
			// Create new Trending object
			var sampleTrending = new Trendings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Trendings array and include the Trending
			scope.trendings = [sampleTrending];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/trendings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTrending);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.trendings.length).toBe(0);
		}));
	});
}());