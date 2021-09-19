import { observer } from 'mobx-react-lite';
import React from 'react';
import { RootStoreContext } from '../../contexts/RootStoreContext';
import { Item } from '../../models/Item';
import { ItemPreviewStore } from './ItemPreviewStore';

export interface ItemPreviewProps {
    item: Item;
}

export  const ItemPreview = observer((props: ItemPreviewProps) => {

    const rootStore = React.useContext(RootStoreContext);
    const store = React.useState(() => new ItemPreviewStore(rootStore.pwServerStore.data))[0];
    React.useEffect(() => {
        store.setItem(props.item);
    }, [props.item, props.item?.data, store]);

    return (
        <span>aaa</span>
    );
});