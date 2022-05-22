import Container from '@mui/material/Container';
import { useParams } from 'react-router-dom';
import PostsGrid from '../../postsGrid/postsGrid';
import './homePage.css';

const CATEGORY_DESCRIPTION = {
  food: 'We all love it, don’t we? The passion for food is universal. No matter your taste or preference, there are dishes that will make you swoon! From juicy burgers to shawarmas and everything in between, the options seem endless when we think about all the delicious things this world has offered us so far. In this category, you can discover some mouthwatering goodies and suggest some as well!',
  music:
    '"Never gonna give you up, Never gonna let you down" see, you got Rickrolled there. Music is a universal language that everyone can understand, no matter their background or culture. There are so many different types of music out there for you to explore, and it\'s never too late to start! Here in this category, you can discover some new sounds and suggest some too!',
  sport:
    "In this category, you'll find all sorts of articles about sports, whether it be football, basketball, or Formula 1 racing! Read up on the latest happenings in each sport and then write your own article as well! Hey, we might actually settle the debate on who's the GOAT between Messi and Ronaldo! But we have to agree that Michael Schumacher is best driver ever;)",
  technology:
    "Nerd alert! The latest news in technology? You got it! A lot is going on in the world of technology, and we're here to keep you up-to-date with all the newest innovations. So, sit back and enjoy some quality articles by our users. And hey, don't forget, you can write yours as well (don't wait for the robots to write some for ya.)",
};

const HomePage = () => {
  const { category } = useParams();



  return (
    <Container maxWidth="lg" className="home-page">
      <PostsGrid title={category || 'Latest Articles'} description={CATEGORY_DESCRIPTION[category]} category={category} />
    </Container>
  );
};

export default HomePage;
