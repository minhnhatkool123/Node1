const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
	type MutationNode1 {
		login(input: LoginInfo!): LoginMessageResponse!
		createAccount(input: NewUser!): MessageResponse!
		logout(input: LogoutInfo!): MessageResponse!
		sendOtpEmail(input: SendOtpEmailInfo!): MessageResponse!
		resetPassword(input: ResetPasswordInfo!): MessageResponse!
	}

	type QueryNodeUser {
		_: String
	}

	type MessageResponse {
		code: Int
		message: String
	}

	type LoginMessageResponse {
		code: Int
		message: String
		accessToken: String
	}
`;
