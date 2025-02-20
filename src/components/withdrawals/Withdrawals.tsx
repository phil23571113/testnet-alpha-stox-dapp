import { nvidiaOrderBookContractConfig } from '../../assets/contracts/dev/NvidiaOrderBook';
import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi'
import Grid from '@mui/material/Grid2';
import {

    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi'
import Button, { ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import React, { useState, useEffect, } from 'react';

import Snackbar from '@mui/material/Snackbar';
import { SnackbarCloseReason } from '@mui/material/Snackbar';
import SingleComponentStack from '../../assets/elements/CustomStack';
import StackTitle from '../buildingBlocks/StackTitle';
import { TableTitleTypography, NumbersTypography, ButtonTypography } from '../../assets/elements/CustomTypography';


const WithdrawButton = styled(Button)<ButtonProps>(() => ({
    color: '#1e163b',
    width: 100,

    height: 24,
    padding: '10px 20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    backgroundColor: '#ff9800', // Orange color for the button
    '&:hover': {
        backgroundColor: '#fb8c00', // Darker orange color for hover state
    },
    textTransform: 'none',
}));


export default function Withdrawals() {
    const { address: connectedWalletAddress } = useAccount();

    const { data: withdrawalbleSecurities } = useReadContract({
        ...nvidiaOrderBookContractConfig,
        functionName: 'getWithdrawableSecurities',
        args: [],
        account: connectedWalletAddress,
        query: { refetchInterval: 1000, refetchIntervalInBackground: true }
    })

    const { data: withdrawalbleCurrencies } = useReadContract({
        ...nvidiaOrderBookContractConfig,
        functionName: 'getWithdrawableCurrencies',
        args: [],
        account: connectedWalletAddress,
        query: { refetchInterval: 1000, refetchIntervalInBackground: true }
    })

    const withdrawalbleSecuritiesInBigInt = withdrawalbleSecurities ? BigInt(withdrawalbleSecurities.toString()) : 0n;
    const withdrawalbleSecuritiesFormatted = withdrawalbleSecuritiesInBigInt / (10n ** 18n);

    const withdrawalbleCurrenciesInBigInt = withdrawalbleCurrencies ? BigInt(withdrawalbleCurrencies.toString()) : 0n;
    const withdrawalbleCurrenciesFormatted = withdrawalbleCurrenciesInBigInt / (10n ** 18n);


    const {
        data: withdrawCurrenciesHash,
        error: withdrawCurrenciesError,
        isPending: withdrawCurrenciesIsPending,
        writeContract: withdrawCurrenciesWriteContract
    } = useWriteContract()

    const { isLoading: withdrawCurrenciesIsConfirming, isSuccess: withdrawCurrenciesIsConfirmed } =
        useWaitForTransactionReceipt({
            hash: withdrawCurrenciesHash,
        })

    async function withdrawCurrencies() {
        await withdrawCurrenciesWriteContract({
            address: nvidiaOrderBookContractConfig.address,
            abi: nvidiaOrderBookContractConfig.abi,
            functionName: 'withdrawCurrencies',
            args: [],
        })
    }




    const {
        data: withdrawSecuritiesHash,
        error: withdrawSecuritiesError,
        isPending: withdrawSecuritiesIsPending,
        writeContract: withdrawSecuritiesWriteContract
    } = useWriteContract()

    const { isLoading: withdrawSecuritiesIsConfirming, isSuccess: withdrawSecuritiesIsConfirmed } =
        useWaitForTransactionReceipt({
            hash: withdrawSecuritiesHash,
        })



    async function withdrawSecurities() {
        await withdrawSecuritiesWriteContract({
            address: nvidiaOrderBookContractConfig.address,
            abi: nvidiaOrderBookContractConfig.abi,
            functionName: 'withdrawSecurities',
            args: [],
        })
    }

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSnackBarOpen = (message: string) => {
        setMessage(message);
        setSnackBarOpen(true);
    };

    const handleSnackBarClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarOpen(false);
    };

    useEffect(() => {
        if (withdrawCurrenciesIsConfirmed) {
            handleSnackBarOpen('Withdrawal of currencies successful');
        }
    }
        , [withdrawCurrenciesIsConfirmed])

    useEffect(() => {
        if (withdrawSecuritiesIsConfirmed) {
            handleSnackBarOpen('Withdrawal of securities successful');
        }
    }
        , [withdrawSecuritiesIsConfirmed])

    useEffect(() => {
        if (withdrawCurrenciesError) {
            handleSnackBarOpen('Error withdrawing currencies');
        }
    }
        , [withdrawCurrenciesError])

    useEffect(() => {
        if (withdrawSecuritiesError) {
            handleSnackBarOpen('Error withdrawing securities');
        }
    }
        , [withdrawSecuritiesError])




    return (
        <Box >
            <SingleComponentStack height={120}>

            <StackTitle
                title='Withdrawals'  />

<Grid container direction={'column'} rowGap={1} >
                <Grid container >
                    <Grid size={6} justifyItems={'center'}>
                        <TableTitleTypography>STOX</TableTitleTypography>
                    </Grid>

                    <Grid size={6} justifyItems={'center'}>

                        <TableTitleTypography>NVIDIA</TableTitleTypography>
                    </Grid>

                </Grid>
                <Grid container>
                    <Grid size={6} justifyItems={'center'} >
                        <NumbersTypography sx={{ fontWeight: 700 }}>{withdrawalbleCurrenciesFormatted?.toString()}</NumbersTypography>
                    </Grid>
                    <Grid size={6} justifyItems={'center'}>
                        <NumbersTypography  sx={{ fontWeight: 700 }}>{withdrawalbleSecuritiesFormatted?.toString()}</NumbersTypography>
                    </Grid>
                </Grid>
                <Grid container sx={{ marginTop: 1 }}>
                    <Grid container size={6} justifyContent={'center'} >

                        <WithdrawButton
                            disabled={withdrawCurrenciesIsPending || withdrawCurrenciesIsConfirming}
                            onClick={withdrawCurrencies}
                            color="error"
                            variant="contained"
                            size="small"
                        >
                            {withdrawCurrenciesIsPending || withdrawCurrenciesIsConfirming ? 'Pending...' : <>
                                <ButtonTypography
                                >WITHDRAW</ButtonTypography>
                            </>}
                        </WithdrawButton>
                    </Grid>


                    <Grid container size={6} justifyContent={'center'} >



                        <WithdrawButton
                            disabled={withdrawSecuritiesIsPending || withdrawSecuritiesIsConfirming}
                            onClick={withdrawSecurities}
                            color="error"
                            variant="contained"
                            size="small"

                        >
                            {withdrawSecuritiesIsPending || withdrawSecuritiesIsConfirming ? 'Pending...' : <>
                                <ButtonTypography>WITHDRAW</ButtonTypography>
                            </>}</WithdrawButton>


                    </Grid>

                </Grid>
                </Grid>

            </SingleComponentStack>
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={3000}
                onClose={handleSnackBarClose}
                message={message}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </Box>
    )
}


