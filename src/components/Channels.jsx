import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../store/slices';
import { Channel } from './Channel';

export const Channels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { channels } = useSelector((state) => state.channelsReducer);

  return (
    <div className="col-2 px-0 pt-5 border-end bg-light">
      <div className="d-flex justify-content-between mb-2 px-4">
        <span>{t('channels')}</span>
        <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => dispatch(actions.isModal({ isOpen: true, type: 'addChannel' }))}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map(({ id, name, removable }) => (
          <Channel key={id} id={id} name={name} removable={removable} />
        ))}
      </ul>
    </div>
  );
};

export default Channels;
