const mongoose =  require("mongoose");

const Old_Flow = mongoose.model("Old_Flow", {
  total: {
    type: Number
  },
  date: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

exports.Old_Flow = Old_Flow;