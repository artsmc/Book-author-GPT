import Mailgun = require('mailgun-js');
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { userCreateController } from "./user/user.create.controller";
import { UtilController } from './util.controller';
import { UserModel } from '../models/user.model';
import { emailController } from './email.controller';
export const mailgun = new Mailgun({ apiKey: process.env.MG_API_KEY, domain: process.env.MG_DOMAIN });
import { jwtSecret } from '../_config/config';

class AuthController extends UtilController {
    constructor() {
        super();
    }
    public async createUser(userData: {full_name?: string; email: string; ip?: any; user_agent?: any; referral?:string;password:string;}): Promise<{}> {
      return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            console.log({ err });
            reject(err);
          }
          bcrypt.hash(userData.password, salt, (error, hash) => {
            const { password } = userData;
            userData.password = hash; 
            // Store hash in your password DB.
            const state = new UserModel(userData);
            state.save().then((user) => {
              emailController.sendMessage('PodTitle-ConfirmEmail', user.email, 'PodTitle-ConfirmEmail', {});
              jwt.sign({ user }, jwtSecret, { expiresIn: '7d' }, (err, token) => {
                if (err) {
                  console.log({ err });
                  reject(err);
                }
                resolve({ ...user.toObject(), token });
              });
            }).catch(err => {
              console.log({ err });
              reject(err);
            });
            if (error) {
              console.log({ error });
              reject(err);
            }
          });
        });
      });
    }
    public async loginUser(userData: {email: string; password:string;}): Promise<{}> {
      return new Promise((resolve, reject) => {
        UserModel.findOne({ email: userData.email }).then((user: any) => {
          if (!user) {
            reject('User not found');
          }
          bcrypt.compare(userData.password, user.password).then((isMatch) => {
            if (isMatch) {
              jwt.sign({ user }, jwtSecret, { expiresIn: '7d' }, (err, token) => {
                if (err) {
                  console.log({ err });
                  reject(err);
                }
                resolve({ ...user.toObject(), token });
              });
            } else {
              reject('Password incorrect');
            }
          });
        });
      });
    }
    public async reissueToken(userData: {email: string; password:string;}): Promise<{}> {
      return new Promise((resolve, reject) => {
        UserModel.findOne({ email: userData.email }).then((user: any) => {
          if (!user) {
            reject('User not found');
          }
          jwt.sign({ user }, jwtSecret, { expiresIn: '7d' }, (err, token) => {
            if (err) {
              console.log({ err });
              reject(err);
            }
            resolve({ token });
          });
        });
      });
    }
    public async changePassword(userData: {user_id: string; password:string;}): Promise<{}> {
      return new Promise((resolve, reject) => {
        UserModel.findOne({ _id: userData.user_id }).then((user: any) => {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) {
              console.log({ err });
              reject(err);
            }
            bcrypt.hash(userData.password, salt, (error, hash) => {
              const { password } = userData;
              user.password = hash; 
              // Store hash in your password DB.
              user.save().then((user) => {
                emailController.sendMessage('PhoneAngel-Password', user.email, 'PhoneAngel-Password', {});
                jwt.sign({ user }, jwtSecret, { expiresIn: '7d' }, (err, token) => {
                  if (err) {
                    console.log({ err });
                    reject(err);
                  }
                  resolve({ ...user.toObject(), token });
                });
              }).catch(err => {
                console.log({ err });
                reject(err);
              });
              if (error) {
                console.log({ error });
                reject(err);
              }
            });
          });
        });
      });
    }
}
export const authController = new AuthController();