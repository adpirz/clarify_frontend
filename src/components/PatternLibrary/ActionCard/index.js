import React from "react";
import FormView from "./ActionCardFormView";
import DetailView from "./ActionCardDetailView";

const ActionCard = ({ action, detailView, ...props }) => {
  if (detailView) return <DetailView action={action} {...props} />;
  return null;
};

export default ActionCard;
export { FormView as ActionFormView };
