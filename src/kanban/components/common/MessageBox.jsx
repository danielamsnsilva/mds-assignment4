/** Bordered feedback line; `highlighted` tints it when a goal is reached. */
export function MessageBox({ children, highlighted = false, className = '' }) {
  return (
    <div className={`message-box${highlighted ? ' message-box--success' : ''} ${className}`.trim()}>
      {children}
    </div>
  );
}
