// This module is written by mrcode
// 2016年12月24日03:32:44


(function() {

  const request = require('request')
  const config = require('../config')

  function handle(content, send, robot, message) {
    request({
      method: 'POST',
      uri: 'http://www.tuling123.com/openapi/api',
      form: {
        key: config.api_key,
        info: content,
        userid: message.from_user.nick
      }
    }, function(error, response, body) {
      if (error) {
        console.log(error)
        send('小萌姬陷入死循环了， 电路板短路了～')
        return
      } else {
        const data = JSON.parse(body)
        let reply = `@${message.from_user.nick} `
        console.log(`nick=${message.from_user.nick}`)
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
          case 302000:
            const newsList = data.list
            reply += newsList.reduce((previous, currentValue, index) => {
                if (index < 5)
                  return previous + ` 文章:${currentValue.article}\n 来源:${currentValue.source}\n 链接: ${currentValue.detailurl}`
                else return previous
            }, `一共找到了${newsList.length > 5? 5:newsList.length}条新闻\n`)
          
            // console.dir(reply)
        }

        send(reply)
      }
    })
  }

  module.exports = function(content, send, robot, message) {
    content = content.trim()

    if (content.toLowerCase() === 'hello') {
      send(`${message.from_user.nick} hello, 你只要在消息开头加上#，我就能收到你的消息啦!`)
    } else {
      if (message.type !== 'group_message') {
        send('小萌姬不支持私撩哦～ 要撩我去群里撩～')
      } else if (content.match(`^#`)) {
        if (content.length == 1) {
          send(`${message.from_user.nick}, 请发点有意义的内容好嘛～`)
        } else {
          handle(content, send, robot, message)
        }
      } else {
      }
    }
  }
}).call(this)