interface moduloType {
  id:string
  exists:any
  module?:any
}

const modulos:moduloType[] = [
  {
    id: 'Store',
    exists: module => {
      return module.default && module.default.Chat ? module.default : null
    }
  },
  {
    id: 'Conn',
    exists: module => {
      return module.default && module.default.ref ? module.default : null
    }
  },
  {
    id: 'Status',
    exists: module => {
      return module.setMyStatus ? module : null
    }
  },
  {
    id: 'Chats',
    exists: module => {
      return module.sendTextMsgToChat ? module : null
    }
  },
  {
    id: 'AddChat',
    exists: module => {
      return module.addAndSendMsgToChat ? module : null
    }

  }
]

export default modulos
