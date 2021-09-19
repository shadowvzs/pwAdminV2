import React from "react";

import { observer } from "mobx-react-lite";
import { ClassMaskBuilderPopover } from "./ClassMaskBuilder";
import { action, makeObservable, observable } from "mobx";
import { ItemBuilderStore } from "../ItemBuilderStore";
import { NumberSelect } from "./octet/NumberSelect";
import { RenderComponentProps } from "../../../interfaces/builder";
import { TextSelect } from "./octet/TextSelect";
import { ComboSelect } from "./octet/ComboSelect";
import { SocketSelectCollapse } from "./octet/SocketSelect";
import { IComplexOctetCategories } from "../../../interfaces/responses";
import { AddonSelectCollapse } from "./octet/AddonSelect";
import { OctetPreview } from "./octet/OctetPreview";
import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";

const useStyles = makeStyles({
    root: {
        padding: '0 16px',
        maxWidth: '100%'
    },
});

export interface OctetBuilderProps {
    store: ItemBuilderStore;
}

export class OctetStore {
    public classMask: number = 0;
    public setClassMask(classMask: number) { this.classMask = classMask; }

    constructor() {
        makeObservable(this, {
            classMask: observable,
            setClassMask: action.bound
        });
    }
}

const RenderComponentMap: Record<string, (props: RenderComponentProps<any>) => JSX.Element> = {
    ClassMaskSelect: ClassMaskBuilderPopover,
    NumberSelect: NumberSelect,
    ComboSelect: ComboSelect,
    TextSelect: TextSelect,
    SocketSelect: SocketSelectCollapse,
    AddonSelect: AddonSelectCollapse
};

export const OctetBuilder = observer((props: OctetBuilderProps) => {

    const classes = useStyles();
    const iBStore = props.store;
    const oFields = iBStore.octetUIData;
    const [cat, subCat] = iBStore.getCategories();
    const usedFields = oFields.filter(x => (
        x.render && 
        Boolean(RenderComponentMap[x.render]) && 
        (x.flag !== 'advanced' || iBStore.showAdvancedUI)
    ));

    return (
        <Grid container direction='column' className={classes.root}>     
            {usedFields.map(x => {
                const Cmp = RenderComponentMap[x.render!];
                return (
                    <Cmp 
                        key={x.id}
                        value={iBStore.itemOctetData[x.id]}
                        onChange={(value: any) => iBStore.setOctet(x.id, value)}
                        config={x}
                        getOctetData={iBStore.getOctet}
                        category={(subCat.shortId || cat.shortId) as IComplexOctetCategories}
                    />
                );
            })}
            <Grid item>
                <OctetPreview store={iBStore} />
            </Grid>
        </Grid>
    );
});
