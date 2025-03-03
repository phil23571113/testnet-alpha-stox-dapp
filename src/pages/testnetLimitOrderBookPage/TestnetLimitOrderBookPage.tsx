
import Box from '@mui/material/Box';

import { SimplePageBackground } from '../../components/surfaces/CommonPageBackground';

import { AreaChart } from '../../components/chart/Chart';
import OrderBook from '../../components/orderBook/OrderBook';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Trading from '../../components/trading/Trading';
import Withdrawals from '../../components/withdrawals/Withdrawals';
import StoxEcosystem from '../../components/stoxEcosystem/StoxEcosystem';
import Executions from '../../components/executions/Executions';
import TestnetBox from '../../assets/elements/CustomBox';
export default function TestnetLimitOrderBookPage() {

    return (

        <SimplePageBackground>
            <Box display="flex" flexDirection="column" marginTop="10vh" >
                <Stack rowGap={2}>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TestnetBox/>
                    </Grid>
                    <Grid container columnSpacing={2} rowSpacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <AreaChart />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <OrderBook />
                        </Grid>
                    </Grid>
                    <Grid container columnSpacing={2} rowSpacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Trading />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Withdrawals />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <StoxEcosystem />
                        </Grid>
                    </Grid>
                    <Grid container columnSpacing={2} rowSpacing={2}>
                        <Grid size={12}>
                            <Executions />
                        </Grid>
                    </Grid>

                </Stack>
            </Box>

        </SimplePageBackground>
    );
}