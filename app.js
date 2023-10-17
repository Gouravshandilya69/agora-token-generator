const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: '.env' });
const express = require("express")
const { RtcTokenBuilder, RtcRole } = require("agora-access-token")
const app = express()



// env stuff
const Port = 8080
const App_id = process.env.App_id
const App_certificate = process.env.App_certificate


//middleware
const nocache = (req, res, next) => {
    res.header('Cache-Control', 'private,no-cache , no-store,must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')
    next()
}


//routes
    app.use('/accessToken', nocache, (req, res, next) => {
        // set response header
        res.header('Access-Control-Allow-Origin', '*')

        //get channel name
      let ChannelName = req.query.Channelname
        if (!ChannelName) {
            ChannelName = "gourav"
            // return res.status(500).json({ 'error': 'Channel is required' })
        }

        //get uid
        let uid = req.query.uid
        if (!uid || uid == '') {
            uid = 0
        }


        //get role
        let role = RtcRole.SUBSCRIBER
        if (req.query.role == 'publisher') {
            role = RtcRole.PUBLISHER
        }


        //get the expire time
        let expireTime = req.query.expireTime
        if (!expireTime || expireTime == '') {
            expireTime = 3600
        }
        else {
            expireTime = parseInt(expireTime, 10)
        }

        //calculate privilege expire time
        const currentTime = Math.floor(Date.now() / 1000)
        const privilegeExpireTime = currentTime + expireTime

        // build the token
        const token = RtcTokenBuilder.buildTokenWithUid(App_id, App_certificate, ChannelName, uid, role, privilegeExpireTime)


        //return the token
        return res.json({ 'token': token })
    })






    // server
app.listen(Port, () => {
    console.log(`the server is running on ${Port}`)
})