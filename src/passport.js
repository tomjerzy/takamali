const passport = require('passport')
const User = require ('./models/User')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('./config')

passport.use(
	new JwtStrategy({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: config.authentication.jwtSecret
	}, async function (jwtPayload, done) {
		try {
			const user = await User.findOne({
				where: {
					_id: jwtPayload._id
				}
			})
			if (!user) {
				return done( new Error(), false)
			}
			return done(null, user)
		} catch (e) {
			return done(new Error(), false)
		}
	})
	)
module.exports = null