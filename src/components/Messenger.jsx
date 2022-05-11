import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');

function Messenger({ user }) {
  const [messageInput, setMessageInput] = useState('');
  const [ChatRoom, setChatRoom] = useState({
    roomID: undefined,
    senderName: undefined,
    receiverName: undefined,
    receiverPic: undefined,
  });
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setConversation((prev) => [...prev, data]);
    });
  }, []);

  function fireMessage(e) {
    e.preventDefault();
    const messageData = {
      timestamp: Date.now(),
      message: messageInput,
      sentBy: user._id,
    };
    socket.emit('send-message', messageData, ChatRoom.roomID);
    setConversation((prev) => [...prev, messageData]);
    setMessageInput('');
  }

  function openChatRoom(myID, userID, receiverName, receiverPic) {
    let roomID;

    if (myID > userID) {
      roomID = `${myID}-${userID}`;
    } else {
      roomID = `${userID}-${myID}`;
    }

    if (ChatRoom.roomID === roomID) return;
    socket.emit('join', roomID);
    setChatRoom({
      roomID,
      senderName: user.firstname + ' ' + user.lastname,
      receiverName,
      receiverPic,
    });
    setConversation([]);
  }

  return (
    <div>
      <div className="container bg-white my-5">
        <div className="row shadow">
          <div
            className="col-md-4 pt-4 px-0"
            style={{ borderRight: '5px solid #ecebeb' }}
          >
            <h2 className="mb-3 mx-4">Messages</h2>

            <div style={{ height: '70vh', overflow: 'auto' }}>
              {user.friends.myFriends.map((data) => (
                <div
                  key={data._id}
                  className="d-flex align-items-center my-1 bg-light py-3 pointer"
                  onClick={() =>
                    openChatRoom(
                      user._id,
                      data._id,
                      `${data.firstname} ${data.lastname}`,
                      data.picture_url
                    )
                  }
                >
                  <div className="mx-4 d-flex w-100">
                    <img
                      src={
                        data.picture_url
                          ? data.picture_url
                          : require('../images/blank-profile.png')
                      }
                      className="card-img-top round-img"
                      alt="..."
                      style={{
                        width: '60px',
                        height: '60px',
                        marginRight: '15px',
                      }}
                    />

                    <div className="d-flex w-100 flex-column justify-content-center">
                      <div className="d-flex justify-content-between">
                        <h5 className="m-0">
                          {data.firstname + ' ' + data.lastname}
                        </h5>
                        {/* <span className="font-weight-bolder">4:30pm</span> */}
                      </div>
                      <span className="my-1">Click to open chat</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-8 bg-light p-0 flex-column d-flex justify-content-between">
            {ChatRoom.roomID && (
              <>
                <div className="col-12 bg-white px-4 py-2 d-flex align-items-center snackbar">
                  <img
                    src={
                      ChatRoom.receiverPic
                        ? ChatRoom.receiverPic
                        : require('../images/blank-profile.png')
                    }
                    className="card-img-top round-img"
                    alt="..."
                    style={{
                      width: '40px',
                      height: '40px',
                      marginRight: '15px',
                    }}
                  />
                  <h4 className="m-0">{ChatRoom.receiverName}</h4>
                </div>
                <div className="px-4">
                  <div
                    className="chat p-2"
                    style={{ overflow: 'auto', maxHeight: '70vh' }}
                  >
                    {conversation.map((msg) => (
                      <ChatBubble
                        my={msg.sentBy === user._id}
                        message={msg.message}
                        senderName={ChatRoom.senderName}
                        receiverName={ChatRoom.receiverName}
                        senderPic={user.picture_url}
                        receiverPic={ChatRoom.receiverPic}
                        time={msg.timestamp}
                      />
                    ))}
                  </div>
                  <div className="chatinput p-0 m-0">
                    <div className="input-group input-group-lg mb-3">
                      <form onSubmit={fireMessage} className="d-flex  w-100">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Your message.."
                          value={messageInput}
                          autoComplete="off"
                          onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <div className="input-group-append input-group-lg">
                          <button
                            className="btn btn-outline-primary"
                            type="submit"
                          >
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messenger;

function ChatBubble({
  my,
  message,
  senderName,
  receiverName,
  senderPic,
  receiverPic,
  time,
}) {
  let pic;
  if (my) pic = senderPic;
  if (!my) pic = receiverPic;
  if (!pic) pic = require('../images/blank-profile.png');

  return (
    <div className={`d-flex my-2 chatbubble ${my && 'myMessage'}`}>
      {!my && (
        <img
          src={pic}
          className="card-img-top round-img"
          alt="pic"
          style={{
            width: '40px',
            height: '40px',
          }}
        />
      )}
      <div className="flex-column px-2 my-1">
        <div className="d-flex rowalign">
          {!my && <h6 className="mb-2">{receiverName}</h6>}
          <span className="time">{time}</span>
          {my && <h6 className="mb-2">{senderName}</h6>}
        </div>
        <div className="d-flex bubbletext">
          <p className="m-0">{message}</p>
        </div>
      </div>
      {my && (
        <img
          src={pic}
          className="card-img-top round-img"
          alt="pic"
          style={{
            width: '40px',
            height: '40px',
          }}
        />
      )}
    </div>
  );
}
