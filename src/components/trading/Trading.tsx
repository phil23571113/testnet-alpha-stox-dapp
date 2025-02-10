import * as React from 'react'
import {
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { nvidiaOrderBookContractConfig } from '../../assets/contracts/dev/NvidiaOrderBook';
import { stoxContractConfig } from '../../assets/contracts/dev/Stox';
import { nvidiaContractConfig } from '../../assets/contracts/dev/Nvidia';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import { ethers } from 'ethers';
import Button from '@mui/material/Button';
import { ButtonProps } from '@mui/material/Button';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import { SnackbarCloseReason } from '@mui/material/Snackbar';
import GetReserves from '../liquidityPoolPricing/LiquidityPoolPricing'


export default function Trading() {

  const [price, setPrice] = useState('0');
  const [priceInStox, setPriceInStox] = useState(0);
  const [quantity, setQuantity] = useState('0');


  const [currencyReserves, setCurrencyReserves] = useState<any | null>(null);
  const [assetReserves, setAssetReserves] = useState<any | null>(null);
  const [stoxPrice, setStoxPrice] = useState<any | null>(null);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[0-9.]*$/.test(value)) {
      setPrice(value);
      setPriceInStox(Number(value) / stoxPrice);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[0-9.]*$/.test(value)) {
      setQuantity(value);
    }
  };




  const SellButton = styled(Button)<ButtonProps>(() => ({
    color: '#FFFFFF',
    height: 24,
    width: 100,
    backgroundColor: '#E74C3C',
    '&:hover': {
      backgroundColor: '#E74C3C',
    },
  }));

  const BuyButton = styled(Button)<ButtonProps>(() => ({
    color: '#FFFFFF',
    height: 24,
    width: 100,
    backgroundColor: '#27AE60',
    '&:hover': {
      backgroundColor: '#27AE60',
    },
  }));

  const {
    data: stoxApproveHash,
    error: stoxApproveError,
    isPending: stoxApproveIsPending,
    writeContract: stoxApproveWriteContract
  } = useWriteContract()

  const {
    data: nvidiaApproveHash,
    error: nvidiaApproveError,
    isPending: nvidiaApproveIsPending,
    writeContract: nvidiaApproveWriteContract
  } = useWriteContract()

  const {
    data: buyOrderHash,
    error: buyOrderError,
    isPending: buyOrderIsPending,
    writeContract: buyOrderWriteContract
  } = useWriteContract()

  const {
    data: sellOrderHash,
    error: sellOrderError,
    isPending: sellOrderIsPending,
    writeContract: sellOrderWriteContract
  } = useWriteContract()

  const { isLoading: stoxApproveIsConfirming, isSuccess: stoxApproveIsConfirmed } =
    useWaitForTransactionReceipt({
      hash: stoxApproveHash,
    })

  const { isLoading: nvidiaApproveIsConfirming, isSuccess: nvidiaApproveIsConfirmed } =
    useWaitForTransactionReceipt({
      hash: nvidiaApproveHash,
    })

  const { isLoading: buyOrderIsConfirming, isSuccess: buyOrderIsConfirmed } =
    useWaitForTransactionReceipt({
      hash: buyOrderHash,
    })

  const { isLoading: sellOrderIsConfirming, isSuccess: sellOrderIsConfirmed } =
    useWaitForTransactionReceipt({
      hash: sellOrderHash,
    })

  /*   const { isLoading: isConfirming, isSuccess: isConfirmed } =
      useWaitForTransactionReceipt({
        hash,
      }) */

  const [snackBarOpen, setSnackBarOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');

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
  async function placeBuyOrder() {


    // 1. Deposit STOX as collateral 

    // const stoxMultiplier = ethers.FixedNumber.fromString(stoxPrice.toString(),{ decimals: 30 , signed: false , width: 128 })

    // console.log("stoxMultiplier", stoxMultiplier)
    console.log("priceInStox", priceInStox)



    console.log(ethers.FixedNumber.fromString(price))

    // const priceFN = ethers.FixedNumber.fromString(price).div(stoxMultiplier)
    const quantityFN = ethers.FixedNumber.fromString(quantity)

    const priceInStoxFn = ethers.FixedNumber.fromString(priceInStox.toString()).round(0)



    //const decimalsFN = ethers.FixedNumber.fromString("1000000000000000000")

    //console.log("priceFN", priceFN.value)
    console.log("quantityFN", quantityFN.value)

    // console.log("Approval requested for: ", (priceFN.mul(quantityFN)).value)
    const result = await stoxApproveWriteContract({
      address: stoxContractConfig.address,
      abi: stoxContractConfig.abi,
      functionName: 'approve',
      args: [nvidiaOrderBookContractConfig.address, BigInt((priceInStoxFn.mul(quantityFN)).value.toString())],
    })
    console.log("result", result)
    console.log("Waiting for confirmation")

  }

  useEffect(() => {
    if (stoxPrice == null) {
      return
    }

    //const stoxMultiplier = ethers.FixedNumber.fromString(stoxPrice.toString())

    console.log(ethers.FixedNumber.fromString(price))

    // const priceFN = ethers.FixedNumber.fromString(price).mul(stoxMultiplier)
    const quantityFN = ethers.FixedNumber.fromString(quantity)

    const priceInStoxFn = ethers.FixedNumber.fromString(priceInStox.toString()).round(0)


    if (stoxApproveIsConfirmed) {
      console.log("stoxApproveIsConfirmed", stoxApproveIsConfirmed)
      buyOrderWriteContract({
        address: nvidiaOrderBookContractConfig.address,
        abi: nvidiaOrderBookContractConfig.abi,
        functionName: 'placeBuy',
        args: [BigInt(priceInStoxFn.value.toString()), BigInt(quantityFN.value.toString())],
      })
    }
  }
    , [stoxApproveIsConfirmed])

  useEffect(() => {
    if (buyOrderIsConfirmed) {
      handleSnackBarOpen("Order placed successfully")
    }
  }
    , [buyOrderIsConfirmed])

  useEffect(() => {
    if (sellOrderIsConfirmed) {
      handleSnackBarOpen("Order placed successfully")
    }
  }
    , [sellOrderIsConfirmed])

  useEffect(() => {

    if (stoxApproveError) {
      handleSnackBarOpen("Approval failed")
    }
  }, [stoxApproveError])

  useEffect(() => {

    if (nvidiaApproveError) {
      handleSnackBarOpen("Approval failed")
    }
  }, [nvidiaApproveError])

  useEffect(() => {

    if (buyOrderError) {
      handleSnackBarOpen("Order failed")
    }
  }, [buyOrderError])

  useEffect(() => {

    if (sellOrderError) {
      handleSnackBarOpen("Order failed")
    }
  }, [sellOrderError])

  useEffect(() => {
    const interval = setInterval(() => {
      GetReserves().then((reserves) => {
        setCurrencyReserves(reserves.token0Reserve);
        setAssetReserves(reserves.token1Reserve);
        setStoxPrice(Number(reserves.token0Reserve.reserve) / Number(reserves.token1Reserve.reserve));
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  async function placeSellOrder() {
    // 1. Deposit NVIDIA as collateral 


    const quantityFN = ethers.FixedNumber.fromString(quantity)


    nvidiaApproveWriteContract({
      address: nvidiaContractConfig.address,
      abi: nvidiaContractConfig.abi,
      functionName: 'approve',
      args: [nvidiaOrderBookContractConfig.address, BigInt(quantityFN.value.toString())],
    })
    console.log("Waiting for confirmation")

  }

  useEffect(() => {
    if (nvidiaApproveIsConfirmed) {

      //const priceFN = ethers.FixedNumber.fromString(price)
      const quantityFN = ethers.FixedNumber.fromString(quantity)

      const priceInStoxFn = ethers.FixedNumber.fromString(priceInStox.toString()).round(0)


      sellOrderWriteContract({
        address: nvidiaOrderBookContractConfig.address,
        abi: nvidiaOrderBookContractConfig.abi,
        functionName: 'placeSell',
        args: [BigInt(priceInStoxFn.value.toString()), BigInt(quantityFN.value.toString())],
      })
    }
  }, [nvidiaApproveIsConfirmed])

  const formatNumber = (number: number, digits: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(number);
  };


  return (
    <Box sx={{
     


    }}>
      <Stack sx={{ padding: 2, backgroundColor: 'rgba(153, 184, 237, 0.5)', borderRadius: 2}} height={{ xs: 180, md: 120 }}>
        <Grid container sx={{ marginBottom: 0.1, marginTop: -2.5, marginLeft: -1 }}>
          <Grid size={1} >
            <Typography sx={{ fontWeight: 700 }} color='#1e163b' variant="overline">Trading</Typography>
          </Grid>

        </Grid>
        <Grid container display="flex" justifyContent="center" alignItems="center" spacing={1}  >

          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">

            <TextField
              size="small"
              label={assetReserves !== null ? `${(currencyReserves.symbol)} ` : 'Loading ccy...'}
              id="outlined-basic"
              
              onChange={handlePriceChange}
              defaultValue={0}
              sx={{
                width: '10ch',
                height: '35px', // Increase the height
                '& .MuiOutlinedInput-root': {
                    height: '100%', // Ensure the input takes the full height of the TextField
                },
                '& .MuiOutlinedInput-input': {
                    padding: '10px 14px', // Adjust padding to vertically center the text
                     // Smaller text size
                },
                '& .MuiInputAdornment-root': {
                    height: '25px',
                },
            }}
            />
          </Grid>

          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <Stack alignContent={"center"} justifyContent={"center"} alignItems={"center"} spacing={1}>
              <Typography variant="caption" color='#1e163b'>
                {assetReserves !== null ? `Price in ${(assetReserves.symbol)} ` : 'Loading ccy...'}
              </Typography>
              <Typography variant="caption" color='#1e163b'>
                {formatNumber(priceInStox, 2)}
              </Typography>
            </Stack>

          </Grid>

          <Grid display="flex" justifyContent="center" alignItems="center" size="grow">
            <TextField
              size="small"
              label="Quantity"
              id="outlined-basic"
              defaultValue={0}
              
              sx={{
                width: '10ch',
                height: '35px', // Increase the height
                '& .MuiOutlinedInput-root': {
                    height: '100%', // Ensure the input takes the full height of the TextField
                },
                '& .MuiOutlinedInput-input': {
                    padding: '10px 14px', // Adjust padding to vertically center the text
                     // Smaller text size
                },
                '& .MuiInputAdornment-root': {
                    height: '25px',
                },
            }}
              //value={quantity}
              onChange={handleQuantityChange}
            />
          </Grid>

        </Grid>
        <Grid container display="flex" justifyContent="center" alignItems="center" spacing={1} sx={{ marginTop: 1 }} >

          <Grid display="flex" justifyContent="center" alignItems="center" size={{ xs: 12, md: 4 }} >
            <BuyButton
              disabled={buyOrderIsPending || stoxApproveIsPending || sellOrderIsPending || nvidiaApproveIsPending || buyOrderIsConfirming || stoxApproveIsConfirming || sellOrderIsConfirming || nvidiaApproveIsConfirming}
              onClick={placeBuyOrder}
              color="success"
              variant="contained"
              size="small"
            >
              {buyOrderIsPending || stoxApproveIsPending || sellOrderIsPending || nvidiaApproveIsPending || buyOrderIsConfirming || stoxApproveIsConfirming || sellOrderIsConfirming || nvidiaApproveIsConfirming ? 'Pending...' : <>
                BUY
              </>}
            </BuyButton>
          </Grid>
          <Grid display="flex" justifyContent="center" alignItems="center" size={{ xs: 12, md: 4 }}>
            <SellButton
              disabled={buyOrderIsPending || stoxApproveIsPending || sellOrderIsPending || nvidiaApproveIsPending || buyOrderIsConfirming || stoxApproveIsConfirming || sellOrderIsConfirming || nvidiaApproveIsConfirming}
              onClick={placeSellOrder}
              color="error"
              variant="contained"
              size="small"
            >
              {buyOrderIsPending || stoxApproveIsPending || sellOrderIsPending || nvidiaApproveIsPending || buyOrderIsConfirming || stoxApproveIsConfirming || sellOrderIsConfirming || nvidiaApproveIsConfirming ? 'Pending...' : <>
                SELL
              </>}
            </SellButton>
          </Grid>

        </Grid>
      </Stack>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        message={message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
}