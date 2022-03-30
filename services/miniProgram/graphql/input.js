const gql = require("moleculer-apollo-server").moleculerGql;

module.exports = gql`
	input LoginInfo {
		email: String!
		password: String!
	}

	input LogoutInfo {
		id: Int!
	}

	input SendOtpEmailInfo {
		email: String!
	}

	input ResetPasswordInfo {
		email: String!
		otp: String!
	}

	input NewUser {
		name: String!
		phone: String!
		email: String!
		password: String!
		gender: UserGender!
		avatar: String!
	}
`;
