module.exports = {
	port: process.env.PORT || 3001,
	db: {
		database: process.env.DB_NAME || 'takamali',
		user: process.env.DB_USER || 'mongo',
		password: process.env.DB_PASS || 'kicc@2019!!',
		options: {
			dialect: process.env.DIALECT || 'mongodb',
			host: process.env.HOST || 'localhost',
		}
	},
	authentication: {
		jwtSecret: process.env.JWT_SECRET || 'kicc@2019!!'
	}
}