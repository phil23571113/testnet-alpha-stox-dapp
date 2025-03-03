
import Box from '@mui/material/Box';

import { CommonPageBackground } from '../../components/surfaces/CommonPageBackground';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import UniswapPool from '../../components/uniswapPool/UniswapPool';
import TestnetBox from '../../assets/elements/CustomBox';



export default function TokenomicsPage() {


    return (

        <CommonPageBackground>
            <Box display="flex" flexDirection="column" marginTop="10vh" >
                <Stack rowGap={2}>
                    <Grid container columnSpacing={2} rowSpacing={2} >
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TestnetBox />
                        </Grid>
                        <Grid size={12} >
                            <UniswapPool />
                        </Grid>
                    </Grid>



                </Stack>
            </Box>


        </CommonPageBackground>
    );
}