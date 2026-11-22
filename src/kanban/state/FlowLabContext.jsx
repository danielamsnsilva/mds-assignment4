import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { createActions } from './createActions.js';
import { flowLabReducer } from './flowLabReducer.js';
import { createInitialState } from './initialState.js';
import { ProgressStorage } from './ProgressStorage.js';

const TOAST_DURATION_MS = 2200;
const SIMULATION_TICK_MS = 110;

const FlowLabContext = createContext(null);

/**
 * Holds the application state and runs the effects tied to it: saving
 * progress, hiding toasts, running the simulator and closing the glossary
 * with Escape.
 */
export function FlowLabProvider({ storage, children }) {
  const progressStorage = useMemo(() => storage ?? new ProgressStorage(), [storage]);
  const [state, dispatch] = useReducer(flowLabReducer, undefined, () =>
    progressStorage.load(createInitialState()),
  );
  const actions = useMemo(() => createActions(dispatch), []);

  useEffect(() => {
    progressStorage.save(state);
  }, [progressStorage, state]);

  const { toast } = state.ui;
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => actions.dismissToast(toast.id), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [actions, toast]);

  const { running } = state.simulation;
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(actions.tickSimulation, SIMULATION_TICK_MS);
    return () => clearInterval(timer);
  }, [actions, running]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') actions.pressEscape();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [actions]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <FlowLabContext.Provider value={value}>{children}</FlowLabContext.Provider>;
}

/** @returns {{ state: object, actions: ReturnType<typeof createActions> }} */
export function useFlowLab() {
  const context = useContext(FlowLabContext);
  if (!context) throw new Error('useFlowLab must be used inside <FlowLabProvider>.');
  return context;
}
