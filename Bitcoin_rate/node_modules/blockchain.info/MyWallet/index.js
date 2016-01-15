'use strict';

var API 			= require('../api')
 	, endpoints	= require('./endpoints')
	, api 			= new API('https://blockchain.info', endpoints);

function MyWallet(guid, password, options) {
  options   = options || {};
  this.guid = guid;
	this.getParams = function () {
		return {
			password				: password,
			second_password	: options.secondPassword,
			api_code				: options.apiCode
		};
	};
	return this;
}

MyWallet.prototype.send = function (address, amount, options) {
	options = options || {};
	var params = this.getParams();
	params.address 	= address;
	params.amount		= amount;
	params.from			= options.from;
	params.fee			= options.fee;
	params.note 		= options.note;
	return api.post('payment', { guid: this.guid }, params);
};

MyWallet.prototype.sendMany = function (recipients, options) {
	options = options || {};
	var params = this.getParams();
	params.recipients	= JSON.stringify(recipients);
	params.from				= options.from;
	params.fee				= options.fee;
	params.note 			= options.note;
	return api.post('sendmany', { guid: this.guid }, params);
};

MyWallet.prototype.getBalance = function () {
	var params = this.getParams();
	return api.post('balance', { guid: this.guid }, params);
};

MyWallet.prototype.listAddresses = function () {
	var params = this.getParams();
	return api.post('list', { guid: this.guid }, params);
};

MyWallet.prototype.getAddress = function (address, options) {
	options = options || {};
	var params = this.getParams();
	params.address 				= address;
	params.confirmations	= options.confirmations || 6;
	return api.post('addrBalance', { guid: this.guid }, params);
};

MyWallet.prototype.newAddress = function (options) {
	options = options || {};
	var params = this.getParams();
	params.label = options.label;
	return api.post('newAddress', { guid: this.guid }, params);
};

MyWallet.prototype.archiveAddress = function (address) {
	var params = this.getParams();
	params.address = address;
	return api.post('archive', { guid: this.guid }, params);
};

MyWallet.prototype.unarchiveAddress = function (address) {
	var params = this.getParams();
	params.address = address;
	return api.post('unarchive', { guid: this.guid }, params);
};

MyWallet.prototype.consolidate = function (options) {
	options = options || {};
	var params = this.getParams();
	params.days = options.days || 60;
	return api.post('consolidate', { guid: this.guid }, params);
};

MyWallet.create = function (password, apiCode, options) {
	options = options || {};
	var params = {
		password: password,
		api_code:	apiCode,
		priv: 		options.priv,
		label:		options.label,
		email:		options.email
	};
	return api.post('create', {}, params).then(function (response) {
		var walletOptions = { apiCode: apiCode };
		return new MyWallet(response.guid, password, walletOptions);
	});
};

module.exports = MyWallet;
