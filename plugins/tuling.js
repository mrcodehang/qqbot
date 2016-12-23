// This module is written by mrcode
// 2016年12月24日03:32:44


(function() {

    const request = require('request')
    const config = require('../config')

    module.exports = function(content, send, robot, message) {
        if (content.toLowerCase() === 'hello') {
            send(`${message.from_user.nick} hello, 你只要说小萌姬，我就能收到你的消息啦!`)
        } else {
            if (content.match(`@${config.nickname}`)) {
                request({
                    method: 'POST',
                    uri: 'http://www.tuling123.com/openapi/api',
                    form: {
                        key: config.api_key,
                        info: content,
                        userid: message.from_user.account
                    }
                }, function(error, response, body) {
                    if (error) {
                        console.log(error)
                        send('小萌姬陷入死循环了， 电路板短路了～')
                        return
                    } else {
                        const data = JSON.parse(body)
                        let reply = message.type === 'group_message' ? `@${message.from_user.nick} ` : ''

                        switch (data.code) {
                            case 100000:
                                reply += data.text
                                break
                            case 200000:
                                reply += `${data.text}。 这是你要的链接:${data.url}`
                                break
                            case 308000:
                                reply += `已帮你找到菜谱信息。 您需要${data.info}。这里是相关链接${data.detailurl}。`
                                break
                        }

                        send(reply)
                    }
                })
            }
        }
    }
}).call(this)