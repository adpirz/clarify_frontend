import React from "react";
import { Card, Icon, Label } from "semantic-ui-react";

import { processCategory, processMissing } from ".";

const DeltaCardSummaryView = ({ delta, ...props }) => {
  const { cardHeader, cardMeta, cardDescription, cardExtra, helperPopup } =
    delta.type === "missing" ? processMissing(delta) : processCategory(delta);

  const label = (
    <Label attached="bottom" as="a">
      <Icon name="lightbulb outline" />
      <Label.Detail>What does this mean?</Label.Detail>
    </Label>
  );
  return (
    <Card raised {...props}>
      <Card.Content>
        {helperPopup ? helperPopup(label) : null}
        <Card.Header>{cardHeader}</Card.Header>
        {cardMeta ? <Card.Meta>{cardMeta}</Card.Meta> : null}
      </Card.Content>
      <Card.Content textAlign="center">
        <Card.Description>{cardDescription}</Card.Description>
      </Card.Content>
      {cardExtra ? <Card.Content extra>{cardExtra}</Card.Content> : null}
      {/* Add an empty extra as padding for label */}
      {helperPopup ? <Card.Content extra /> : null}
    </Card>
  );
};

export default DeltaCardSummaryView;
