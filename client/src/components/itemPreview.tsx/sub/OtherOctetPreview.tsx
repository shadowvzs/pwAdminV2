import { Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { IOctetKeys } from '../../../interfaces/builder';
import { defColor, PreviewRenderProps } from './common';

export const OtherOctetPreview = observer((props: PreviewRenderProps) => {

    const { data, store } = props;
    if (!store.item) { return null; }
    const [cat, subCat] = store.getCategories() || [];
    const octetData1 = store.itemOctetData;
    const { itemColor } = data.item_extra;
    const itemDB = data.item_db.valueMap;
    const itemData = itemDB[store.item.id];

    return (
        <>
            <Grid item style={{ paddingBottom: 6 }}>
                <Typography
                    noWrap
                    variant='body2'
                    children={itemData?.name || 'Unknown'}
                    style={{ color: (itemData?.color && itemColor[itemData.color].code) || defColor }}
                />
            </Grid>
           {Object.keys(octetData1).map((fieldId) => {
               const [label, value] = store.getText(fieldId as any as IOctetKeys);
               if (label.startsWith('Reserved')) { return null; }
               return (
                    <Grid item style={{ paddingBottom: 6 }} key={fieldId}>
                        <Typography
                            noWrap
                            variant='body2'
                            children={`${label} ${value}`}
                            style={{ color: defColor }}
                        />
                    </Grid>
               );
           })}
        </>
    );
});