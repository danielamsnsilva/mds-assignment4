import { useFlowLab } from '../../state/FlowLabContext.jsx';

/** XP / badge notification; FlowLabProvider hides it after a moment. */
export function Toast() {
  const { state } = useFlowLab();
  const { toast } = state.ui;
  if (!toast) return null;
  return <div className="toast">{toast.label}</div>;
}
