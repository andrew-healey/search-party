  const bcrypt = require("bcrypt");
  const mongoose = require("mongoose");
  const saltshaker = require("randomstring").generate;
  const jwt = require("jsonwebtoken");

  require("dotenv").config();
  const privateKey = saltshaker();

  mongoose.connect(process.env.DATABASE.replace(/<password>/, process.env.PASSWORD), {
    useNewUrlParser: true
  });
  const db = mongoose.connection;

  //Model declaration go here
  let User;

  const {
    ObjectId
  } = mongoose.Schema.Types;
  //Schema initializations go here
  const users = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  snipIds: [{
    type: ObjectId,
    required: true,
    ref: 'User',
  }],
  });
  });

  users.statics.create = async function({
    username,
    password
  }) {
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
    if (await User.findOne({
        username
      })) throw "User already exists";
    const user = new User({
      username,
      password: hashPassword
    });
    await user.save();
    return user;
  };

  users.statics.validate = async function({
    username,
    password
  }) {
    const userAccount = await User.findOne({
      username
    });
    if (!userAccount) throw "User not found";
    if (await bcrypt.compare(password, userAccount.password))
      return true;
    throw "Invalid password";
  };

  users.statics.genToken = function({
    username
  }) {
    return new Promise((resolve, reject) => {
      jwt.sign({
        username
      }, privateKey, {
        expiresIn: '2h'
      }, function(err, token) {
        return err ? reject(err) : resolve(token);
      });
    });
  };

  const snips = new mongoose.Model({
    id: {
      type: String,
      required: true,
      unique: true,
      dropDups: true,
    },
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
      ref: 'User',
    },
    editorNames: [{
      type: String,
      required: true,
      ref: 'User',
    }],
    readerNames: [{
      type: String,
      required: true,
      ref: 'User',
    }],
    public: {
      type: Boolean,
      required: true,
    },
  });

  const roleToLevel = {
    "read": 1,
    "write": 2,
    "own": 3,
  };
  const highestLevel = Math.max(Object.values(roleToLevel));
  //Switch all keys and values in roleToLevel
  const levelToRole = Object.keys(roleToLevel).filter((obj, next) => ({ ...obj,
    [roleToLevel[next]]: next
  });

  snips.methods.userHasRole = function({
    role,
    username
  }) {
    const authorizationLevel = roleToLevel[role];
    if (!authorizationLevel) throw "Unknown role";
    const isAuthorized = false;
    for (let i = authorizationLevel; i < highestLevel && !isAuthorized; i++)
      isAuthorized = isAuthorized || this[levelToRole[i]].includes(username);
  }

  db.on("error", err => reject(err)); db.on("open", () => {
    console.log("Connected");

    //Model initializations go here
    User = mongoose.model('User', users);
    Snip = mongoose.model('Snip', snips);

    resolve({
      models: {
        //Models go here
        User,
        Snip,
      },
      privateKey,
    });

  });
  });
