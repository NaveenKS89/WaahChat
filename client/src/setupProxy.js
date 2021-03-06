const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function(app){
    app.use(
        ["/api/user","/chat/onlineusers","/userprofilepic", "/api/chat"],
        createProxyMiddleware({
            target: "http://localhost:5000",
        })
    );
};