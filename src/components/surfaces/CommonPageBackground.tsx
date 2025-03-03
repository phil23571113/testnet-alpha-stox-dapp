import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";


function useMediaQuery(query: string) : boolean{
    const [matches, setMatches] = useState(false);
  
    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      
      const listener = () => setMatches(media.matches);
      media.addEventListener('change', listener);
      
      return () => media.removeEventListener('change', listener);
    }, [matches, query]);
  
    return matches;
  }
interface CommonPageBackgroundProps {
    children: React.ReactNode;
}
const CommonPageBackground: React.FC<CommonPageBackgroundProps> = ({ children }) => {
    const isMediumScreen = useMediaQuery('(min-width: 1351px)');
    return(

    <div className='pageSurroundingArea'
        style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundImage: 'url(./welcome-page-bg.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '100vh',
            backgroundSize: isMediumScreen ? '100% auto' : 'auto',

            
        }}
    >
        <CssBaseline />

        <Container >
            <Box className='innerBoxArea' sx={{ flexGrow: 1, padding: '20px', borderRadius: '8px' }}>
                {children}
            </Box>
        </Container>
    </div>
)};


interface SimplePageBackgroundProps {
    children: React.ReactNode;
}
const SimplePageBackground: React.FC<SimplePageBackgroundProps> = ({ children }) => (
    <div className='simplePageSurroundingArea'
        style={{
            display: 'flex',
            justifyContent: 'center',
            backgroundImage: 'url(./misc-page-bg.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '100vh',
        }}
    >
        <CssBaseline />

        <Container >
            <Box className='innerBoxArea' sx={{ flexGrow: 1, padding: '20px', borderRadius: '8px' }}>
                {children}
            </Box>
        </Container>
    </div>

);

export  {CommonPageBackground, SimplePageBackground};