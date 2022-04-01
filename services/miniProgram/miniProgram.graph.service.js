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
			handler: require("./actions/createAccount.action"),
		},
		login: {
			handler: require("./actions/login.action"),
		},
		logout: {
			handler: require("./actions/logout.action"),
		},
		sendOtpEmail: {
			handler: require("./actions/sendOtpEmail.action"),
		},
		resetPassword: {
			handler: require("./actions/resetPassword.action"),
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
