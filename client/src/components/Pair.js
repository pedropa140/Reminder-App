import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, List, ListItem, ListItemText, Card, CardContent, Divider } from '@mui/material';
import { getPair, setPair, getGoals } from '../api';  // API calls

const PairPage = () => {
    const email = sessionStorage.getItem('userEmail');
    const [partner, setPartner] = useState(null);
    const [pairingStatus, setPairingStatus] = useState(false);
    const [userGoals, setUserGoals] = useState([]);
    const [partnerGoals, setPartnerGoals] = useState([]);
    const [noPartnerMessage, setNoPartnerMessage] = useState("");  // State for no partner message

    useEffect(() => {
        // Fetch current pairing status and goals
        getPair(email)
            .then(response => {
                const partnerData = response.data.partner;
                setPartner(partnerData);
                setPairingStatus(partnerData.pair.enable);

                // Fetch goals for both the user and their partner
                getGoals(email).then(response => {
                    setUserGoals(response.data.activeGoals);
                });

                if (partnerData && partnerData.email) {
                    getGoals(partnerData.email).then(response => {
                        setPartnerGoals(response.data.activeGoals);
                    });
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    setNoPartnerMessage("There are no active partners to pair with at the moment.");
                } else {
                    console.error("Error fetching pairing status:", error);
                }
            });
    }, [email]);

    const handlePair = () => {
        setPair(email)
            .then(response => {
                setPartner(response.data.partner);
                setPairingStatus(response.data.partner.pair.enable);

                // Fetch partner goals after pairing
                getGoals(response.data.partner.email).then(response => {
                    setPartnerGoals(response.data);
                });
            })
            .catch(error => console.error("Error pairing:", error));
    };

    // Function to render tasks with completed ones crossed out
    const renderTasks = (tasks) => (
        <List>
            {tasks.map((task, index) => (
                <ListItem key={index}>
                    <ListItemText
                        primary={task.name}
                        style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                    />
                </ListItem>
            ))}
        </List>
    );

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" gutterBottom align="center">Pair with a Partner</Typography>

                {/* No Partner Available Message */}
                {noPartnerMessage && (
                    <Typography variant="h6" color="error" align="center" paragraph>
                        {noPartnerMessage}
                    </Typography>
                )}

                {/* Pairing Status Section */}
                {pairingStatus ? (
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h6">You are paired with:</Typography>
                        <Typography variant="h5">{partner.firstName} {partner.lastName}</Typography>
                        <Typography variant="body1" color="textSecondary">{partner.email}</Typography>
                    </Box>
                ) : (
                    !noPartnerMessage && (
                        <Box textAlign="center" mb={4}>
                            <Button variant="contained" color="primary" onClick={handlePair}>
                                Pair with a Partner
                            </Button>
                        </Box>
                    )
                )}

                {/* User's Active Goals */}
                <Box mt={4}>
                    <Typography variant="h5" gutterBottom>Your Active Goals</Typography>
                    {userGoals.length > 0 ? (
                        userGoals.map((goal, index) => (
                            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">{goal.title}</Typography>
                                    {renderTasks(goal.activeTasks)}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography>No active goals.</Typography>
                    )}
                </Box>

                {/* Partner's Active Goals */}
                {partner && (
                    <Box mt={4}>
                        <Typography variant="h5" gutterBottom>Partner's Active Goals</Typography>
                        {partnerGoals.length > 0 ? (
                            partnerGoals.map((goal, index) => (
                                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">{goal.title}</Typography>
                                        {renderTasks(goal.activeTasks)}
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography>Your partner has no active goals.</Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default PairPage;
