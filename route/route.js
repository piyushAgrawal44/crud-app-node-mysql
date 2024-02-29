import express from "express";
import UserController from "../controller/user_controller.js";
import { body } from "express-validator";

const route=express.Router();

route.get('/',(req,res)=>{
    return res.status(201).json({message:"Welcome to Crud App"});
});


// GET /users -> get list of all users
route.get('/users', UserController.fetchAllUser);

// GET /users/:user_id -> get details of specific user by user id
route.get('/users/:user_id', UserController.fetchAllUser);

// POST /users -> create new user 
route.post('/users', [
    body('name', 'Please enter a valid name with at least 3 characters').isLength({ min: 3 }),
    body('email', 'Please enter a valid email').isEmail(),
    body('age', 'Please enter a valid age').isInt({ min: 0 })
], UserController.registerUser);

// PUT /users/:user_id -> edit existing user 
route.put('/users/:user_id', [
    body('name', 'Please enter a valid name with at least 3 characters').isLength({ min: 3 }),
    body('email', 'Please enter a valid email').isEmail(),
    body('age', 'Please enter a valid age').isInt({ min: 0 })
], UserController.fetchAllUser);

// DELETE /users/:user_id -> delete existing user
route.delete('/users/:user_id', UserController.deleteUser);




// delete user
route.post('/delete/user',[
    body('email','Please enter a valid email').isEmail(),
], UserController.deleteUser);




export {route};