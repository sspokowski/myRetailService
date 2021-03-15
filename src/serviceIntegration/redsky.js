import axios from 'axios';

const redskyUrl = 'https://redsky.target.com/v3/pdp/tcin';
axios.defaults.baseURL = redskyUrl;
const excludeQuery = '?excludes=taxonomy,price,promotion,bulk_ship,rating_and_review_reviews,rating_and_review_statistics,question_answer_statistics&key=candidate';
const getProduct = async (id) => {
  try {
    const response = await axios.get(`/${id}${excludeQuery}`);
    return response.data;
  } catch (error) {
    console.error('Error occurred in Redsky API Call', error);
    throw new Error('Error occurred in Redsky API call', error);
  }
};

export default getProduct;
