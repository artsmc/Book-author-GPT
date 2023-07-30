import { UserModel } from "../models/user.model";


export const validateEmail = (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }
    // check if email is in the UserModel
    UserModel.findOne({ email: email.toLowerCase() }).then(user => {
        if (user) {
          return res.status(400).json({ msg: 'Email already exists' });
        }
        next();
    });
}