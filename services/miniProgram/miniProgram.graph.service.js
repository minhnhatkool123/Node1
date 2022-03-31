module.exports = {
	name: "MiniProgram.graph",

	version: 1,

	mixins: [],

	/**
	 * Settings
	 */
	settings: {
		graphql: {
			type: require("./graphql/type"),
			input: require("./graphql/input"),
			enum: require("./graphql/enum"),
			resolvers: {
				MutationUser: {
					login: {
						action: "v1.MiniProgram.graph.login",
					},
					createAccount: {
						action: "v1.MiniProgram.graph.createAccount",
					},
					logout: {
						action: "v1.MiniProgram.graph.logout",
					},
					sendOtpEmail: {
						action: "v1.MiniProgram.graph.sendOtpEmail",
					},
					resetPassword: {
						action: "v1.MiniProgram.graph.resetPassword",
					},
				},
			},
		},
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		createAccount: {
			params: {
				input: {
					$$type: "object",
					name: "string",
					phone: "string",
					email: { type: "email" },
					password: "string",
					gender: "string",
					avatar: "string",
					isAdmin: "boolean|optional",
				},
			},
			handler: require("./actions/createAccount.graph.action"),
		},
		login: {
			params: {
				input: {
					$$type: "object",
					email: "string",
					password: "string",
				},
			},
			handler: require("./actions/login.graph.action"),
		},
		logout: {
			params: {
				input: {
					$$type: "object",
					id: "number",
				},
			},
			handler: require("./actions/logout.graph.action"),
		},
		sendOtpEmail: {
			params: {
				input: {
					$$type: "object",
					email: { type: "email" },
				},
			},
			handler: require("./actions/sendOtpEmail.graph.action"),
		},
		resetPassword: {
			params: {
				input: {
					$$type: "object",
					otp: "string",
					email: { type: "email" },
				},
			},
			handler: require("./actions/resetPassword.graph.action"),
		},
		graphqlUser: {
			graphql: {
				query: "QueryUser: String",
				mutation: "MutationUser: MutationUser",
			},
			handler(ctx) {
				return true;
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
