const Joi = require('joi')

module.exports = {
	register (req, res, next) {
		const schema = {
			name: Joi.string(),
			email: Joi.string().email({ minDomainAtoms: 2 }).required(),
			CountyId: Joi.number(),
			contact: Joi.number(),
			password: Joi.string().min(6).required().regex(
				new RegExp('^[a-zA-Z0-9]{8,32}$')
			)
		}

		const {error, value} = Joi.validate(req.body, schema)
		if (error) {
			switch (error.details[0].context.key) {
				case 'email':
				res.status(400).send({
					error: 'Provide a valid email address'
				})
				break
				case 'password':
				res.status(400).send({
					error: 'Password should be more than 6 characters'
				})
				break
				case 'name':
				res.status(400).send({
					error: 'Name is invalid'
				})
				break
				case 'contact': 
				res.status(500).send({
					error: 'Provide a valid phone number'
				})
				default:
				res.status(500).send({
					error: 'Sorry! Registration could not be completed.'
				})
			}
		} else {
		next()	
		}
	}
}