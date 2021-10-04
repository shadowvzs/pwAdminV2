import { Grid, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { defColor, PreviewRenderProps } from './common';

export const JewelryPreview = observer((props: PreviewRenderProps) => {

    const { data, store } = props;
    if (!store.item) { return null; }
    const [cat, subCat] = store.getCategories() || [];
    const octetData1 = store.itemOctetData;
    const octetData2 = store.itemOctetDataWithAddons;
    const { itemColor } = data.item_extra;
    const { maxMask } = data.classes;
    const itemDB = data.item_db.valueMap;
    const itemData = itemDB[store.item.id];

    if (cat?.shortId !== 'J') { return null; }

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
            {octetData2.pAttack > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Physical Attack: `}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.pAttack}
                        style={{ color: octetData1.pAttack !== octetData2.pAttack ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData2.mAttack > 0 && (
                <Grid item>
                    <Typography
                        variant='body2'
                        children={`Magic Attack:`}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.mAttack}
                        style={{ color: octetData1.mAttack !== octetData2.mAttack ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData2.pDef > 0 && (
                <Grid item key={`pDef${octetData2.pDef}`}>
                    <Typography
                        variant='body2'
                        children={`Physical Defense:`}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.pDef}
                        style={{ color: octetData1.pDef !== octetData2.pDef ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData1.dodge > 0 && (
                <Grid item key={`dodge${octetData2.dodge}`}>
                    <Typography
                        variant='body2'
                        children={`Dodge:`}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.dodge}
                        style={{ color: octetData1.dodge !== octetData2.pDef ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}   
            {octetData1.metalDef > 0 && (
                <Grid item key={`metalDef${octetData2.metalDef}`}>
                    <Typography
                        variant='body2'
                        children={`Metal Defense:`}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.metalDef}
                        style={{ color: octetData1.metalDef !== octetData2.metalDef ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData1.woodDef > 0 && (
                <Grid item key={`woodDef${octetData2.woodDef}`}>
                    <Typography
                        variant='body2'
                        children={`Wood Defense:`}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.woodDef}
                        style={{ color: octetData1.woodDef !== octetData2.woodDef ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData1.waterDef > 0 && (
                <Grid item key={`waterDef${octetData2.waterDef}`}>
                    <Typography
                        variant='body2'
                        children={`Water Defense:`}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.waterDef}
                        style={{ color: octetData1.waterDef !== octetData2.waterDef ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData1.fireDef > 0 && (
                <Grid item key={`fireDef${octetData2.fireDef}`}>
                    <Typography
                        variant='body2'
                        children={`Fire Defense:`}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.fireDef}
                        style={{ color: octetData1.fireDef !== octetData2.fireDef ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData1.earthDef > 0 && (
                <Grid item key={`earthDef${octetData2.earthDef}`}>
                    <Typography
                        variant='body2'
                        children={`Earth Defense:`}
                        style={{ color: defColor }}
                    />
                    <Typography
                        variant='body2'
                        children={octetData2.earthDef}
                        style={{ color: octetData1.earthDef !== octetData2.earthDef ? '#7777ff' : defColor }}
                    />
                </Grid>
            )}
            {octetData2.durability && (
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
            {octetData2.lvReq && (
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