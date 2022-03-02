const _ = require("lodash");

const MeAPI = require("../../serviceDependencies/MEAPI");

module.exports = {
	name: "MiniProgram.rest",

	version: 1,

	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		logout: {
			rest: {
				method: "POST",
				fullPath: "/v1/External/MiniProgram/Logout",
				auth: false,
			},
			params: {
				body: {
					$$type: "object",
					id: "number",
				},
			},
			handler: require("./actions/logout.rest.action"),
		},
		resetPassword: {
			rest: {
				method: "POST",
				fullPath: "/v1/External/MiniProgram/ResetPassword",
				auth: {
					strategies: ["Test"],
					mode: "otp", // 'required', 'optional', 'try','otp'
				},
			},
			params: {
				body: {
					$$type: "object",
					otp: "string",
				},
			},
			handler: require("./actions/resetPassword.action"),
		},
		sendOtpEmail: {
			rest: {
				method: "POST",
				fullPath: "/v1/External/MiniProgram/SendOtpEmail",
				auth: false,
			},
			params: {
				body: {
					$$type: "object",
					email: { type: "email" },
				},
			},
			handler: require("./actions/sendOtpEmail.action"),
		},
		login: {
			rest: {
				method: "POST",
				fullPath: "/v1/External/MiniProgram/Login",
				auth: false,
			},
			params: {
				body: {
					$$type: "object",
					email: { type: "email" },
					password: "string",
				},
			},
			handler: require("./actions/login.rest.action"),
		},
		createAccount: {
			rest: {
				method: "POST",
				fullPath: "/v1/External/MiniProgram/CreateAccount",
				auth: false,
			},
			params: {
				body: {
					$$type: "object",
					fullName: "string",
					phone: "string",
					email: { type: "email" },
					password: "string",
					gender: "string",
					avatar: "string",
				},
			},
			handler: require("./actions/registerAccount.rest.action"),
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {
		checkPhone: require("./methods/checkPhone.method"),
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		const url = process.env.FE_URL;
		const isSecurity = process.env.FE_SECURITY === "true";
		const privateKey = process.env.FE_PRIVATEKEY;
		const publicKey = process.env.FE_PUBLICKEY;

		this.historyService = new MeAPI({
			url,
			publicKey,
			privateKey,
			isSecurity,
			"x-api-client": "app",
		});
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
