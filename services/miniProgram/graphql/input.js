const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
	input LoginInput {
		email: String!
		password: String!
	}

	input LogoutInput {
		id: Int!
	}

	input SendOtpEmailInput {
		email: String!
	}

	input ResetPasswordInput {
		email: String!
		otp: String!
	}

	input NewUserInput {
		name: String!
		phone: String!
		email: String!
		password: String!
		gender: UserGender!
		avatar: String!
		isAdmin: Boolean
	}
`;
