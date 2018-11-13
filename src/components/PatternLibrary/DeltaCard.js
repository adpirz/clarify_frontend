import React from "react";
import { Card, Container, Statistic } from "semantic-ui-react";
import posed from "react-pose";

const Posed = posed.div({
  enter: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: -30,
    opacity: 0
  }
});

export default function(props) {
  const { delta } = props;

  /* 
  Category grades:
    - header: gradebook name
    - meta: category 
    - description: change,
    - extra: context
  */

  let header;
  let content;
  let extra;
  let meta;
  let color;
  let value;

  if (delta.type === "category") {
    header = delta.gradebook_name;
    meta = delta.context_record.category_name;
    value = Math.round(
      (delta.category_average_after - delta.category_average_before) * 100
    );
    color = value > 0 ? "green" : "red";
    extra = (
      <div>
        <p>
          Student's Current Average:{" "}
          {Math.round(delta.category_average_after * 100)}
        </p>
        <p>
          Class Average at this point:{" "}
          {Math.round(
            (delta.context_record.average_points_earned /
              delta.context_record.total_points_possible) *
              100
          )}
        </p>
      </div>
    );
    content = (
      <div>
        <p>Last Assignment: {delta.last_assignment}</p>
        <p>
          Score: {delta.last_assignment_score} / {delta.last_assignment_points}
        </p>
      </div>
    );
  } else {
    header = "Missing Assignment";
    meta = delta.gradebook_name;
    color = "purple";
    value = delta.missing_assignments && delta.missing_assignments.length;
    content = (
      <div>
        {delta.missing_assignments.map(ma => (
          <div key={ma.assignment_id}>
            <p>{ma.assignment_name}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Posed>
      <Container
        style={{
          margin: "20px auto"
        }}
      >
        <Card>
          <Card.Content header={header} meta={meta} />
          <Card.Content style={{ textAlign: "center" }}>
            <Statistic value={value} color={color} />
            <p>{delta.sort_date}</p>
          </Card.Content>
          <Card.Content>{content}</Card.Content>
          <Card.Content>{extra}</Card.Content>
          <Card.Content extra>{delta.delta_id}</Card.Content>
        </Card>
      </Container>
    </Posed>
  );
}
