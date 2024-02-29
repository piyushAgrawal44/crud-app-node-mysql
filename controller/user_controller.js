
import { validationResult } from "express-validator";
// import { logger } from '../logger/index.js';

import mysql from "mysql";


// MySQL connection configuration
const connection = mysql.createConnection({
    host: 'localhost', // Change this to your MySQL host
    user: 'root',      // Change this to your MySQL username
    password: '',      // Change this to your MySQL password
    database: 'basic-crud-db' // Change this to your MySQL database name
  });
  
// Connect to MySQL
connection.connect((err) => {
if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
}
console.log('Connected to MySQL as id ' + connection.threadId);
});

// to generate email tokens
function fetchAllUser(req,res) {

    connection.query('SELECT * FROM users', (error, results) => {

        if (error) {
          console.error('Error executing query:', error);
          return res.status(501).json({ success: false, message: "Internal server error", error: error });
        }
        
        // Close the connection if needed
        connection.end();
        return res.status(200).json({ success: true, message: "Data fetched", data: results, error: [] });
    });
    
}


// end point for User Sign Up by POST request /register
const registerUser = async (req, res) => {


    // checking if there any error like short password or wrong email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: "Please fill all the required details correctly !", errors: errors.array() });
    }

    try {
        // Check for duplicate email id
        connection.query("SELECT id FROM users WHERE email='"+req.body.email+"' Limit 1", (error, results) => {

            if (error) {
              console.error('Error executing query:', error);
              return res.status(501).json({ success: false, message: "Internal server error", error: error });
            }

            console.log(results);

            if(results.length>0){
                return res.status(201).json({ success: false, message: "Email already exist.", error: [] });
            }
            
            // Close the connection if needed
            connection.end();

            // start work from here


            return res.status(201).json({ success: true, message: "Account created!" });
            
        });
        
    } catch (error) {
        return res.status(400).json({ success: false, message: "Internal server error", long_message: error.message });
    }
};


// end point for getting Single User details using GET request
const userDetail = (async (req, res) => {
    try {
        const currentDate = new Date();
        const user_id=req.user.id;
        const userDetails = await User.findOne({ _id: user_id }).select({ name: 1, email: 1, currentPlan: 1 });
        let planPurchase={};

        const userLastPlan = await PlanPurchase.findOne({
            user_id: user_id,
            status: 1,
        }).sort({end_date: -1});


        if (userLastPlan) {
            planPurchase=userLastPlan;
        }

        const userActivePlan = await PlanPurchase.findOne({
            user_id: user_id,
            status: 1, // Assuming 1 means active plan
            start_date: { $lte: currentDate }, // Plan starts before or on the provided date
            end_date: { $gte: currentDate }, // Plan ends after or on the provided date
        });

        return res.status(200).json({ success: true, user: userDetails ?? {}, plan_purchase_details: planPurchase ?? {}, activePlan: userActivePlan ?? {} });
    } catch (error) {
        logger.error(JSON.stringify({ file: "user_controller/userDetail", error: error, message: "An error occurred while fetching the userDetails" }));
            
        return res.status(501).json({ success: false, message: "Internal server error"})
    }
});



// end point for delete user
const deleteUser = async (req, res) => {

    // checking if there any error like short password or wrong email
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ success: false, message: "Please fill all the required details correctly !", errors: errors.array() });
    }

    try {
        const email = req.body.email;

        // Find the user by email
        const user = await User.findOne({ email: email });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        // Delete the user from the database
        await User.deleteOne({ email: email });

        return res.status(200).json({ success: true, message: "User deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
    }

}

const UserController = {
    fetchAllUser,
    registerUser,
    deleteUser,
    userDetail,
};

export default UserController;