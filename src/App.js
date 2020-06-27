import React, { useEffect, useState, useMemo } from 'react';
import github from './github-mark.png';
import './App.css';
import { Chat } from './Chat';

const nonsenses = [
  '这是一段废话',
  '这是另一段废话',
  '这是第三段废话',
  '这是第四句废话',
  '再说一句废话',
  '加油',
  '差不多了把',
  '来一段长长的废话！来一段长长的废话！来一段长长的废话！来一段长长的废话！来一段长长的废话！来一段长长的废话！来一段长长的废话！来一段长长的废话！来一段长长的废话！来一段长长的废话！来一段长长的废话！来一段长长的废话！',
  '来一段长长的废话 again!来一段长长的废话 again!来一段长长的废话 again!来一段长长的废话 again!来一段长长的废话 again!来一段长长的废话 again!',
  '好了，就这样把',
  '拜拜',
]

function generateMsg(words, size) {
  return Array.from({ length: size }, () => words[((Math.random() * 1000) >> 0) % words.length])
}

const systemMsg = [
  '这是一个很严肃的系统消息',
  '你已被移除群组',
  '我是一个系统消息',
  '系统消息差不多了',
]

function fromRemote() {
  return new Promise(res => {
    setTimeout(() => {
      const userMsgs = generateMsg(nonsenses, 600).map((msg, i) => ({
        type: 0,
        data: {
          msg: i % 50 > 5 ? msg: undefined,
          img: i % 50 <= 5 ? { src: github, height: 150 } : undefined,
          author: i < 250 ? 'oops' : 'yoo',
        },
      }))
      const systemMsgs = generateMsg(systemMsg, 50).map(msg => ({ type: 1, data: { msg } }))
      res(userMsgs.concat(systemMsgs).sort(() => Math.random() - 0.5))
    }, 100);
  })
}

function App() {
  const [list, setList] = useState([])
  useEffect(() => {
    fromRemote().then(list => setList(list))
  }, [])
  return (
    <div>
      {list.length && <Chat self="oops" list={list} />}
    </div>
  );
}

export default App;
