function getMe():string {
  let user:string = ''
  user = window['Store'].Contact.models.filter(c => c.isMe)[0].id._serialized
  return user
}

async function getStatus(userId:string):Promise<string> {
  let statusUser = await window['Store'].Status.getStatus(userId)
  return statusUser.status
}

function getChat(userId:string) {
  let chat = window['Store'].Chat.get(userId)
  return chat
}

let whatsApi = {
  updateStatus: (msj:string) => {
    getStatus(getMe())
      .then(status => {
        if (status !== msj) {
          window['Store'].Status.setMyStatus(msj)
        }
      })
  },
  textMe: (msj:string) => {
    let chatMe = getChat(getMe())
    if (chatMe !== undefined) window['Store'].Chats.sendTextMsgToChat(chatMe, msj)
  }
}

export default whatsApi
