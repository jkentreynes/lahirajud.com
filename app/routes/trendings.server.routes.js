'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var trendings = require('../../app/controllers/trendings.server.controller');

	// Trendings Routes
	app.route('/trendings')
		.get(trendings.list)
		.post(users.requiresLogin, trendings.create);

	app.route('/trendings/:trendingId')
		.get(trendings.read)
		.put(users.requiresLogin, trendings.hasAuthorization, trendings.update)
		.delete(users.requiresLogin, trendings.hasAuthorization, trendings.delete);

	// Finish by binding the Trending middleware
	app.param('trendingId', trendings.trendingByID);
};
