'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Trending = mongoose.model('Trending'),
	_ = require('lodash');

/**
 * Create a Trending
 */
exports.create = function(req, res) {
	var trending = new Trending(req.body);
	trending.user = req.user;

	trending.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trending);
		}
	});
};

/**
 * Show the current Trending
 */
exports.read = function(req, res) {
	res.jsonp(req.trending);
};

/**
 * Update a Trending
 */
exports.update = function(req, res) {
	var trending = req.trending ;

	trending = _.extend(trending , req.body);

	trending.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trending);
		}
	});
};

/**
 * Delete an Trending
 */
exports.delete = function(req, res) {
	var trending = req.trending ;

	trending.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trending);
		}
	});
};

/**
 * List of Trendings
 */
exports.list = function(req, res) { 
	Trending.find().sort('-created').populate('user', 'displayName').exec(function(err, trendings) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trendings);
		}
	});
};

/**
 * Trending middleware
 */
exports.trendingByID = function(req, res, next, id) { 
	Trending.findById(id).populate('user', 'displayName').exec(function(err, trending) {
		if (err) return next(err);
		if (! trending) return next(new Error('Failed to load Trending ' + id));
		req.trending = trending ;
		next();
	});
};

/**
 * Trending authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.trending.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
