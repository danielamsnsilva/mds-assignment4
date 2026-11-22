import { Blueprint } from '../../../shared/components/Blueprint.jsx';
import { useFlowLab } from '../../state/FlowLabContext.jsx';

/** Floating FlowBot button and panel. The chatbot embed is not wired up yet. */
export function ChatWidget() {
  const { state, actions } = useFlowLab();

  return (
    <div className="chat-widget">
      {state.ui.chatOpen && (
        <Blueprint className="chat-widget__panel">
          <div className="chat-widget__header">
            <span className="chat-widget__title">FlowBot</span>
            <button type="button" onClick={actions.closeChat} className="btn btn-ghost btn-square-sm" aria-label="Close">
              ✕
            </button>
          </div>
          <div className="chat-widget__placeholder">BOTSchool.ai chatbot embed goes here</div>
        </Blueprint>
      )}
      <Blueprint as="button" type="button" onClick={actions.toggleChat} className="btn btn-primary chat-widget__toggle">
        Ask FlowBot
      </Blueprint>
    </div>
  );
}
