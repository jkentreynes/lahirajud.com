'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Trending Schema
 */
var TrendingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Trending name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Trending', TrendingSchema);