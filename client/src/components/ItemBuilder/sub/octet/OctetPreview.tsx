
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Grid, IconButton, Input, InputAdornment } from '@mui/material';
import { ItemBuilderStore } from "../../ItemBuilderStore";

interface OctetPreviewProps {
    store: ItemBuilderStore;
}

export const OctetPreview = (props: OctetPreviewProps) => {
    return (
        <Grid container direction='column'>
            <Grid item>
                <Input
                    id="outlined-adornment-password"
                    type={'text'}
                    value={'23212'}
                    // onChange={handleChange('password')}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                // onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                edge="end"
                                children={<ContentCopyIcon />}
                            />
                        </InputAdornment>
                    }
                />
            </Grid>
        </Grid>
    );
}