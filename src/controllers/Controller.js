const User = require('../models/User');
const Check = require('../models/Check');
const Stock = require('../models/Stock');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Information  = require('../models/Information');
const Follow  = require('../models/Follow');
const Like  = require('../models/Like');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const config = require('../config')
const transporter = nodemailer.createTransport({
  host: 'mail.countieslinked.co.ke',
  service: 'mail.countieslinked.co.ke',
  port: 465,
  secure: true,
  tls: {
    rejectUnauthorized: false
  },
    headers: {
      'priority': 'high'
    },
  auth: {
    user:'mail@countieslinked.co.ke',
    pass: 'mail@tom@2019!!'
  }
});

function jwtSignUser (user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}
var self = module.exports = {
	async register (req, res) {
	    try {
	     var mail = await Check.findOne({ email: req.body.email });
	      if(mail) {
	        res.status(400).send({
	          error: 'This email address or mobile number is already taken'
	        })
	     } else {
	     var code = Math.floor(Math.random() * (99999 - 10000) + 10000)
        // self.putIt(req, res, code)
	      var mailOptions = {
	        from: 'mail@countieslinked.co.ke',
	        to: req.body.email,
	        subject: 'TAKAMALI Ventures',
	        html: `<div>Your confirmation code is<br><h1>${code}</h1></div>`
	      };
        self.putIt(req, res, code)
	     // transporter.sendMail(mailOptions, async function(e, info){
	     //    if (e) {
      //       console.log(e)
	     //      res.status(400).send({
	     //       error: 'Sorry! Something went wrong'
	     //  })
	     //    } else {
	     //      self.putIt(req, res, code)
	     //    }
	     //  });
	     }
	} catch (err) {
   		res.status(400).send({
        error: 'Something went wrong. Please try again'
      })
    }
  },
  
  async putIt(req, res, code) {
    const { email, contact, password } = req.body
    try {
     const r = await Check.create({
        email: email,
        contact: contact,
        code: code,
        created_at: new Date().toISOString(),
        password: require('crypto').createHash('md5').update(password).digest('hex'),
      })
      res.send({email: email, code: code})
    } catch (e) {
        res.status(400).send({
          error: 'Something went wrong. Please try again'
      })
    }
  },
  async fetchStock(req, res) {
    const { id, offset } = req.body
    try {
      const r = await Stock.find({user: id}).limit(30).skip(offset).populate('user')
      res.send(r)
    } catch(err) {
      res.status(500).send({
        error: 'Error fetching user stock'
      })
    }
  },

   async login (req, res) {
    const { password, email } = req.body
    try {
      const r = await Check.findOne({ email: email, password: require('crypto').createHash('md5').update(password).digest('hex')})
      if (!r) {
        res.status(401).send({
          error: 'Wrong password or email address!'
        })
      } else {
        const user = await User.findOne({email: r.email })
        if(user) {
          const userJson = user.toJSON()
          res.send({
            user: userJson,
            token: jwtSignUser(userJson)
        })

        }
      }
    } catch (err) {
      res.status(500).send({
        error: 'Sorry! Something went wrong. Please try again'
        })
    }
  },
  async confirmEmail(req, res){
    const {data, code } = req.body
    try {
      const check = await Check.findOne({email: data.email, code: code});
      if (check) {
        const user = await User.create(data);
	      res.send({
	        user: user.toJSON(),
	        token: jwtSignUser(user.toJSON())
	     })
        await check.updateOne({
          code: null,
          userId: user._id
        });


      } else {
        res.status(400).send({
          error: 'Incorrect code. Please try again'
      })
      }
    } catch(e) {
      console.log(e)
      res.status(400).send({
        error: 'Server error. Please try again'
      })
    } 
  },

	async createStock(req, res) {
    try {
      const r = await Stock.create(req.body)
      res.send(r)
      const followers = await Follow.find({followed: req.body.user})
      followers.map(async(f) => {
        await Notification.create({
          read: false,
          body: `created new ${req.body.category} stock subcategory ${req.body.subcategory} is available for sale`,
          sender: req.body.user,
          item_id: r._id,
          created_at: new Date().toISOString(),
          type: 'stock',
          receiver: f.follower
        })
      })
    } catch (e) {
      res.status(500).send({
        error: 'Sorry! Error creating stock.'
      })
    }
  },

  async editStock(req, res) {
    try {
      await Stock.findOneAndUpdate({_id: req.body._id})
    } catch(e) {
      res.status(500).send({
        error: 'Something went wrong. Please try again'
      })
    }
  },
  async deleteStock(req, res) {
    try {
      await Stock.findOneAndDelete({_id: req.params.id})
    } catch(e) {
      res.status(500).send({
        error: 'Something went wrong. Please try again'
      })
    }
  },
  async createReview(req, res) {
    const { user, review } = req.body
    try {
        const r = await Review.create({
          review: review,
          user: user,
          createdAt: new Date().toISOString()
        })
        res.send(r)
    } catch (e) {
      res.status(500).send({
        error: 'Sorry! Could not create review'
      })
    }
  },
  async removeReview(req, res) {
    try {

    } catch(e) {
      res.status(500).send({
        error: 'Something went wrong. Please try again'
      })
    }
  },
  async fetchReviews(req, res) {
    const { id, offset } = req.body
    try {
      const r = await Review.find({user: id}).skip(Number(offset)).limit(10).populate('user')
      res.send(r)
    } catch(e) {
      res.status(500).send({
        error: 'Something went wrong. Please try again'
      })
    }
  },
  async fetchItems(req, res) {
    const { offset } = req.params.offset
    try {
      const r = await Stock.find().limit(20).skip(Number(offset)).populate('user')
      res.send(r)
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },
  async fetchLikes(req, res) {
    try {
      const r = await Like.find({stockId: req.params.id})
      res.send(r)
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },
  async fetchItem(req, res) {
    try {
      const r = await Stock.findOne({_id: req.params.id}).populate('user')
      const b = await Information.find({stock_id: req.params.id}).populate('user')
      res.send({item: r, info: b})
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },
  async fetchUser(req, res) {
    try {
      const r = await User.findOne({_id: req.params.id})
      res.send(r)
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },
  async fetchNotifications(req, res) {
    const { offset, receiver } = req.body
    try {
      const r = await Notification.find({receiver: receiver}).skip(offset).limit(20).populate('sender')
      res.send(r)
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },
  async fetchFollowers(req, res) {
    try {
      const r = await Follow.find({followed: req.params.id})
      res.send(r)
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },
  async follow(req, res) {
    const {follower, followed } = req.body
    try {
      await Follow.create(req.body)
      res.status(201).end()
      await Notification.create({
        read: false,
        body: 'started following you. ',
        sender: follower,
        item_id: follower,
        created_at: new Date().toISOString(),
        type: 'follow',
        receiver: followed
      })
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },
  async unfollow(req, res) {
    const { followed, follower } = req.body
    try {
      res.status(200).end()
      await Follow.findOneAndDelete({follower: follower, followed: followed})
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },

async fetchConversations(req, res) {
    try {
      const r = await Conversation.find({
        $or: [
          { receiver: req.params.id },
          { sender: req.params.id }
          ]
        }).populate('sender').populate('receiver')
      res.send(r)
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },
async likeStock(req, res) {
    try {
      const r = await Like.create(req.body)
      res.status(201).end()
      await Notification.create({
        read: false,
        body: 'liked your post. ',
        sender: req.body.liker,
        item_id: req.body.stockId,
        type: 'like',
        created_at: new Date().toISOString(),
        receiver: req.body.stock.user._id
      })
    } catch (e) {
      console.log(e)
      res.status(500).send('Error fetching data')
    }
  },
async unlikeStock(req, res) {
    try {
      const r = await Like.findOneAndDelete({stockId: req.body.stockId})
      res.send(r)
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },
  async fetchFav(req, res) {
    try {
      const r = await Like.find({liker: req.params.id})
      res.send(r)
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },
  async updateProfile(req, res) {
    try {
      const r = await User.findOne({_id: req.body._id})
      r.overwrite(req.body)
      await r.save()
      res.send(r.toJSON())
    } catch (e) {
      res.status(500).send('Error fetching data')
    }
  },

  async searchUser (req, res) {
    try {
      const look = req.query.q
    if (look) {
      const r = await User.find({'name': /^look/})
      res.send(r)
    } else {
      res.status(200).end()
    }
    }
    catch (e) {
     res.status(400).send({ error: "Error fetching items" });
    }
  },
  async createInfo(req, res) {
    try {
      await Information.create(req.body)
      res.status(201).end()
    } catch (e) {}
  },
  async fetchMessages(req, res) {
    const { receiver, sender } = req.body
    try {
      const r = await Message.find({
        $or:[
        { receiver: receiver, sender: sender },
        { receiver: sender, sender: receiver }
        ]
      })
    res.send(r)
    } catch (e) {
      
    }
  },
    async sendMessage (req, res) {
      const { body, receiver, sender, conversation_id } = req.body
    try {
      if(conversation_id !== null) {
       const r = await Message.create(req.body)
        res.send(conversation_id)
      } else {
       const c = await Conversation.create({
        sender: req.body.sender,
        created_at: new Date().toISOString(),
        receiver: req.body.receiver
       })
       const r = Message.create({
        conversation_id: c._id,
        body: body,
        sender: sender,
        created_at: new Date().toISOString(),
        receiver: receiver,
        read: false
       })
       res.send(c._id)
      }
    }
    catch (e) {
     res.status(400).send({ error: "Error fetching items" });
    }
  },
  async deleteMessage(req, res) {
    try {
      res.status(200).end()
      await Message.findOneAndDelete({_id: req.params.id})
    } catch (e) {}
  },
  async fetchCountyStock(req, res) {
    const { offset, county } = req.params
      try {
        const r = await Stock.find({county: county}).skip(Number(offset)).limit(20).populate('user')
        res.send(r)
    } catch (e) {console.log('error')}
  },
  async deleteInq(req, res) {
    try {
      await Information.findOneAndDelete({_id: req.params.id})
      res.status(200).end()
    } catch (e) {
      res.status(500).send({
        error: 'Error removing item'
      })
    }
  }
}