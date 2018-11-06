import React from "react";
import styled from "styled-components";
import posed from "react-pose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import colors from "../colors";

const ActionsBarStyled = styled.div`
  width: 40%;
  height: 100%;
  max-width: 300px;
  display: flex;
  justify-content: space-between;
`;

const ActionContainerPosed = posed.div({
  hoverable: true,
  pressable: true,
  init: {
    scale: 1,
    color: "#666"
  },
  hover: {
    scale: 1.1,
    color: "#ded",
    transition: { duration: 150 }
  },
  press: {
    scale: 0.7,
    color: "#888",
    transition: { duration: 70 }
  }
});

const ActionContainerStyled = styled(ActionContainerPosed)`
  height: 100%;
  width: 25%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }
`;

const ActionsBar = props => {
  const { handleClick, removeDelta } = props;
  const icons = ["comment", "pencil-alt", "phone", "archive"];
  return (
    <ActionsBarStyled>
      {icons.map((icon, i) => (
        <ActionContainerStyled
          key={i}
          onClick={i === 3 ? removeDelta : handleClick}
        >
          <FontAwesomeIcon icon={icon} />
        </ActionContainerStyled>
      ))}
    </ActionsBarStyled>
  );
};

export default ActionsBar;
