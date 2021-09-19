import React from "react";
import { observer } from "mobx-react-lite";
import { Button, Grid, IconButton, NativeSelect, Popover, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { RenderComponentProps } from "../../../../interfaces/builder";
import { RootStoreContext } from "../../../../contexts/RootStoreContext";
import { CollapseWrapper } from "../CollapseWrapper";
import { AddonType } from "../../../../interfaces/responses";
import { Addon } from "../../../../models/Addon";
import { AddCircleOutline } from "@mui/icons-material";

interface AddonListItemProps {
    addonDataString: string;
    onDelete: () => void;
}

const AddonListItem = (props: AddonListItemProps) => {
    const { addonDataString, onDelete } = props;
    const addon = React.useState(() => { 
        const a = new Addon(); 
        a.deserialize(addonDataString); 
        return a; 
    })[0];

    return (
        <Grid container wrap='nowrap' alignItems='center' spacing={1} justifyContent='space-between' style={{ padding: '0 16px' }}>
            <Grid item>
                <Typography 
                    variant='body2'
                    children={addon.$name}
                    noWrap
                />
            </Grid>
            <Grid item>
                <IconButton size='small' onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
}

const AddonList = (props: RenderComponentProps<string[]>) => {
    const { value, onChange } = props;

    const onDelete = React.useCallback((index: number) => {
          const v = [...value];
        v.splice(index, 1);
        onChange(v);
    }, [value, onChange]);

    return (
        <Grid 
            container 
            direction='column' 
            style={{ padding: '0 16px' }}
        >
            {value.map((x, idx) => (
                <Grid item xs={12} key={idx}>
                    <Grid item>
                        <AddonListItem 
                            key={idx} 
                            onDelete={() => onDelete(idx)}
                            addonDataString={x} 
                        />
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};

export const AddonSelectBase = (props: RenderComponentProps<string[]>) => {

    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    
    const onOpenClick = React.useCallback((event: React.MouseEvent<Element>) => { 
        setAnchorEl(event.currentTarget); 
    }, []);

    const onClose = React.useCallback(() => { setAnchorEl(null); }, []);

    const title: string = `Addons (${props.value.filter(Boolean).length}): `;

    return (
        <Grid container direction='column'>
            <Grid item xs={12}>
                <Grid 
                    container wrap='nowrap' 
                    alignItems='baseline' 
                    justifyContent='space-between' 
                    spacing={2}
                >
                    <Grid item>
                        <Typography 
                            variant='body2'
                            children={title} 
                            noWrap
                        />
                    </Grid>
                    <Grid item>
                        <IconButton 
                            size='small' 
                            title='add new addon'
                            onClick={onOpenClick}
                        >
                            <AddCircleOutline />
                        </IconButton>
                    </Grid>
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={onClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <AddAddon {...props} onClose={onClose} />                        
                    </Popover>  
                </Grid>
            </Grid>
        </Grid>
    );
}

export const AddAddon = observer((props: RenderComponentProps<string[]> & { onClose: () => void }) => {
    const { pwServerStore } = React.useContext(RootStoreContext);
    const { addons, version } = pwServerStore.data.item_extra;
    const addonList = React.useState(() => {
        const filteredAddons = addons
            .filter(x => (!x.version || x.version <= version) && !x.isHidden)
            .filter(x => x.supportedEquipment.includes(props.category));
        return filteredAddons;
    })[0];

    const addon = React.useState(() => {
        const a = new Addon();
        a.setId(addonList[0]?.id || 0, true);
        return a;
    })[0];

    const [timeUnit, setTimeUnit] = React.useState(1);

    const onAdd = React.useCallback(() => {
        const v = props.value;
        props.onChange([addon.serialize, ...v]);
    }, [addon, props]);

    const isDisabled = isNaN(addon.value1) || isNaN(addon.value2) || (
        !addon.isSkill && addon.value1 <= 0
    ) || (
        addon.isRune && addon.value2 <= 0
    );

    return (
        <Grid 
            container 
            direction='column' 
            style={{ width: 240, padding: 16 }}
        >
            <Grid item>
                <Typography 
                    children={`Add new addon`}
                    variant='h6'
                    noWrap
                />
            </Grid>
            <Grid item>
                <Grid 
                    container 
                    wrap='nowrap' 
                    alignItems='center'
                    spacing={1}
                >
                    <Grid item>
                        <Typography 
                            children={`Addon: `}
                            variant='body2'
                            noWrap
                        />
                    </Grid>
                    <Grid item>
                        <NativeSelect
                            size='small'
                            value={String(addon.id)}
                            onChange={ev => addon.setId(parseInt(ev.currentTarget.value, 10), true)}
                            style={{ fontSize: 12 }}
                        >
                            {addonList.map(addon => (
                                <option 
                                    value={String(addon.id)}
                                    key={addon.id}
                                >
                                    {addon.$name}
                                </option>
                            ))}
                        </NativeSelect>
                    </Grid>
                </Grid>
            </Grid>
            {!addon.isSkill && (
                <Grid item style={{ marginTop: 6 }}>
                    <Grid
                        container wrap='nowrap' 
                        alignItems='center' 
                        justifyContent='space-between' 
                        spacing={1}
                    >
                        <Grid item>
                            <Typography 
                                variant='body2'
                                children={'Value'} 
                                noWrap
                            />
                        </Grid>
                        <Grid item>
                            <input
                                type='number'
                                max={props.config.type.includes('int32') ? 65535 : 255}
                                style={{ width: 60, textAlign: 'right' }}
                                value={String(addon.value1)}
                                disabled={addon.type === AddonType.Skill}
                                onChange={ev => addon.setValue1(parseInt(ev.currentTarget.value, 10))}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            )}
            {addon.isRune && (
                <Grid item style={{ marginTop: 4 }}>
                    <Grid
                        container wrap='nowrap' 
                        alignItems='center' 
                        justifyContent='space-between' 
                        spacing={1}
                    >
                        <Grid item>
                            <Typography 
                                variant='body2'
                                children={'Duration'} 
                                noWrap
                            />
                        </Grid>
                        <Grid item>
                            <input
                                type='number'
                                value={String(addon.value2 / timeUnit)}
                                onChange={ev => addon.setValue2(parseInt(ev.currentTarget.value, 10) * timeUnit)}
                                style={{ width: 50, textAlign: 'right' }}
                                disabled={addon.type !== AddonType.Rune}
                                min='0'
                            />
                        </Grid>
                        <Grid item>
                            <NativeSelect
                                size='small'
                                value={String(timeUnit)}
                                onChange={ev => setTimeUnit(parseInt(ev.currentTarget.value, 10))}
                                disabled={addon.type !== AddonType.Rune}
                                style={{ fontSize: 12 }}
                            >
                                <option value={1}>minute</option>
                                <option value={60}>hour</option>
                                <option value={1440}>day</option>
                            </NativeSelect>                        
                        </Grid>
                    </Grid>
                </Grid>
            )}
            <Grid item style={{ marginTop: addon.isSkill ? 16 : 8 }}>
                <Typography 
                    variant='body2'
                    children={addon.$name} 
                />
            </Grid>
            {addon.isSkill && (
                <Grid item style={{ marginTop: 6 }}>
                    <Typography 
                        variant='body2'
                        children={addon.description} 
                    />
                </Grid>
            )}
            <Grid item style={{ marginTop: 12, textAlign: 'right' }}>
                <Grid container justifyContent='space-around'>
                        <Grid item>
                            <Button 
                                color='primary'
                                variant='contained'
                                size='small'
                                children='Add'
                                disabled={isDisabled}
                                onClick={onAdd}
                            />                        
                        </Grid>
                        <Grid item>
                            <Button 
                                color='secondary'
                                variant='contained'
                                size='small'
                                children='Cancel'
                                onClick={props.onClose}
                            />  
                        </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
});

export const AddonSelectCollapse = (props: RenderComponentProps<string[]>) => {
    return (
        <CollapseWrapper 
            // disabled={props.value.length === 0}
            BaseCmp={() => <AddonSelectBase {...props} />}
            Cmp={() => <AddonList {...props} />} 
            {...props}
        />
    );
};