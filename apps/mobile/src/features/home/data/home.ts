import type { ImageSourcePropType } from 'react-native';

export type Category = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};

export const categories: Category[] = [
  {
    id: 'flights',
    title: 'home.flights',
    image: require('../../../shared/assets/images/category-flight.png'),
  },
  {
    id: 'tours',
    title: 'home.tours',
    image: require('../../../shared/assets/images/category-tour.png'),
  },
  {
    id: 'hotels',
    title: 'home.hotels',
    image: require('../../../shared/assets/images/category-hotel.png'),
  },
  {
    id: 'transfers',
    title: 'home.transfers',
    image: require('../../../shared/assets/images/category-transfer.png'),
  },
];
