import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { SET_MODAL_CHAT } from "../../redux/types/modalChat";
import ModalCHat from "../ModalChat/ModalChat";
import styles from './Chat.module.css'

function Chat() {
  const store = useSelector(store => store)
  const dispatch = useDispatch()
  const history = useHistory()
  useEffect(() => {
    !store.user.id ? history.push('/signin') : null
  }, [])
  const chatHandler = (id) => {
    dispatch({ type: SET_MODAL_CHAT, payload: id })
  }
  return (
    <>
      <div className={styles.chatConteiner}>
        <div className={styles.headConteiner}>ЧАТЫ СОБЫТИЙ</div>
        <div className={styles.chatsConteiner}>
          {store.userChats.length
            ?
            store.userChats.map(item => (
              <div className={styles.currentChat} key={item._id} onClick={() => chatHandler(item._id)}>
                {item.eventTitle}
              </div>
            ))
            :
            'there are no chats here yet'}
        </div>
          {store.userChats.length ? <ModalCHat /> : null}
      </div>
    </>
  )
}
export default Chat;
