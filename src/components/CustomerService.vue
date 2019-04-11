<template>
  <div class="container">
    <el-card type="border-card">
      <div class="top-title-button">
        <el-badge
          v-for="(item, index) in titleMenuList"
          :key="item.id"
          :is-dot="item.processStatus===0"
          class="top-item">
          <el-card
            shadow="never"
            @click.native="handleGetSubList(item.id, index)"
            :class="{'topActive': index == topClass}">
            {{item.name}}
          </el-card>
        </el-badge>
      </div>
      <div class="sub-title-button">
        <el-badge
          class="sub-item"
          :is-dot="it.processStatus===0"
          v-for="(it,index) in subMenuList"
          :key="it.id"
          :true-label = "it.id">
          <el-card
            :class="{'adActive': index == adClass}"
            shadow="never"
            @click.native="handleShowSideMenu(it.id,index)">
            {{it.name}}
          </el-card>
        </el-badge>
      </div>
    </el-card>
    <!-- 对话框 -->
    <el-card class="box-card third-card-box" v-show="handleConversationShow">
      <div class="conversation-box">
        <!-- 侧边栏按钮 -->
        <div class="conversation-left">
          <el-badge
            :is-dot="items.processStatus===0"
            class="item"
            v-for="(items, index) in sideMenuList"
            :key="items.id">
            <el-card
              shadow="never"
              :class="{'active': index == activeClass}"
              @click.native="handleConversationList(items.id, index)">{{items.name}}</el-card>
          </el-badge>
        </div>
        <div class="untreated-list">
          <el-badge
            :is-dot="list.processStatus===0"
            class="item"
            v-for="(list,index) in conversationList"
            :key="index"
            v-if="handlecConversationList">
            <el-card
              shadow="never"
              @click.native="handleCustomerList(index, list.userId)"
              :class="{'addActive': index == addClass}">{{list.nickName}}</el-card>
          </el-badge>
        </div>
        <!-- 侧边栏按钮 -->
        <div class="conversation-right-dialog">
          <div class="conversation-right" id="conversation-right">
            <!-- 对话消息 -->
            <div class="third-conversation-list">
              <div
                class="third-conversation-info"
                v-for="messageList in records"
                :key="messageList.id"
                v-show="handleCheckoutShow">
                <div class="dialog-time"><span>{{messageList.time}}</span></div>
                <div class="customer-dialog-left" v-if="messageList.type===0">
                  <img src="//static.genebox.cn/web/new/item_icon_diet.png" class="customer-img">
                  <div class="left-dialog-box" v-html="messageList.content"></div>
                </div>
                <div
                  class="service-dialog-right"
                  v-if="messageList.type===1">
                  <div class="right-dialog-box" v-html="messageList.content"></div>
                  <img src="//static.genebox.cn/web/new/item_icon_inherit.png" class="service-img">
                </div>
              </div>
            </div>
          </div>
          <div class="textarea-box">
            <textarea
              class="text-box"
              placeholder="请输入您的回复...."
              @keyup.enter="submit"
              v-model.trim="content">
            </textarea>
            <div class="text-button-box">
              <el-button class="send-button" type="success"  @click="handleSendMsg">发送</el-button>
              <el-button class="finish-button" type="primary" @click="handleFinishBox">处理完毕</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 对话框 -->
  </div>
