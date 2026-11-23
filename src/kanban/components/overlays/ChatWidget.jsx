import { useEffect, useState } from 'react';
import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { BOTSCHOOL_CHAT } from '../../config/chatbot.js';
import { useFlowLab } from '../../state/FlowLabContext.jsx';

const LOADER_ID = 'botschool-loader';

/** Adds the BOTSchool loader once. It creates the <bsc-chat> element with its own launcher. */
function loadBotSchool() {
  if (document.getElementById(LOADER_ID)) return;
  const script = document.createElement('script');
  script.id = LOADER_ID;
  script.src = BOTSCHOOL_CHAT.loaderUrl;
  script.async = true;
  script.setAttribute('data-channel-id', BOTSCHOOL_CHAT.channelId);
  script.setAttribute('data-endpoint', BOTSCHOOL_CHAT.endpoint);
  document.body.appendChild(script);
}

/** Opens the BOTSchool chat window. Returns false when the chat is not available. */
function openBotSchool() {
  const root = document.querySelector('bsc-chat')?.shadowRoot;
  if (!root) return false;
  const isVisible = (el) => el && el.getClientRects().length > 0;
  const target = [
    root.querySelector('.bsc-launcher-bubble'),
    root.querySelector('.bsc-chat-minimized'),
    root.querySelector('.bsc-header-action-open'),
  ].find(isVisible);
  if (!target) return false;
  target.click();
  return true;
}

/**
 * H6: FlowBot. The BOTSchool chat shows its own button in the corner of the page.
 * "Ask FlowBot" buttons elsewhere (e.g. in the Debrief) open it through openChat.
 */
export function ChatWidget() {
  const { state, actions } = useFlowLab();
  const [unavailable, setUnavailable] = useState(false);

  useEffect(loadBotSchool, []);

  useEffect(() => {
    if (!state.ui.chatOpen) return;
    setUnavailable(!openBotSchool());
    actions.closeChat();
  }, [state.ui.chatOpen, actions]);

  if (!unavailable) return null;

  return (
    <div className="chat-widget">
      <Blueprint className="chat-widget__panel" role="status">
        <div className="chat-widget__header">
          <span className="chat-widget__title">FlowBot</span>
          <button type="button" onClick={() => setUnavailable(false)} className="btn btn-ghost btn-square-sm" aria-label="Close">
            ✕
          </button>
        </div>
        <p className="chat-widget__message">FlowBot is not available right now. Please try again in a moment.</p>
      </Blueprint>
    </div>
  );
}
