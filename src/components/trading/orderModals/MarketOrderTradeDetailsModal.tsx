import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import SingleComponentStack from "../../../assets/elements/CustomStack";
import useRealTimePrice from '../../../components/customHooks/UseRealTimePrice';
import Grid from '@mui/material/Grid2';
import { NumbersTypography, SubtitleTypography, TableTitleTypography } from "../../../assets/elements/CustomTypography";
import { CustomButton } from "../../../assets/elements/CustomButton";
import CustomTextField from "../../../assets/elements/CustomTextField";
import { Box, } from "@mui/material";
import CurrencyStepper from './CurrencyStepper';
import getPoolReserves from '../../liquidityPoolPricing/LiquidityPoolPricing'
import { useEffect, useState } from 'react';
import { SimpleSnackbar } from '../../../assets/elements/CustomSnackbars';
import { getApproveSpendingConfig, getOrderConfig } from '../../../components/smartContractsInteractions/OrderSending'
import { stoxContractConfig } from '../../../assets/contracts/dev/Stox';
import { nvidiaContractConfig } from '../../../assets/contracts/dev/Nvidia';
import {nvidiaOrderBookContractConfig} from '../../../assets/contracts/dev/NvidiaOrderBook'

import { ethers } from 'ethers';

import { useWriteContract } from 'wagmi';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};


interface TradeDetailsModalProps {
  open: boolean;
  stockTicker: string;
  direction: 'BUY' | 'SELL';
  quantity: number;
  handleClose: () => void;
}




