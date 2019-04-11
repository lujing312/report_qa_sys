/**
 * 请求地址映射
 */
let base = '/qaservice'
module.exports = {
  getFirstList: base + '/category/first/list',
  getConversationReply: base + '/phenotype/conversation/reply',
  getSecondList: base + '/category/second/list',
  getFinishBox: base + '/phenotype/conversation/finish',
  getConversationInfo: base + '/phenotype/conversation/info',
  getThirdList: base + '/phenotype/list',
  getConversationList: base + '/phenotype/conversation/list'
}
