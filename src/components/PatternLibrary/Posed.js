import posed from "react-pose";
import defaults from "lodash/defaultsDeep";

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
 * PagePosedFactory(PageStyled)(); // returns posed div with styling
 * PagePosedFactory(PageStyled)({ open: { transition: { type :"tween" }}});
 * // returns posed div with styling and custom open transition type
 *
 * @example Using "as" with Semantic
 * <Segment as={PagePosedFactory}/> // INCORRECT, must invoke
 * <Segment as={PagePosedFactory()}/> // CORRECT!
 * <Segment as={PagePosedFactory(PageStyled)()}/> // ALSO CORRECT!
 * <Segment as={PagePosedFactory(PageStyled)/> // ALSO CORRECT!
 *
 */
const configurablePose = defaultConfig => configOrElement => {
  if (configOrElement && configOrElement.styledComponentId) {
    return config => {
      const mergedConfig = defaults(config || {}, defaultConfig);
      return posed(configOrElement)(mergedConfig);
    };
  }
  const mergedConfig = defaults(configOrElement, defaultConfig);
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

const PageRowPosedFactory = configurablePose({
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
});

const PoseGroupItemFactory = configurablePose({
  preEnter: { opacity: 0, x: "-20%", transition },
  enter: { opacity: 1, x: 0, transition, delay: 150 },
  exit: { opacity: 0, x: "20%", transition },
});

const ListItemPosedFactory = configurablePose({
  open: {
    opacity: 1,
    x: 0,
    transition,
  },
  closed: {
    opacity: 0,
    x: "-20%",
    transition,
  },
});

const OpenClosePosedFactory = configurablePose({
  open: {
    opacity: 1,
    height: "auto",
    beforeChildren: true,
    transition,
  },
  closed: {
    opacity: 0,
    height: 0,
    transition,
  },
});

export {
  PagePosedFactory,
  PageRowPosedFactory,
  PoseGroupItemFactory,
  ListItemPosedFactory,
  OpenClosePosedFactory,
};
