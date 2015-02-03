'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Trending = mongoose.model('Trending'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, trending;

/**
 * Trending routes tests
 */
describe('Trending CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Trending
		user.save(function() {
			trending = {
				name: 'Trending Name'
			};

			done();
		});
	});

	it('should be able to save Trending instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trending
				agent.post('/trendings')
					.send(trending)
					.expect(200)
					.end(function(trendingSaveErr, trendingSaveRes) {
						// Handle Trending save error
						if (trendingSaveErr) done(trendingSaveErr);

						// Get a list of Trendings
						agent.get('/trendings')
							.end(function(trendingsGetErr, trendingsGetRes) {
								// Handle Trending save error
								if (trendingsGetErr) done(trendingsGetErr);

								// Get Trendings list
								var trendings = trendingsGetRes.body;

								// Set assertions
								(trendings[0].user._id).should.equal(userId);
								(trendings[0].name).should.match('Trending Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Trending instance if not logged in', function(done) {
		agent.post('/trendings')
			.send(trending)
			.expect(401)
			.end(function(trendingSaveErr, trendingSaveRes) {
				// Call the assertion callback
				done(trendingSaveErr);
			});
	});

	it('should not be able to save Trending instance if no name is provided', function(done) {
		// Invalidate name field
		trending.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trending
				agent.post('/trendings')
					.send(trending)
					.expect(400)
					.end(function(trendingSaveErr, trendingSaveRes) {
						// Set message assertion
						(trendingSaveRes.body.message).should.match('Please fill Trending name');
						
						// Handle Trending save error
						done(trendingSaveErr);
					});
			});
	});

	it('should be able to update Trending instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trending
				agent.post('/trendings')
					.send(trending)
					.expect(200)
					.end(function(trendingSaveErr, trendingSaveRes) {
						// Handle Trending save error
						if (trendingSaveErr) done(trendingSaveErr);

						// Update Trending name
						trending.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Trending
						agent.put('/trendings/' + trendingSaveRes.body._id)
							.send(trending)
							.expect(200)
							.end(function(trendingUpdateErr, trendingUpdateRes) {
								// Handle Trending update error
								if (trendingUpdateErr) done(trendingUpdateErr);

								// Set assertions
								(trendingUpdateRes.body._id).should.equal(trendingSaveRes.body._id);
								(trendingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Trendings if not signed in', function(done) {
		// Create new Trending model instance
		var trendingObj = new Trending(trending);

		// Save the Trending
		trendingObj.save(function() {
			// Request Trendings
			request(app).get('/trendings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Trending if not signed in', function(done) {
		// Create new Trending model instance
		var trendingObj = new Trending(trending);

		// Save the Trending
		trendingObj.save(function() {
			request(app).get('/trendings/' + trendingObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', trending.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Trending instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trending
				agent.post('/trendings')
					.send(trending)
					.expect(200)
					.end(function(trendingSaveErr, trendingSaveRes) {
						// Handle Trending save error
						if (trendingSaveErr) done(trendingSaveErr);

						// Delete existing Trending
						agent.delete('/trendings/' + trendingSaveRes.body._id)
							.send(trending)
							.expect(200)
							.end(function(trendingDeleteErr, trendingDeleteRes) {
								// Handle Trending error error
								if (trendingDeleteErr) done(trendingDeleteErr);

								// Set assertions
								(trendingDeleteRes.body._id).should.equal(trendingSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Trending instance if not signed in', function(done) {
		// Set Trending user 
		trending.user = user;

		// Create new Trending model instance
		var trendingObj = new Trending(trending);

		// Save the Trending
		trendingObj.save(function() {
			// Try deleting Trending
			request(app).delete('/trendings/' + trendingObj._id)
			.expect(401)
			.end(function(trendingDeleteErr, trendingDeleteRes) {
				// Set message assertion
				(trendingDeleteRes.body.message).should.match('User is not logged in');

				// Handle Trending error error
				done(trendingDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Trending.remove().exec();
		done();
	});
});