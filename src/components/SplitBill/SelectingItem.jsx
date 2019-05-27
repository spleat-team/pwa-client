/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faShekelSign } from '@fortawesome/free-solid-svg-icons';

function SelectingItem(props) {
  library.add(faShekelSign);

  const Dish = ({ data }) => (
    <img
      style={{ height: 25 + 'px', width: 200 + 'px' }}
      src={`data:image/jpeg;base64,${data}`}
    />
  );
  return (
    <div>
      <ListItem dir={'rtl'}>
        <Checkbox
          id={props.item._id.toString()}
          color="primary"
          onClick={() => props.handle(props.item._id.toString())}
          checked={props.checked !== -1}
        />
        <ListItemAvatar>
          <Dish data={props.item.image} />
        </ListItemAvatar>
        <ListItemText>
          {props.item.price}
          <ListItemIcon style={{ marginRight: 7 + 'px' }}>
            <FontAwesomeIcon icon="shekel-sign" />
          </ListItemIcon>
        </ListItemText>
      </ListItem>
    </div>
  );
}

export default SelectingItem;
