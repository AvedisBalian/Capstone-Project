import { Link } from 'react-router-dom';

const Categories = () => {
  return (
    <>
      <Link to="/categories/food">Food</Link>
      <Link to="/categories/music">Music</Link>
      <Link to="/categories/sports">Sport</Link>
      <Link to="/categories/technologies">Technology</Link>
    </>
  );
};

export default Categories;