</template>
<script>
import {
  getFirstList,
  getSecondList,
  getFinishBox,
  getConversationReply,
  getThirdList,
  getConversationList,
  getConversationInfo
} from '../server'
export default {
  data () {
    return {
      titleMenuList: [],
      subMenuList: [],
      tabPosition: 'left',
      handleConversationShow: false,
      handlecConversationList: false,
      handleCheckoutShow: false,
      sideMenuList: [],
      content: '',
      records: [],
      textContent: [],
      conversationList: [],
      activeClass: -1,
      addClass: -1,
      adClass: -1,
      topClass: -1,
      userId: '',
      phenotypeId: '',
      categoryId: '',
      firstId: ''
    }
  },
  mounted () {
    this.getFirstList()
  },
  updated: function () {
    this.$nextTick(function () {
      var p = document.getElementById('conversation-right')
      p.scrollTop = p.scrollHeight
    })
  },
  methods: {
    getFirstList () {
      // 一级菜单获取
      getFirstList({
      }).then(res => {
        if (!res.status) {
          this.titleMenuList = res.data || []
        } else {
          this.titleMenuList = []
        }
      })
    },
    handleGetSubList (categoryId, index) {
      // 二级菜单获取
      this.topClass = index
      this.adClass = -1
      this.handleConversationShow = false
      this.firstId = categoryId
      this.getSecondList()
    },
    getSecondList () {
      getSecondList({
        categoryId: this.firstId
      }).then(res => {
        if (!res.status) {
          this.subMenuList = res.data || []
        } else {
          this.subMenuList = []
        }
      })
    },
    getThirdList () {
      getThirdList({
        categoryId: this.categoryId
      }).then(res => {
        if (!res.status) {
          this.sideMenuList = res.data || []
        } else {
          this.sideMenuList = []
          this.handleConversationShow = false
        }
      })
    },
    handleShowSideMenu (categoryId, index) {
      // 侧边菜单获取
      this.handlecConversationList = false
      // sub高亮显示
      this.adClass = index
      // card显示
      this.handleConversationShow = true
      this.activeClass = -1
      // 对话列表隐藏
      this.handleCheckoutShow = false
      this.categoryId = categoryId
      this.getThirdList()
    },
    handleConversationList (phenotypeId, index) {
      // 微信昵称列表
      this.handlecConversationList = true
      this.activeClass = index
      this.addClass = -1
      // 切换昵称 对话内容隐藏
      this.handleCheckoutShow = false
      this.phenotypeId = phenotypeId
      this.getConversationList()
    },
    getConversationList () {
      getConversationList({
        phenotypeId: this.phenotypeId
      }).then(res => {
        if (!res.status) {
          this.conversationList = res.data || []
        } else {
          this.conversationList = []
        }
      })
    },
    handleCustomerList (index, userId) {
      this.userId = userId
      // 顾客消息框
      this.addClass = index
      this.getConversationInfo()
      this.handleCheckoutShow = true
    },
    getConversationInfo () {
      this.content.trim()
      getConversationInfo({
        phenotypeId: this.phenotypeId,
        userId: this.userId
      }).then(res => {
        if (!res.status) {
          this.records = res.data
          this.records.push({
            time: new Date().toLocaleTimeString(),
            content: this.content,
            type: 2
          })
          this.content = ''
        }
      })
    },
    getConversationReply () {
      var content = this.content.trim()
      if (content === '') {
        this.$message({
          message: '回复不能为空',
          type: 'error'
        })
        return
      }
      getConversationReply({
        phenotypeId: this.phenotypeId,
        userId: this.userId,
        content: content
      }).then(res => {
        if (!res.status) {
          this.$message({
            message: '发送成功',
            type: 'success'
          })
          this.content = ''
          this.getConversationInfo()
        } else {
          this.$message({
            message: '系统错误：' + res.msg,
            type: 'error'
          })
        }
      })
    },
    handleSendMsg () {
      // 发送按钮获取
      this.getConversationReply()
    },
    submit () {
      // enter 键盘提交
      this.getConversationReply()
    },
    handleFinishBox (index) {
      // 处理完毕按钮
      getFinishBox({
        phenotypeId: this.phenotypeId,
        userId: this.userId
      }).then(res => {
        if (res.status === 0) {
          this.$confirm('是否处理完成？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '提交成功'
            })
            // 侧边栏刷新
            this.getThirdList()
            // 微信昵称列表
            this.getConversationList()
            // 一级菜单刷新
            this.getFirstList()
            // 二级菜单刷新
            this.getSecondList()
          })
        } else {
          this.$message({
            message: '系统错误：' + res.msg,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
/* 修改样式 */
.container >>> .el-card__body {
  padding: 10px;
}
.top-title-button {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 10px;
}
.top-title-button .top-item {
  width: 100px;
  margin-right: 20px;
  font-size: 14px;
}
.top-title-button >>> .el-card__body {
  padding: 10px;
}
.top-title-button .el-card {
  width: 100px;
  text-align: center;
  cursor: pointer;
}
.container .sub-title-button {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  margin-left: 0px;
}
.sub-title-button .el-card {
  width: 80px;
  text-align: center;
  cursor: pointer;
}
.sub-title-button >>> .el-card__body {
  padding: 8px;
}
.sub-title-button .sub-item {
  width: 80px;
  margin-right: 20px;
  font-size: 14px;
}
/* 修改样式 */
.el-badge__content.is-fixed.is-dot {
  right: 8px;
  top: 7px;
}
.sub-title-button .el-checkbox-button__inner {
  border-left: 1px solid #dcdfe6;
  padding: 8px 8px;
  font-size: 12px;
}
.third-card-box {
  position: relative;
  margin-top: 20px;
  height: 400px;
}
.finish-button {
  width: 78px;
  height: 40px;
  padding: 0;
  /* border: 1px solid #CBE0FA; */
  /* color: #409EFF; */
}
.send-button {
  width: 78px;
  height: 40px;
  /* border: 1px solid #CBE0FA; */
  /* color: #0AC95A; */
}
.first-title-button >>> .el-badge__content.is-fixed.is-dot {
  right: 6px;
  top: 4px;
}
.text-button-box >>> .el-button+.el-button {
  margin-left: 0;
}
.text-box {
  resize: none;
  width: 89%;
  border: none;
  outline:none;
}
.conversation-box {
  width: 100%;
  height: 370px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.conversation-left {
  margin: 0;
  width: 16%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 4px;
}
.conversation-left .item {
  text-align: center;
  border-radius: 3px;
  margin-bottom: 10px;
  font-size: 13px;
  cursor: pointer;
  width: 90%;
}
.conversation-left >>> .el-card {
  width: 100%;
}
.conversation-left >>> .el-card__body {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 10px;
}
.conversation-right {
  height: 76%;
  overflow-y: auto;
  overflow-x: hidden;
}
.textarea-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 25%;
  border-top: 1px solid #EBEEF5;
}
.text-button-box {
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.conversation-right-dialog {
  display: flex;
  flex-direction: column;
  width: 80%;
  border: 1px solid #EBEEF5;
  border-radius: 5px;
}
/* 对话消息 */
.untreated-list .item {
  text-align: center;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  margin-right: 22px;
  margin-top: 3px;
  margin-bottom: 10px;
  width: 97%;
}
.untreated-list >>> .el-card__body {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 10px;
}
.untreated-list >>> .el-card {
  width: 97%;
}
.untreated-list {
  margin-right: 13px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1px 8px 0px 5px;
}
.customer-img {
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
.service-img {
  width: 25px;
  height: 25px;
  margin-left: 5px;
}
.third-conversation-list {
  box-sizing: border-box;
  padding: 20px 5px 0px 5px;
}
.customer-dialog-left {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.third-conversation-info {
  margin: 10px;
}
.left-dialog-box {
  max-width: 30%;
  border-radius: 5px;
  background-color: #f5f5f5;
  font-size: 14px;
  word-break: break-all;
  padding: 10px;
}
.service-dialog-right {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.right-dialog-box {
  max-width: 30%;
  border-radius: 5px;
  background-color: #9EEA6A;
  font-size: 14px;
  word-break: break-all;
  padding: 10px;
}
.untreated-list .el-badge {
  display: block;
}
.dialog-time {
  display: flex;
  justify-content: center;
}
.dialog-time  span {
  background-color: #DADADA;
  font-size: 13px;
  border-radius: 3px;
  color: #fff;
  padding: 6px;
}
.conversation-left .active {
  background-color: #ECF5FF;
  border: 1px solid #409EFF;
}
.untreated-list .addActive {
  background-color: #ECF5FF;
  border: 1px solid #409EFF;
}
.sub-title-button .adActive {
  background-color: #ECF5FF;
  border: 1px solid #409EFF;
  color: #889EFF;
}
.top-title-button .topActive {
  background-color: #ECF5FF;
  border: 1px solid #409EFF;
  color: #889EFF;
}
.conversation-left::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.conversation-left::-webkit-scrollbar-thumb {
  border-radius: 8px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  background: rgba(64,158,255,0.4);
}
.conversation-left::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  border-radius: 3px;
  background: rgba(64,158,255,0.4);
}
.untreated-list::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.untreated-list::-webkit-scrollbar-thumb {
  border-radius: 8px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  background: rgba(64,158,255,0.4);
}
.untreated-list::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  border-radius: 3px;
  background: rgba(64,158,255,0.4);
}
.conversation-right::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.conversation-right::-webkit-scrollbar-thumb {
  border-radius: 8px;
  box-shadow: inset 0 0 5px rgba(10, 70, 148, 0.1);
  background: rgba(64,158,255,0.4);
}
.conversation-right::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  border-radius: 0px;
  background: rgba(64,158,255,0.4);
}
/* 对话消息 */
</style>
