import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { getPair, setPair } from '../api';  // API call for pairing

const PairPage = () => {
    const email = sessionStorage.getItem('userEmail');
    const [partner, setPartner] = useState(null);
    const [pairingStatus, setPairingStatus] = useState(false);

    useEffect(() => {
        // Fetch current pairing status
        getPair(email)
          .then(response => {
            setPartner(response.data.pair.partner);
            setPairingStatus(response.data.pair.enable);
          })
          .catch(error => console.error("Error fetching pairing status:", error));
      }, [email]);

    const handlePair = () => {
        setPairingStatus(true);
        setPair(email)
          .then(response => {
            setPartner(response.data.partner);
          })
          .catch(error => console.error("Error pairing:", error));
    };

    return (
        <Container>
            <Box>
                <Typography variant="h4">Pair with a Partner</Typography>
                {partner ? (
                    <Typography variant="h6">You are paired with: {partner}</Typography>
                ) : (
                    <Button variant="contained" color="primary" onClick={handlePair}>
                        Pair with a Partner
                    </Button>
                )}
            </Box>
        </Container>
    );
};

export default PairPage;
