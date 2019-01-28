import React from "react";
import { Card, Icon, Segment } from "semantic-ui-react";

import { processCategory, processMissing } from ".";

const DeltaCardDetailView = ({ delta, ...props }) => {
  const { cardHeader, cardMeta, cardDescription, cardExtra, helperPopup } =
    delta.type === "missing" ? processMissing(delta) : processCategory(delta);

  const label = (
    <Card.Content extra attached="bottom">
      <a>
        <Icon name="lightbulb outline" />
        What does this mean?
      </a>
    </Card.Content>
  );
  return (
    <Segment basic padded>
      <Card raised {...props} fluid>
        <Card.Content>
          <Card.Header>{cardHeader}</Card.Header>
          {cardMeta ? <Card.Meta>{cardMeta}</Card.Meta> : null}
        </Card.Content>
        <Card.Content textAlign="center">
          <Card.Description>{cardDescription}</Card.Description>
        </Card.Content>
        {cardExtra ? <Card.Content extra>{cardExtra}</Card.Content> : null}
        {/* Add an empty extra as padding for label */}
        {helperPopup ? helperPopup(label) : null}
      </Card>
    </Segment>
  );
};

export default DeltaCardDetailView;
