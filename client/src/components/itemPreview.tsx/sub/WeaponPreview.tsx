import { Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { defColor, PreviewRenderProps } from './common';

export const WeaponPreview = observer((props: PreviewRenderProps) => {

    const { data, store } = props;
    if (!store.item) { return null; }
    const [cat, subCat] = store.getCategories() || [];
    const octetData1 = store.itemOctetData;
    const octetData2 = store.itemOctetDataWithAddons;
    const { itemColor } = data.item_extra;
    const { maxMask } = data.classes;
    const itemDB = data.item_db.valueMap;
    const itemData = itemDB[store.item.id];

    if (cat?.shortId !== 'W') { return null; }

    return (
        <>
            <Grid item style={{ paddingBottom: 6 }}>
                <Typography
                    noWrap
                    variant='body2'
                    children={itemData?.name || 'Unknown'}
                    style={{ color: (itemData?.color && itemColor[itemData.color].code) || defColor }}
                />
                {octetData2.refine > 0 && (
                    <Typography
                        noWrap
                        variant='body2'
                        children={`+${octetData2.refine}`}
                        style={{ color: '#ff0', marginRight: 4 }}
                    />
                )}
                {octetData2.socket?.length > 0 && (
                    <Typography
                        noWrap
                        variant='body2'
                        children={`(${octetData2.socket.length} socket)`}
                        style={{ color: defColor }}
                    />
                )}
            </Grid>
            <Grid item>
                <Typography
                    variant='body2'
                    children={subCat?.label}
                    style={{ color: '#7777ff' }}
                />
            </Grid>
            <Grid item>
                <Typography
                    variant='body2'
                    children={`Grade Rank `}
                />
                <Typography
                    variant='body2'
                    children={octetData2.grade32}
                    style={{ color: octetData1.grade32 !== octetData2.grade32 ? '#7777ff' : defColor }}
                />                  
            </Grid>
            {octetData2.aSpeed > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Attack Freq.: `}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={(20 / octetData2.aSpeed).toFixed(2)}
                        style={{ color: octetData1.aSpeed !== octetData2.aSpeed ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData2.range > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Range:`}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.range}
                        style={{ color: octetData1.range !== octetData2.range ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData2.minRange > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Min. Range:`}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData1.minRange}
                        style={{ color: defColor }}
                    />
                </Grid>
            )}            
            {octetData2.pDmg?.[0] > 0 && (
                <Grid item key={`pdmg${octetData1.pDmg[0]}-${octetData2.pDmg[1]}`}>
                    <Typography
                        variant='body2'
                        children={`Physical Attack: `}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={`${octetData2.pDmg[0]}-${octetData2.pDmg[1]}`}
                        style={{ color: octetData1.pDmg[0] !== octetData2.pDmg[0] ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData2.mDmg?.[0] > 0 && (
                <Grid item key={`pdmg${octetData1.mDmg[0]}-${octetData2.mDmg[1]}`}>
                    <Typography
                        variant='body2'
                        children={`Magic Attack: `}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={`${octetData2.mDmg[0]}-${octetData2.mDmg[1]}`}
                        style={{ color: octetData1.mDmg[0] !== octetData2.mDmg[0] ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData2.durability?.[0] > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Durability: `}
                        style={{ color: defColor }}
                    />
                  <Typography
                        variant='body2'
                        children={octetData2.durability.map(x => Math.floor(x/100)).join('-')}
                        style={{ color: octetData1.durability[0] !== octetData2.durability[0] ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData2.ammo > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Ammo Type: `}
                        style={{ color: defColor }}
                    />
                  <Typography
                        variant='body2'
                        children={octetData2.helper.ammo}
                        style={{ color: defColor }}
                    />
                </Grid>
            )}
            {octetData2.classReq !== maxMask && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Class Req.: `}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={store.itemClassReq(octetData2.classReq)}
                        style={{ color: defColor }}
                    />                    
                </Grid>    
            )}            
            {octetData2.lvReq > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Level Req.: `}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.lvReq}
                        style={{ color: octetData1.lvReq !== octetData2.lvReq ? '#7777ff' : defColor }}
                    />                    
                </Grid>    
            )}
            {octetData2.strReq > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Strength Req.: `}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.strReq}
                        style={{ color: octetData1.strReq !== octetData2.strReq ? '#7777ff' : defColor }}
                    />                    
                </Grid>    
            )}
            {octetData2.agiReq > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Agility Req.: `}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.agiReq}
                        style={{ color: octetData1.agiReq !== octetData2.agiReq ? '#7777ff' : defColor }}
                    />    
                </Grid>    
            )}  
            {octetData2.intReq > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Intelligent Req.: `}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.intReq}
                        style={{ color: octetData1.intReq !== octetData2.intReq ? '#7777ff' : defColor }}
                    />                        
                </Grid>    
            )}  
            {octetData2.conReq > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Constitute Req.: `}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.conReq}
                        style={{ color: octetData1.conReq !== octetData2.conReq ? '#7777ff' : defColor }}
                    />                        
                </Grid>    
            )}
            {octetData2.socket?.filter(Boolean).map((x, idx) => (
                <Grid item style={{ marginLeft: 16 }} key={'socket'+idx}>
                    <Typography
                        variant='body2'
                        children={itemDB[x]?.name || 'Unknown stone'}
                        style={{ color: '#ff0' }}
                    />
                </Grid>    
            ))}
            {(octetData2.addon as unknown as [number, number][]).filter(Boolean).map((x, idx) => (
                <Grid item style={{ marginTop: 8 }} key={'addon'+idx}>
                    <Typography
                        variant='body2'
                        children={store.getAddonText(...x)}
                        style={{ color: '#77f' }}
                    />
                </Grid>    
            ))}       
            {Boolean(octetData2.crafter) && (
                <Grid item style={{ marginTop: 16 }}>
                    <Typography
                        variant='body2'
                        children={`Crafter: ${octetData2.crafter}`}
                        style={{ color: '#ff0' }}
                    />
                </Grid>    
            )}
        </>
    );
});