import React, { createContext, useMemo, useContext, useCallback, useLayoutEffect, useEffect, useRef } from 'react'
import 'react-virtualized/styles.css'
import {List, AutoSizer, CellMeasurer, CellMeasurerCache} from 'react-virtualized'

const cache = new CellMeasurerCache()

function UserAvatar({ name, bgColor }) {
  return (
    <div style={{
      backgroundColor: bgColor,
      color: '#fff',
      borderRadius: '50%',
      width: 40,
      height: 40,
      textAlign: 'center',
      lineHeight: 0,
      fontSize: 30,
      display: 'flex',
      flexShrink: 0,
    }}>
      <div style={{
        margin: 'auto'
      }}>
        {name.substr(0, 1).toUpperCase()}
      </div>
    </div>
  )
}

function UserMessageContent({ msg, img }) {
  const content = msg || <img src={img.src} style={{ width: img.width, height: img.height }} />
  return (
    <div style={{
      padding: '10px',
      backgroundColor: '#adcbf1',
      borderRadius: '10px',
      margin: '0 10px',
      maxWidth: '60%',
    }}>
      {content}
    </div>
  )
}

function UserMessage({ data, self, style, ref }) {
  return (
    <div ref={ref} style={style}>
      <div style={{
        display: 'flex',
        padding: '5px 0',
        flexDirection: self === data.author ? 'row-reverse' : '',
      }}>
        <UserAvatar name={data.author} bgColor={self === data.author ? '#3ece53' : '#2cb9d9'}  />
        <UserMessageContent msg={data.msg} img={data.img} />
      </div>
    </div>
  )
}

function SystemMessage({ data, style, ref }) {
  return (
    <div ref={ref} style={style}>
      <div style={{
        display: 'flex',
        padding: '5px 0',
      }}>
        <div style={{
          margin: 'auto',
          padding: '5px 8px',
          borderRadius: '10px',
          backgroundColor: '#e1e1e1'
        }}>
          {data.msg}
        </div>
      </div>
    </div>
  )
}

function useRenderer(list, self, map) {
  return useCallback(({ index, key, parent, style }) => {
    const { type, data } = list[index]
    const Component = map[type]

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}>
        {({registerChild}) => (
          <Component self={self} data={data} ref={registerChild} style={style} />
        )}
      </CellMeasurer>
    );
  }, [list, self, map])
}

const map = {
  0: UserMessage,
  1: SystemMessage,
}

export function Chat({ list, self }) {
  const ref = useRef(null)
  const renderer = useRenderer(list, self, map)
  useLayoutEffect(() => {
    const el = ref.current
    el.scrollTop = el.offsetHeight
  }, [])
  return (
    <div className="chat" ref={ref}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            deferredMeasurementCache={cache}
            overscanColumnCount={0}
            rowCount={list.length}
            rowHeight={cache.rowHeight}
            rowRenderer={renderer}
            scrollToIndex={list.length - 1}
          />
        )}
      </AutoSizer>
    </div>
  )
}
