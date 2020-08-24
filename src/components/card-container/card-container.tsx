import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

import clsx from "clsx";

import {
  CircularProgress,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";

import { useSnackbar } from "notistack";

import CardComponent from "../card/card";

import { getCards } from "../../api";
import { PagedCardsResponse } from "../../models/card";

import useDebouncedValue from "../../use-debounced-value";

interface Props {
  className?: string;
}

const useStyles = makeStyles((theme) => ({
  centeredContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  cardsContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  searchControl: {
    marginBottom: theme.spacing(2),
  },
  cardContainer: {
    margin: theme.spacing(2),
  },
  loadingIndicator: {
    textAlign: "center",
  },
}));

/* Additional thoughts / comments

I'm not currently displaying a loading indicator when the user is performing a name search query when there is data already.
We could wipe the existing data and have it show a loading indicator, but I didn't like the workflow as much.
 
Should probably make the search control only hide itself on initial load.
Then just disable it when a search is being performed and keep it visible while showing a different spinner.

Maybe instead of using a debounced search we could make the user actually trigger a search via a fully proper form (accessibility concerns + prevent unintentional searches).
This would probably mean adding an actual search button and then allowing keyboard shortcuts for form submission from within the search box.

We should use list virtualization to prevent all the items being added as new dom elements when we scroll down the list and for baseline perf.
Most likely solution is using slightly more complex off the shelf solutions. I just used a fairly basic infinite scroll solution with a super minimal api.
*/

const CardContainerComponent = (props: Props) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<PagedCardsResponse | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { debounceValue, value, onValueChange } = useDebouncedValue<string>("");

  useEffect(() => {
    const fetchCardsResponse = async (search?: string) => {
      try {
        const fetchedCardsResponse = await getCards({ search: search });
        setData(fetchedCardsResponse);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    setLoading(true);
    fetchCardsResponse(debounceValue);
  }, [debounceValue, enqueueSnackbar]);

  const fetchAdditionalCards = async () => {
    if (data?._links?.next) {
      try {
        const cardsResponse = await getCards({ url: data._links.next });
        setData((data) => {
          if (data) {
            return {
              ...cardsResponse,
              cards: [...data.cards, ...cardsResponse.cards],
            };
          } else {
            return cardsResponse;
          }
        });
      } catch (err) {
        enqueueSnackbar("Failed to retrieve additional cards.");
      }
    }
  };

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onValueChange(event.target.value);

  return (
    <div className={clsx(props.className)}>
      {data !== null ? (
        <div className={classes.contentContainer}>
          <TextField
            className={classes.searchControl}
            label="Search"
            value={value}
            onChange={onSearchChange}
            autoFocus
            fullWidth
          />
          <InfiniteScroll
            loadMore={fetchAdditionalCards}
            hasMore={data.cards.length < data._totalCount}
            loader={
              <Typography
                key={0}
                className={classes.loadingIndicator}
                variant="body2"
                gutterBottom
              >
                Loading...
              </Typography>
            }
          >
            <div className={classes.cardsContainer}>
              {data.cards.map((c) => (
                <CardComponent
                  key={c.id}
                  className={classes.cardContainer}
                  card={c}
                />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      ) : (
        <div className={classes.centeredContainer}>
          {loading && <CircularProgress size={64} />}
          {error && (
            <Typography variant="h4">Failed to retrieve cards.</Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default CardContainerComponent;
