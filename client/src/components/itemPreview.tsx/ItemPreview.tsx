import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { RootStoreContext } from '../../contexts/RootStoreContext';
import { Item } from '../../models/Item';
import { ItemPreviewStore } from './ItemPreviewStore';
import { ArmorPreview } from './sub/ArmorPreview';
import { defColor } from './sub/common';
import { JewelryPreview } from './sub/JewelryPreview';
import { OtherOctetPreview } from './sub/OtherOctetPreview';
import { WeaponPreview } from './sub/WeaponPreview';

export interface ItemPreviewProps {
    item: Item;
}

const useStyles = makeStyles({
    bubble: {
        position: 'relative',
        top: 20,
        left: '50%',
        padding: '5px 15px',
        fontFamily: 'arial',
        fontSize: 14,
        userSelect: 'none',
        color: '#eee',
        textDecoration: 'none',
        borderRadius: 5,
        minWidth: 150,
        width: '100%',
        maxWidth: 320,
        minHeight: 100,
        display: 'inline-block',
        // opacity: 0.6,
        backgroundColor: '#000',
        border: '2px solid #bbb',
        float: 'left',
        verticalAlign: 'top',
        transform: 'translateX(-50%)',
        '& > div': {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            '& > p:first-child': {
                marginRight: 6
            }
        }
    }
});

export const renderMap = {
    "W": WeaponPreview,
    "A": ArmorPreview,
    "J": JewelryPreview,
    "B": ArmorPreview,
    "O": OtherOctetPreview,
    "U": OtherOctetPreview,
    "Default": () => null
}

export const ItemPreview = observer((props: ItemPreviewProps) => {

    const rootStore = React.useContext(RootStoreContext);
    const data = rootStore.pwServerStore.data;
    const classes = useStyles();
    const store = React.useState(() => new ItemPreviewStore(data, props.item))[0];
    if (store.item?.id !== props.item?.id) {
        store.setItem(props.item);
    }

    React.useEffect(() => store.dispose, [store]);
    if (!store.item || !store.item.data) { return null; }
    const [mainCat, subCat] = store.getCategories() || [];

    let Render = renderMap[(subCat?.shortId || mainCat!.shortId) as keyof typeof renderMap];
    if (!Render) { Render = renderMap['Default']; }

    return (
        <Grid 
            container 
            direction='column'
            className={classes.bubble} 
            style={{ color: defColor, paddingBottom: 12 }}
        >
            <Render store={store} data={data} />
        </Grid>
    );
});
