module.exports = {
    name: 'auth',
    version: 1,
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        test: {
            registry: {
                auth: {
                    name: 'Test',
                    jwtKey: process.env.ACCESS_TOKEN_SECRET
                }
            },
            handler: require('./test.action')
        },
    },

    /**
     * Events
     */
    events: {

    },

    /**
     * Methods
     */
    methods: {

    },

    /**
     * Service created lifecycle event handler
     */
    created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};