const MarketOrderTradeDetailsModal: React.FC<TradeDetailsModalProps> = ({ open, direction, quantity, stockTicker, handleClose }) => {
  const { price, } = useRealTimePrice(stockTicker);
  const buttonColor = direction === 'BUY' ? 'green' : 'red';
  const [stoxPrice, setStoxPrice] = useState<number>(0);
  const [newQuantity, setNewQuantity] = useState<number>(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>("success");

  const { writeContract: approveStoxSpending, isPending: isPendingStoxSpending, isSuccess: isSuccessStoxSpending, isError: isErrorStoxSpending } = useWriteContract();
  const { writeContract: approveNvdaSpending, isPending: isPendingNvdaSpending, isSuccess: isSuccessNvdaSpending, isError: isErrorNvdaSpending } = useWriteContract();
  const { writeContract: orderSending, isPending: isPendingSendOrder, isSuccess: isSuccessSendOrder, isError: isErrorSendOrder } = useWriteContract();



  function triggerSnackbar(message: string, severity: 'success' | 'error' | 'warning' | 'info') {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[0-9.]*$/.test(value)) {
      console.log("new qty", value)
      setNewQuantity(Number(value));
    }
  };
  useEffect(() => {
    setNewQuantity(quantity);
  }, [quantity]);


  useEffect(() => {
    const fetchPoolReserves = async () => {
      try {
        const reserves = await getPoolReserves("0xDA7FeB22c7701c4DFc05bF34F27AfD122dcd49e2");
        setStoxPrice(Number(reserves.token0.reserve) / Number(reserves.token1.reserve));
      } catch (err) {
        if (err instanceof Error) {
          triggerSnackbar(err.message, "error");
        } else {
          triggerSnackbar(String(err), "error");
        }
      }
    };

    fetchPoolReserves();
  }, []);


  useEffect(() => {
    if (isSuccessStoxSpending) {
      triggerSnackbar('Spending Approved', 'success');
      sendOrder()
    } else if (isErrorStoxSpending) {
      triggerSnackbar('Error in Spending Approval function', 'error');
    } else if (isSuccessNvdaSpending) {
      triggerSnackbar('Spending Approved', 'success');
      sendOrder()
    }else if (isErrorNvdaSpending) {
      triggerSnackbar('Error in Spending Approval function', 'error');
    }
  
  }, [isSuccessStoxSpending, isErrorStoxSpending, isSuccessNvdaSpending, isErrorNvdaSpending]);


  const sendOrder = async () => {
    if (direction === 'BUY') {
      try {
        const quantityFN = ethers.FixedNumber.fromString(newQuantity.toString())
        const assetUsdPriceFN = ethers.FixedNumber.fromString(price.toString())
        const priceOfStoxFn = ethers.FixedNumber.fromString(stoxPrice.toString())
        console.log('stoxPrice', stoxPrice)
        console.log('priceOfStoxFn', priceOfStoxFn)
        console.log('quantityFN', quantityFN)
        console.log('newQuantity', newQuantity)
        console.log('assetUsdPriceFN', assetUsdPriceFN)
        console.log('price', price)
        const config = getOrderConfig(BigInt((assetUsdPriceFN).div(priceOfStoxFn).value.toString()),BigInt(quantityFN.value.toString()),nvidiaOrderBookContractConfig,direction);
        orderSending(config);

      } catch (err) {
        console.error('Error in Spending Approval function:', err);
        triggerSnackbar('Error in Spending Approval function', 'error');
      }
    } else if (direction === 'SELL') {
      try {
        const quantityFN = ethers.FixedNumber.fromString(newQuantity.toString())
        const assetUsdPriceFN = ethers.FixedNumber.fromString(price.toString())
        const priceOfStoxFn = ethers.FixedNumber.fromString(stoxPrice.toString())
        const quantityWithDecimals = ethers.parseUnits(newQuantity.toString(), 18);
        const config = getOrderConfig(BigInt((assetUsdPriceFN).div(priceOfStoxFn).value.toString()),BigInt(quantityFN.value.toString()),nvidiaOrderBookContractConfig,direction);
        orderSending(config);

      } catch (err) {
        console.error('Error in Sending Order function:', err);
        triggerSnackbar('Error in Sending Order  function', 'error');
      }
    }

  };


  const approveSpending = async () => {
    if (direction === 'BUY') {
      try {
        const quantityFN = ethers.FixedNumber.fromString(newQuantity.toString())
        const assetUsdPriceFN = ethers.FixedNumber.fromString(price.toString())
        const priceOfStoxFn = ethers.FixedNumber.fromString(stoxPrice.toString())
        /*console.log('stoxPrice', stoxPrice)
        console.log('priceOfStoxFn', priceOfStoxFn)
        console.log('quantityFN', quantityFN)
        console.log('newQuantity', newQuantity)
        console.log('assetUsdPriceFN', assetUsdPriceFN)
        console.log('price', price)*/
        const config = getApproveSpendingConfig(BigInt(((quantityFN).mul(assetUsdPriceFN).div(priceOfStoxFn)).value.toString()), stoxContractConfig);
        approveStoxSpending(config);

      } catch (err) {
        console.error('Error in Spending Approval function:', err);
        triggerSnackbar('Error in Spending Approval function', 'error');
      }
    } else if (direction === 'SELL') {
      try {
        const quantityWithDecimals = ethers.parseUnits(newQuantity.toString(), 18);
        const config = getApproveSpendingConfig(BigInt(quantityWithDecimals), nvidiaContractConfig);
        approveNvdaSpending(config);

      } catch (err) {
        console.error('Error in Spending Approval function:', err);
        triggerSnackbar('Error in Spending Approval function', 'error');
      }
    }

  };





  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <SingleComponentStack width="20em" height="18em" rowGap="0.5em">
            <Grid container sx={{ marginBottom: "10px" }}>
              <Grid size={6} justifyItems={"center"}  >
                <SubtitleTypography fontSize='1.5em'>
                  {stockTicker}
                </SubtitleTypography>
              </Grid>
              <Grid size={6} justifyItems={"center"} alignItems={"center"} >
                {price !== null ? <NumbersTypography fontSize={"1.75em"}>{price.toFixed(3)}</NumbersTypography> : <NumbersTypography>Loading...</NumbersTypography>}

              </Grid>
            </Grid>
            <Grid container sx={{ marginBottom: "10px" }}>
              <Grid size={6} justifyItems={"center"}>
                <CustomButton
                  fontSize='1.1rem'
                  height={40}
                  width={100}
                  backgroundColor={buttonColor}
                  text={direction}
                  onClick={approveSpending}
                />
              </Grid>
              <Grid size={6} justifyItems={"center"}>
                <CustomTextField
                  marginLeft='2ch'
                  marginTop='0.1ch'
                  label={"Quantity"}
                  defaultValue={quantity}
                  width='7em'
                  onChange={handleQuantityChange}

                />
              </Grid>
            </Grid>
            <Grid size={12} justifyItems={"center"} >
              <TableTitleTypography>
                select currency
              </TableTitleTypography>
            </Grid>
            <Grid size={12}>
              <CurrencyStepper />
            </Grid>
            <Grid container marginTop={'1em'} justifyContent={"center"}>
              <CustomTextField
                width='8em'
                marginLeft='0ch'
                marginTop='0ch'
                label={"Volume"}
                defaultValue={Number((newQuantity / stoxPrice).toFixed(6))}
                value={Number((price * newQuantity / stoxPrice).toFixed(6))}
              />
            </Grid>
          </SingleComponentStack>
          <SimpleSnackbar
            open={snackbarOpen}
            message={snackbarMessage}
            severity={snackbarSeverity}
            onClose={handleCloseSnackbar}
          />
        </Box >
      </Fade>

    </Modal>
  );
};

export default MarketOrderTradeDetailsModal;