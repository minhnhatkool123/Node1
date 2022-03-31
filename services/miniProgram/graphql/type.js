const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
	type MutationUser {
		login(input: LoginInput!): LoginMessageResponse!
		createAccount(input: NewUserInput!): MessageResponse!
		logout(input: LogoutInput!): MessageResponse!
		sendOtpEmail(input: SendOtpEmailInput!): MessageResponse!
		resetPassword(input: ResetPasswordInput!): MessageResponse!
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
