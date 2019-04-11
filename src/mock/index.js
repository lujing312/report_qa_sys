import axios from '../server/axios'
import MockAdapter from 'axios-mock-adapter'
import config from '../server/config'

import {
  success,
  getFirstList,
  getSecondList,
  getConversationInfo,
  getThirdList,
  getConversationList
} from './data'

export default {
  init () {
    let mock = new MockAdapter(axios)
    mock.onPost(config.login).reply(200, JSON.stringify(success))
    mock.onPost(config.getFinishBox).reply(200, JSON.stringify(success))
    mock.onPost(config.getConversationReply).reply(200, JSON.stringify(success))
    mock.onGet(config.getFirstList).reply(200, JSON.stringify(getFirstList))
    mock.onGet(config.getSecondList).reply(200, JSON.stringify(getSecondList))
    mock.onGet(config.getConversationInfo).reply(200, JSON.stringify(getConversationInfo))
    mock.onGet(config.getThirdList).reply(200, JSON.stringify(getThirdList))
    mock.onGet(config.getConversationList).reply(200, JSON.stringify(getConversationList))
  }
}
