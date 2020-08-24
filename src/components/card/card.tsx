import React from "react";

import clsx from "clsx";

import {
  Card as MaterialCardComponent,
  CardContent,
  CardHeader,
  CardMedia,
  makeStyles,
  Typography,
} from "@material-ui/core";

import Card from "../../models/card";

interface Props {
  className?: string;
  card: Card;
}

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 320,
    width: "100%",
  },
  image: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
}));

const CardComponent = (props: Props) => {
  const classes = useStyles();

  return (
    <MaterialCardComponent className={clsx(props.className, classes.container)}>
      <CardHeader
        title={props.card.name}
        subheader={`${props.card.type} • ${props.card.set.name}`}
      />
      <CardMedia
        className={classes.image}
        image={props.card.imageUrl}
        title={props.card.name}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.card.text}
        </Typography>
      </CardContent>
    </MaterialCardComponent>
  );
};

export default CardComponent;
