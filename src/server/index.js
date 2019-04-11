import axios from './axios'
import config from './config'

export const getFirstList = params => {
  return axios.get(config.getFirstList, {params})
    .then(res => res.data, err => Promise.reject(err))
}
export const getSecondList = params => {
  return axios.get(config.getSecondList, {params})
    .then(res => res.data, err => Promise.reject(err))
}
export const getFinishBox = params => {
  return axios.post(config.getFinishBox, params)
    .then(res => res.data, err => Promise.reject(err))
}
export const getConversationInfo = params => {
  return axios.get(config.getConversationInfo, {params})
    .then(res => res.data, err => Promise.reject(err))
}
export const getThirdList = params => {
  return axios.get(config.getThirdList, {params})
    .then(res => res.data, err => Promise.reject(err))
}
export const getConversationList = params => {
  return axios.get(config.getConversationList, {params})
    .then(res => res.data, err => Promise.reject(err))
}
export const getConversationReply = params => {
  return axios.post(config.getConversationReply, params)
    .then(res => res.data, err => Promise.reject(err))
}
