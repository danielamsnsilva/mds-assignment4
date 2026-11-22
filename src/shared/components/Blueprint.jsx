/** The four "+" registration marks the design system draws on framed objects. */
export function Corners() {
  return (
    <>
      <i className="corner tl" aria-hidden="true" />
      <i className="corner tr" aria-hidden="true" />
      <i className="corner bl" aria-hidden="true" />
      <i className="corner br" aria-hidden="true" />
    </>
  );
}

/**
 * A wireframe ("blueprint") frame: hairline border plus corner marks.
 * Renders any element through `as` (div by default, button, section…).
 */
export function Blueprint({ as: Element = 'div', className = '', children, ...props }) {
  return (
    <Element className={`blueprint ${className}`.trim()} {...props}>
      <Corners />
      {children}
    </Element>
  );
}
