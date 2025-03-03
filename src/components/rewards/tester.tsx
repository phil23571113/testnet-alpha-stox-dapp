import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { ButtonTypography, GenericTypography } from '../../assets/elements/CustomTypography';
import { Button, Container, Box, List, ListItem, ListItemIcon, ListItemText, Divider, Card, CardContent } from '@mui/material';
import { DiscordIcon } from '../../assets/icons/DiscordIcon';
import { AirdropIcon } from "../../assets/icons/AirdropIcon";
import { CheckIcon } from '../../assets/icons/CheckIcon';
import { PreSaleIcon } from '../../assets/icons/PreSaleIcon';
import { StocksExchangeIcon } from '../../assets/icons/StocksExchangeIcon';

function Tester() {
  const steps = [
    {
      title: "Join our Discord Server",
      description: "Connect with our community on Discord and get support during testing.",
      icon: <DiscordIcon />
    },
    {
      title: "Drop your address",
      description: "Drop your ETH Wallet Address in the Discord Faucet Channel to receive testnet STOX tokens, testnet BaseETH and testnet NVIDIA tokens on BASE SEPOLIA network",
      icon: <AirdropIcon />
    },
    {
      title: "Navigate to the TRADING page",
      description: "Visit https://stoxtrading.com/trading to access the order book interface",
      icon: <PreSaleIcon />
    },
    {
      title: "Start trading on the testnet",
      description: "Place limit and market orders to test the platform functionality",
      icon: <CheckIcon />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={5}>
        {/* Header Section */}
        <Grid>
          <GenericTypography id='testers-rewards' usage='title' fontSize="2.2rem" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            TESTNET USER REWARDS PROGRAM
          </GenericTypography>
          <GenericTypography fontSize="1.5rem" align="center"  >
            Become a tester and earn STOX tokens for helping us improve the platform
          </GenericTypography>
        </Grid>

        {/* Steps Section */}
        <Grid>

          <GenericTypography usage='subTitle' fontSize="1.8rem" gutterBottom sx={{ fontWeight: 'bold' }}>
            How to Participate
          </GenericTypography>

          <Grid container spacing={3}>
            {steps.map((step, index) => (
              <Grid key={index} size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', 
                  backgroundColor:'black',
                  borderColor: 'white',}}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                        
                       
                        width: 36,
                        height: "2rem",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        color: 'white'
                      }}>
                        <GenericTypography usage='subTitle' fontSize="2rem" >
                          {index + 1}
                        </GenericTypography>
                      </Box>
                      <GenericTypography usage='subTitle' fontSize="1.2rem" >
                        {step.title}
                      </GenericTypography>
                    </Box>

                    <GenericTypography fontSize="1.2rem"  sx={{ mb: 2 }}>
                      {step.description}
                    </GenericTypography>
                  </CardContent>
                  <Grid  marginBottom='1rem'  sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                    {index === 0 && (
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<DiscordIcon />}
                        
                        sx={{
                          height: '2.5rem',
                          width :'12rem',
                          backgroundColor: '#5865F2',
                          '&:hover': {
                            backgroundColor: '#4752C4',
                          },
                          textTransform: 'none',
                          mt: 2
                        }}
                        component="a"
                        href="https://discord.gg/39P3FdqmXT"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ButtonTypography sx={{ color: 'white' }}>
                          Join Discord
                        </ButtonTypography>
                      </Button>
                    )}
                    {index === 1 && (
                      <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        sx={{
                          height: '2.5rem',
                          width :'12rem',
                          textTransform: 'none',
                          mt: 2
                        }}
                        component="a"
                        href="https://discord.gg/39P3FdqmXT"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ButtonTypography sx={{ color: 'white' }}>
                          Get TESTNET Tokens
                        </ButtonTypography>
                      </Button>
                    )}
                    {index === 2 && (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                          height: '2.5rem',
                          width :'12rem',
                          textTransform: 'none',
                          mt: 2
                        }}
                        component="a"
                        href="https://stoxtrading.com/trading"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ButtonTypography sx={{ color: 'white' }}>
                          Visit the Trading Page
                        </ButtonTypography>
                      </Button>
                    )}
                  </Grid>

                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Rewards Section */}
        <Grid>
          <GenericTypography usage='title' fontSize="1.8rem" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Reward Distribution
          </GenericTypography>

          <Box sx={{ mb: 4 }}>
            <GenericTypography usage='subTitle' fontSize="1.5rem" gutterBottom sx={{ fontWeight: 'bold' }}>
              Eligibility Criteria
            </GenericTypography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="white" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <GenericTypography fontSize="1.2rem" gutterBottom>
                      Place at least 3 orders in the Order Book
                    </GenericTypography>
                  }
                  secondary={
                    <GenericTypography fontSize="1.2rem" gutterBottom>
                      Both limit and market orders count toward this requirement
                    </GenericTypography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StocksExchangeIcon color="white" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <GenericTypography fontSize="1.2rem" gutterBottom>
                      Participate between March 1, 2025 and April 30, 2025
                    </GenericTypography>
                  }
                  secondary={
                    <GenericTypography fontSize="1.2rem" gutterBottom>
                      All trading activity must occur during this period to be eligible
                    </GenericTypography>
                  }

                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DiscordIcon style={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <GenericTypography fontSize="1.2rem" gutterBottom>
                      Link your ETH wallet address with your Discord account
                    </GenericTypography>
                  }
                  secondary={
                    <GenericTypography fontSize="1.2rem" gutterBottom>
                      Only ETH wallet addresses associated with Discord accounts will be rewarded
                    </GenericTypography>
                  }
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <GenericTypography usage='subTitle' fontSize="1.5rem" gutterBottom sx={{ fontWeight: 'bold' }}>
              Reward Details
            </GenericTypography>
            <Box sx={{
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              p: 3,
              borderRadius: 2,
              border: '1px solid rgba(25, 118, 210, 0.2)',
            }}>
              <GenericTypography fontSize="1.2rem" gutterBottom>
                Top 100 active traders will receive 150 STOX Mainnet tokens each as a reward for their participation and feedback.
              </GenericTypography>
              <GenericTypography fontSize="1.2rem" gutterBottom>
                Rankings will be determined based on trading activity, order volume, and quality of feedback provided.
              </GenericTypography>
              <GenericTypography fontSize="1.2rem" gutterBottom>
                Rewards will be distributed within two weeks after the end of the testing period.
              </GenericTypography>
            </Box>
          </Box>
        </Grid>



      </Stack>
    </Container>
  );
}

export { Tester };