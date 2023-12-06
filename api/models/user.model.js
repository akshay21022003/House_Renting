import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    favorites:{
      type:Array,
      default:[]
    },
    mobilenumber: {
      type: Number,
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{10}$/.test(v.toString());
        },
        message: 'Mobile number must be 10 digits long'
      }
    }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;

