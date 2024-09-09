import { useState } from "react";
import {
  Container, TextField, Button, Typography, Box, Card, CardContent
} from "@mui/material";
import Slider from "react-slick";
import { generateFlashcards } from "../api"; // Assuming API call is here
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Flashcards = () => {
  const [prompt, setPrompt] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateFlashcards = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await generateFlashcards(prompt); // Ensure prompt is passed as string
      console.log("Flashcards response:", response); // Log the response
      setFlashcards(response.flashcards || []); // Ensure correct response format
    } catch (err) {
      setError("Failed to generate flashcards.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Flashcard Generator</Typography>
      <Box mb={2}>
        <TextField
          label="Enter Text for Flashcards"
          multiline
          rows={4}
          fullWidth
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateFlashcards}
        disabled={loading || !prompt}
      >
        {loading ? "Generating..." : "Generate Flashcards"}
      </Button>

      {error && <Typography color="error">{error}</Typography>}

      {flashcards.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5">Flashcards</Typography>
          <Slider {...settings}>
            {flashcards.map((card, index) => (
              <Box key={index} px={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Flashcard {index + 1}</Typography>
                    <Typography color="textSecondary">Front:</Typography>
                    <Typography>{card.front}</Typography>
                    <Typography color="textSecondary" mt={2}>Back:</Typography>
                    <Typography>{card.back}</Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      )}
    </Container>
  );
};

export default Flashcards;
