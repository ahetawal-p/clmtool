module.exports = {

    databaseURL: process.env.DATABASE_URL || "postgres://localhost:5432/wellness",

    
    email_sender_id: process.env.email_sender_id,
    email_sender_pass: process.env.email_sender_pass


};