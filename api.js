// api.js
const express = require('express');
const User = require('./schema'); 
const app = express.Router();

app.post('/create', async (req, res) => {
  const { name, email, phoneNumber, accountNumber } = req.body;

  if (!name || !email || !phoneNumber || !accountNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone number already exists' });
    }

    const user = new User({
      name,
      email,
      phoneNumber,
      accountNumber,
    });

    await user.save(); 
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});

app.get('/userbalance/:id', async (req, res) => {
    try {
      const id = req.params.id; 
      if (!id ) {
        return res.status(400).json({
          success: false,
          message: "Invalid or missing ID format",
        });
      }
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "User balance retrieved successfully",
        accountBalance: user.accountBalance,
      });
    } catch (error) {
      console.log("Error fetching user balance:", error);
    }
  });
  

  app.post('/transferamount/:id',async(req,res)=>{
            try{
                const id=req.params.id;
                const {amount,accountNumber}=req.body;
                if(!id){
                    return res.status(404).json({
                        success:false,
                        message:"no user found"
                    });
                }
                const sender=await User.findById(id);
                const receiver=await User.findOne({accountNumber});
                if(!receiver){
                    return res.status(300).json({
                        success:false,
                        message:"No user with this account number found"
                    });
                }
                if(sender.accountBalance<amount){
                    return res.status(500).json({
                        success:false,
                        message:"insufficient funds to transfer"
                    });
                }
                if(sender.accountBalance>=amount){
                    sender.accountBalance=sender.accountBalance-amount;
                    receiver.accountBalance=receiver.accountBalance+amount;
                    await sender.save();
                    await receiver.save();

                    return res.status(200).json({
                        success:true,
                        message:"amount transfered successfully"
                    });
                }

            }catch(error){
                console.log(error);
            }
  });

  app.delete('/deleteaccount/:id', async (req, res) => {
    try {
      const id = req.params.id; 
      const { targetid } = req.body; 
  
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Requesting user ID is required",
        });
      }
  
      if (!targetid) {
        return res.status(400).json({
          success: false,
          message: "Target user ID to delete is required",
        });
      }
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No requesting user found",
        });
      }
  
      const victim = await User.findById(targetid);
      if (!victim) {
        return res.status(404).json({
          success: false,
          message: "No user found to delete",
        });
      }
  
      if (user.role === 'employee') {

        await User.findByIdAndDelete(targetid);
  
        return res.status(200).json({
          success: true,
          message: "User has been deleted successfully",
        });
      } else {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to delete this user",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
  

  app.post('/change_role/:id', async (req, res) => {
    try {
      const id = req.params.id; 
      const { changeid, role } = req.body; 
  
      if (!id) {
        return res.status(400).json({ success: false, message: "ID is required" });
      }
      if (!changeid || !role) {
        return res.status(400).json({ success: false, message: "changeid and role are required" });
      }
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found corresponding to given ID",
        });
      }
  
      if (user.role !== "employee") {
        return res.status(403).json({
          success: false,
          message: "Only employees can change roles",
        });
      }
  
      const changingUser = await User.findOneAndUpdate(
        { _id: changeid }, 
        { role },
        { new: true } 
      );
  
      if (!changingUser) {
        return res.status(404).json({
          success: false,
          message: "No user found with the given changeid",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Role changed successfully",
        data: changingUser,
      });
    } catch (error) {
      console.log(error);
    }
  });
  
  
module.exports = app;
