import posed from "react-pose";
import defaults from "lodash/defaultsDeep";
import PoseConfig from "react-pose/types";

/**
 * Returns a wrapped function that generates a pose with
 * default values; must be called with element or nothing
 * to return actual div
 * @param {PoseConfig} defaultConfig The primary pose config
 *
 * @example Using PagePosedFactory below
 * PagePosedFactory(); // returns posed div
 *
 * @example
 * const PageStyled = styled.div();
 * PagePosedFactory()(PageStyled); // returns posed div with styling
 * PagePosedFactory({ open: { transition: { type :"tween" }}})(PageStyled);
 * // returns posed div with styling and custom open transition type
 *
 * @example Using "as" with Semantic
 * <Segment as={PagePosedFactory}/> // INCORRECT, must invoke
 * <Segment as={PagePosedFactory()}/> // CORRECT!
 *
 */
const configurablePose = defaultConfig => (config = {}) => (wrappedElement = none) => {
  const mergedConfig = defaults(config, defaultConfig);
  if (wrappedElement) return posed(wrappedElement)(mergedConfig);
  return posed.div(mergedConfig);
};

/**
 * Global transition configuration
 * Can be overriden by replacing transition keys
 * Eg. PagePosedFactory({ enter: { transition { type: "tween" }}})
 *  will return a transition with the global duration and
 *  type tween
 */

const transition = { duration: 200 };

const PagePosedFactory = configurablePose({
  enter: {
    opacity: 1,
    beforeChildren: true,
    staggerChildren: 40,
    transition,
  },
  exit: {
    opacity: 0,
    transition,
  },
});

export { PagePosedFactory };
