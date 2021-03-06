/* eslint-disable object-curly-newline */
import React, {
  useContext,
  useRef,
  useEffect,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import ApiContext from '../context/apiContext';
import useAuthorizationData from '../useAuthorizationData.js';

export const Chat = () => {
  const socket = useContext(ApiContext);

  const { t } = useTranslation();

  const { userAuthName: username } = useAuthorizationData();

  const messages = useSelector((state) => state.chatReducer.messages);
  const currentChannelId = useSelector((state) => state.channelsReducer.currentChannelId);
  const channels = useSelector((state) => state.channelsReducer.channels);

  const currentChannelName = channels.find(({ id }) => id === currentChannelId).name;
  const numberOfMessage = messages.filter(({ channelId }) => channelId === currentChannelId).length;

  const chatRef = useRef();
  const input = useRef();

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    input.current.focus();
  });

  const formik = useFormik({
    initialValues: { inputMessage: '' },
    onSubmit: () => {
      socket.emit('newMessage', { body: formik.values.inputMessage, username, channelId: currentChannelId }, () => {

      });
      formik.values.inputMessage = '';
    },
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {currentChannelName}
            </b>
          </p>
          <span className="text-muted">
            { t('messages.key', { count: numberOfMessage })}
          </span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 " ref={chatRef}>
          {messages
            .filter(({ channelId }) => channelId === currentChannelId)
            .map(({ body, id, username: name }) => (
              <div className="text-break mb-2" key={`${id}-${name}`}>
                <b>{name}</b>
                :
                {` ${body}`}
              </div>
            ))}
        </div>
        <div className="border-top mt-auto py-3 px-5">
          <form onSubmit={formik.handleSubmit} noValidate="" className="">
            <div className="input-group">
              <input
                ref={input}
                name="inputMessage"
                value={formik.values.inputMessage}
                onChange={formik.handleChange}
                data-testid="new-message"
                placeholder={t('chat.placeholder')}
                className="border-0 form-control"
              />
              <div className="input-group-append">
                <button type="submit" className="btn btn-group-vertical" disabled={formik.values.inputMessage === ''}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="30" height="30" fill="currentColor">
                    <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                  </svg>
                  <span className="visually-hidden">{t('chat.send')}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
