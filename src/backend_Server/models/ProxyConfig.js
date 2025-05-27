const mongoose = require('mongoose');

const ProxyConfigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  routes: [{
    path:{

    },
    targetServers:{

    },
    health:{

    },
  }],
});
